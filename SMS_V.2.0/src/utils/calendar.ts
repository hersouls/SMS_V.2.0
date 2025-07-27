import { Subscription } from '../types/database.types';

export interface CalendarEvent {
  id: string;
  date: Date;
  subscriptions: Subscription[];
  totalAmount: number;
  currency: string;
}

export interface CalendarGrid {
  year: number;
  month: number;
  weeks: CalendarWeek[];
}

export interface CalendarWeek {
  days: CalendarDay[];
}

export interface CalendarDay {
  date: Date | null;
  events: CalendarEvent[];
  isToday: boolean;
  isCurrentMonth: boolean;
  isPast: boolean;
}

export interface PaymentDate {
  subscriptionId: string;
  serviceName: string;
  amount: number;
  currency: string;
  nextPaymentDate: Date;
  serviceIcon?: string;
}

/**
 * 구독 데이터로부터 결제일을 계산하여 캘린더 이벤트 생성
 */
export function generatePaymentEvents(
  subscriptions: Subscription[],
  year: number,
  month: number,
  exchangeRate: number = 1300
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);

  subscriptions.forEach(subscription => {
    if (subscription.status !== 'active') return;

    const paymentDates = calculatePaymentDates(
      subscription,
      monthStart,
      monthEnd
    );

    paymentDates.forEach(paymentDate => {
      const existingEvent = events.find(event => 
        event.date.toDateString() === paymentDate.toDateString()
      );

      const amountInKRW = subscription.currency === 'USD' 
        ? subscription.amount * exchangeRate 
        : subscription.amount;

      if (existingEvent) {
        existingEvent.subscriptions.push(subscription);
        existingEvent.totalAmount += amountInKRW;
      } else {
        events.push({
          id: `${subscription.id}-${paymentDate.getTime()}`,
          date: paymentDate,
          subscriptions: [subscription],
          totalAmount: amountInKRW,
          currency: 'KRW'
        });
      }
    });
  });

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * 구독의 결제일 계산
 */
function calculatePaymentDates(
  subscription: Subscription,
  monthStart: Date,
  monthEnd: Date
): Date[] {
  const dates: Date[] = [];
  const startDate = new Date(subscription.start_date);
  const billingDay = subscription.billing_day;
  const cycle = subscription.payment_cycle;

  // 시작일이 이번 달보다 이전인 경우
  if (startDate < monthStart) {
    let currentDate = new Date(monthStart);
    currentDate.setDate(billingDay);

    // 첫 번째 결제일이 이번 달에 있는지 확인
    if (currentDate >= monthStart && currentDate <= monthEnd) {
      dates.push(new Date(currentDate));
    }

    // 다음 결제일들 계산
    while (currentDate <= monthEnd) {
      currentDate = getNextBillingDate(currentDate, cycle);
      if (currentDate <= monthEnd) {
        dates.push(new Date(currentDate));
      }
    }
  } else {
    // 시작일이 이번 달에 있는 경우
    const firstPayment = new Date(startDate);
    if (firstPayment >= monthStart && firstPayment <= monthEnd) {
      dates.push(firstPayment);
    }

    // 다음 결제일들 계산
    let currentDate = new Date(firstPayment);
    while (currentDate <= monthEnd) {
      currentDate = getNextBillingDate(currentDate, cycle);
      if (currentDate <= monthEnd) {
        dates.push(new Date(currentDate));
      }
    }
  }

  return dates;
}

/**
 * 다음 결제일 계산
 */
function getNextBillingDate(currentDate: Date, cycle: string): Date {
  const nextDate = new Date(currentDate);
  
  switch (cycle) {
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    default:
      nextDate.setMonth(nextDate.getMonth() + 1);
  }
  
  return nextDate;
}

/**
 * 캘린더 그리드 생성
 */
export function generateCalendarGrid(
  year: number,
  month: number,
  events: CalendarEvent[]
): CalendarGrid {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const weeks: CalendarWeek[] = [];
  const today = new Date();

  for (let week = 0; week < 6; week++) {
    const days: CalendarDay[] = [];
    
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + week * 7 + day);
      
      const dayEvents = events.filter(event => 
        event.date.toDateString() === currentDate.toDateString()
      );

      days.push({
        date: currentDate,
        events: dayEvents,
        isToday: currentDate.toDateString() === today.toDateString(),
        isCurrentMonth: currentDate.getMonth() === month - 1,
        isPast: currentDate < today && currentDate.toDateString() !== today.toDateString()
      });
    }
    
    weeks.push({ days });
  }

  return { year, month, weeks };
}

/**
 * 월 이름 포맷팅
 */
export function formatMonthName(year: number, month: number): string {
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long' 
  });
}

/**
 * 금액 포맷팅
 */
export function formatAmount(amount: number, currency: string = 'KRW'): string {
  if (currency === 'KRW') {
    return `₩${amount.toLocaleString()}`;
  } else if (currency === 'USD') {
    return `$${amount.toLocaleString()}`;
  }
  return `${amount.toLocaleString()}`;
}

/**
 * 날짜 포맷팅
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric'
  });
}

/**
 * 오늘의 결제 예정 목록
 */
export function getTodayPayments(events: CalendarEvent[]): CalendarEvent[] {
  const today = new Date();
  return events.filter(event => 
    event.date.toDateString() === today.toDateString()
  );
}

/**
 * 이번 주 결제 예정 목록
 */
export function getWeeklyPayments(events: CalendarEvent[]): CalendarEvent[] {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return events.filter(event => 
    event.date >= weekStart && event.date <= weekEnd
  ).sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * 월간 총 결제액 계산
 */
export function calculateMonthlyTotal(events: CalendarEvent[]): number {
  return events.reduce((total, event) => total + event.totalAmount, 0);
}