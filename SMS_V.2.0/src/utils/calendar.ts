import type { Subscription } from '../types/database.types';

export interface CalendarEvent {
  id: string;
  date: Date;
  subscriptions: Subscription[];
  totalAmount: number;
  currency: string;
  isToday: boolean;
  isUpcoming: boolean;
  isPast: boolean;
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
  isWeekend: boolean;
}

export interface PaymentDate {
  subscriptionId: string;
  serviceName: string;
  amount: number;
  currency: string;
  nextPaymentDate: Date;
  serviceIcon?: string;
}

export interface ServiceIcon {
  name: string;
  icon: string;
  color: string;
}

// Service icons mapping
export const SERVICE_ICONS: Record<string, ServiceIcon> = {
  'Netflix': { name: 'Netflix', icon: '🎬', color: 'bg-red-100 text-red-800' },
  'Spotify': { name: 'Spotify', icon: '🎵', color: 'bg-green-100 text-green-800' },
  'YouTube': { name: 'YouTube', icon: '📺', color: 'bg-red-100 text-red-800' },
  'ChatGPT': { name: 'ChatGPT', icon: '🤖', color: 'bg-green-100 text-green-800' },
  'GitHub': { name: 'GitHub', icon: '💻', color: 'bg-gray-100 text-gray-800' },
  'Adobe': { name: 'Adobe', icon: '🎨', color: 'bg-purple-100 text-purple-800' },
  'Microsoft': { name: 'Microsoft', icon: '💼', color: 'bg-blue-100 text-blue-800' },
  'Apple': { name: 'Apple', icon: '🍎', color: 'bg-gray-100 text-gray-800' },
  'Google': { name: 'Google', icon: '🔍', color: 'bg-blue-100 text-blue-800' },
  'Amazon': { name: 'Amazon', icon: '📦', color: 'bg-orange-100 text-orange-800' },
  'Disney': { name: 'Disney', icon: '🏰', color: 'bg-purple-100 text-purple-800' },
  'Hulu': { name: 'Hulu', icon: '📺', color: 'bg-green-100 text-green-800' },
  'Twitch': { name: 'Twitch', icon: '🎮', color: 'bg-purple-100 text-purple-800' },
  'Discord': { name: 'Discord', icon: '💬', color: 'bg-indigo-100 text-indigo-800' },
  'Slack': { name: 'Slack', icon: '💼', color: 'bg-purple-100 text-purple-800' },
  'Zoom': { name: 'Zoom', icon: '📹', color: 'bg-blue-100 text-blue-800' },
  'Dropbox': { name: 'Dropbox', icon: '📁', color: 'bg-blue-100 text-blue-800' },
  'Notion': { name: 'Notion', icon: '📝', color: 'bg-gray-100 text-gray-800' },
  'Figma': { name: 'Figma', icon: '🎨', color: 'bg-purple-100 text-purple-800' },
  'Canva': { name: 'Canva', icon: '🎨', color: 'bg-blue-100 text-blue-800' }
};

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
  const today = new Date();

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

      const isToday = paymentDate.toDateString() === today.toDateString();
      const isUpcoming = paymentDate > today;
      const isPast = paymentDate < today && !isToday;

      if (existingEvent) {
        existingEvent.subscriptions.push(subscription);
        existingEvent.totalAmount += amountInKRW;
      } else {
        events.push({
          id: `${subscription.id}-${paymentDate.getTime()}`,
          date: paymentDate,
          subscriptions: [subscription],
          totalAmount: amountInKRW,
          currency: 'KRW',
          isToday,
          isUpcoming,
          isPast
        });
      }
    });
  });

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * 구독의 결제일 계산 (개선된 버전)
 */
function calculatePaymentDates(
  subscription: Subscription,
  monthStart: Date,
  monthEnd: Date
): Date[] {
  const dates: Date[] = [];

  const cycle = subscription.payment_cycle;
  const startDate = subscription.start_date ? new Date(subscription.start_date) : new Date();
  const billingDay = subscription.payment_day || 1;

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
 * 다음 결제일 계산 (개선된 버전)
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
 * 캘린더 그리드 생성 (개선된 버전)
 */
export function generateCalendarGrid(
  year: number,
  month: number,
  events: CalendarEvent[]
): CalendarGrid {
  const firstDay = new Date(year, month - 1, 1);
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

      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;

      days.push({
        date: currentDate,
        events: dayEvents,
        isToday: currentDate.toDateString() === today.toDateString(),
        isCurrentMonth: currentDate.getMonth() === month - 1,
        isPast: currentDate < today && currentDate.toDateString() !== today.toDateString(),
        isWeekend
      });
    }
    
    weeks.push({ days });
  }

  return { year, month, weeks };
}

/**
 * 서비스 아이콘 가져오기
 */
export function getServiceIcon(serviceName: string): ServiceIcon {
  return SERVICE_ICONS[serviceName] || {
    name: serviceName,
    icon: '📱',
    color: 'bg-gray-100 text-gray-800'
  };
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
 * 금액 포맷팅 (개선된 버전)
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
 * 상대적 날짜 포맷팅 (오늘, 내일, 모레 등)
 */
export function formatRelativeDate(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  if (date.toDateString() === today.toDateString()) {
    return '오늘';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return '내일';
  } else if (date.toDateString() === dayAfterTomorrow.toDateString()) {
    return '모레';
  } else {
    return formatDate(date);
  }
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

/**
 * 다가오는 결제 목록 (다음 7일)
 */
export function getUpcomingPayments(events: CalendarEvent[], days: number = 7): CalendarEvent[] {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + days);

  return events.filter(event => 
    event.date > today && event.date <= endDate
  ).sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * 결제 통계 계산
 */
export function calculatePaymentStats(events: CalendarEvent[]) {
  const today = new Date();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  const monthlyEvents = events.filter(event => 
    event.date.getMonth() === thisMonth && 
    event.date.getFullYear() === thisYear
  );

  const upcomingEvents = events.filter(event => event.date > today);
  const pastEvents = events.filter(event => event.date < today);

  return {
    total: events.length,
    monthly: monthlyEvents.length,
    upcoming: upcomingEvents.length,
    past: pastEvents.length,
    monthlyTotal: calculateMonthlyTotal(monthlyEvents),
    upcomingTotal: calculateMonthlyTotal(upcomingEvents),
    pastTotal: calculateMonthlyTotal(pastEvents)
  };
}

/**
 * 통화별 금액 분리
 */
export function separateAmountsByCurrency(events: CalendarEvent[]) {
  const amounts: Record<string, number> = {};
  
  events.forEach(event => {
    event.subscriptions.forEach(subscription => {
      const currency = subscription.currency;
      const amount = subscription.currency === 'USD' 
        ? subscription.amount * 1300 // TODO: Use actual exchange rate
        : subscription.amount;
      
      amounts[currency] = (amounts[currency] || 0) + amount;
    });
  });

  return amounts;
}