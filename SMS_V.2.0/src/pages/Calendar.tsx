import React, { useState, useEffect } from 'react';
import { CalendarGrid } from '../components/features/calendar/CalendarGrid';
import { 
  generatePaymentEvents, 
  generateCalendarGrid, 
  getTodayPayments, 
  getWeeklyPayments, 
  calculateMonthlyTotal,
  formatAmount
} from '../utils/calendar';
import { type Subscription } from '../types/database.types';
import { 
  CalendarIcon,
  CreditCardIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [exchangeRate] = useState(1300);
  const [isLoading, setIsLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  // Generate calendar data
  const events = generatePaymentEvents(subscriptions, year, month, exchangeRate);
  const calendar = generateCalendarGrid(year, month, events);
  const todayPayments = getTodayPayments(events);
  const weeklyPayments = getWeeklyPayments(events);
  const monthlyTotal = calculateMonthlyTotal(events);

  useEffect(() => {
    // TODO: Load subscriptions from API
    const mockSubscriptions: Subscription[] = [
      {
        id: '1',
        user_id: 'user1',
        service_name: 'Netflix',
        amount: 17000,
        currency: 'KRW',
        payment_cycle: 'monthly',
        next_payment_date: '2025-01-15',
        status: 'active',
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '2',
        user_id: 'user1',
        service_name: 'Spotify',
        amount: 13900,
        currency: 'KRW',
        payment_cycle: 'monthly',
        next_payment_date: '2025-01-20',
        status: 'active',
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '3',
        user_id: 'user1',
        service_name: 'ChatGPT',
        amount: 20,
        currency: 'USD',
        payment_cycle: 'monthly',
        next_payment_date: '2025-01-25',
        status: 'active',
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }
    ];
    
    setSubscriptions(mockSubscriptions);
    setIsLoading(false);
  }, []);

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setCurrentDate(new Date(newYear, newMonth - 1, 1));
  };

  const handleDayClick = (date: Date) => {
    console.log('Clicked date:', date);
    // TODO: Show payment details modal
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-7xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-pretendard text-gray-900 tracking-ko-tight break-keep-ko mb-2">
            결제 캘린더
          </h1>
          <p className="text-gray-600 font-pretendard break-keep-ko">
            월간 구독 결제 일정을 한눈에 확인하세요
          </p>
        </div>

        <div className="@container grid @lg:grid-cols-4 gap-6">
          {/* Main Calendar */}
          <div className="@lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl overflow-hidden">
              <CalendarGrid
                calendar={calendar}
                onMonthChange={handleMonthChange}
                onDayClick={handleDayClick}
                className="p-6"
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="@lg:col-span-1 space-y-6">
            {/* Today's Payments */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold font-pretendard text-gray-900">
                  오늘의 결제
                </h3>
              </div>
              
              {todayPayments.length === 0 ? (
                <p className="text-gray-500 text-sm font-pretendard break-keep-ko">
                  오늘 예정된 결제가 없습니다
                </p>
              ) : (
                <div className="space-y-3">
                  {todayPayments.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <CreditCardIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            {event.subscriptions[0].service_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {event.subscriptions.length}개 서비스
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-gray-900">
                          {formatAmount(event.totalAmount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Weekly Summary */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <ChartBarIcon className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold font-pretendard text-gray-900">
                  이번 주 요약
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-pretendard">결제 예정</span>
                  <span className="font-semibold text-gray-900">
                    {weeklyPayments.length}건
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-pretendard">총 금액</span>
                  <span className="font-semibold text-gray-900">
                    {formatAmount(weeklyPayments.reduce((sum, e) => sum + e.totalAmount, 0))}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-pretendard">월 총액</span>
                  <span className="font-semibold text-blue-600">
                    {formatAmount(monthlyTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Upcoming Payments */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <ClockIcon className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold font-pretendard text-gray-900">
                  다가오는 결제
                </h3>
              </div>
              
              <div className="space-y-3">
                {events
                  .filter(event => event.date > new Date())
                  .slice(0, 5)
                  .map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-2 bg-orange-50 rounded-lg border border-orange-100"
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-xs font-medium text-orange-700">
                          {event.date.getDate()}일
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {event.subscriptions[0].service_name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatAmount(event.totalAmount)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;