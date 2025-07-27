import React, { useState, useEffect } from 'react';
import { CalendarIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { cn } from '../lib/utils';
import { CalendarGrid } from '../components/features/calendar/CalendarGrid';
import { 
  generatePaymentEvents,
  generateCalendarGrid,
  getTodayPayments,
  getWeeklyPayments,
  calculateMonthlyTotal,
  formatAmount,
  formatDate
} from '../utils/calendar';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { useAuth } from '../contexts/AuthContext';

export default function Calendar() {
  const { user } = useAuth();
  const { subscriptions, loading } = useSubscriptions();
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  });

  // 결제 이벤트 생성
  const paymentEvents = generatePaymentEvents(
    subscriptions,
    currentDate.year,
    currentDate.month
  );

  // 캘린더 그리드 생성
  const calendar = generateCalendarGrid(
    currentDate.year,
    currentDate.month,
    paymentEvents
  );

  // 오늘의 결제 예정
  const todayPayments = getTodayPayments(paymentEvents);
  
  // 이번 주 결제 예정
  const weeklyPayments = getWeeklyPayments(paymentEvents);
  
  // 월간 총 결제액
  const monthlyTotal = calculateMonthlyTotal(paymentEvents);

  const handleMonthChange = (year: number, month: number) => {
    setCurrentDate({ year, month });
  };

  const handleDayClick = (date: Date) => {
    // 날짜 클릭 시 상세 정보 모달 또는 페이지로 이동
    console.log('Selected date:', date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl h-96"></div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-xl h-32"></div>
                <div className="bg-white rounded-xl h-48"></div>
                <div className="bg-white rounded-xl h-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CalendarIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold font-pretendard text-gray-900 tracking-ko-tight">
              결제 캘린더
            </h1>
          </div>
          <p className="text-gray-600 font-pretendard tracking-ko-normal">
            월간 결제 일정을 한눈에 확인하고 관리하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 캘린더 */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <CalendarGrid
                calendar={calendar}
                onMonthChange={handleMonthChange}
                onDayClick={handleDayClick}
              />
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 오늘의 결제 */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ClockIcon className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold font-pretendard text-gray-900">
                  오늘의 결제
                </h3>
              </div>
              
              {todayPayments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📅</div>
                  <p className="text-gray-500 font-pretendard">
                    오늘 결제 예정이 없습니다
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayPayments.map(event => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-800">
                          {event.subscriptions[0].service_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 font-pretendard">
                            {event.subscriptions[0].service_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {event.subscriptions.length > 1 && `외 ${event.subscriptions.length - 1}개`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatAmount(event.totalAmount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 이번 주 결제 예정 */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold font-pretendard text-gray-900">
                  이번 주 결제 예정
                </h3>
              </div>
              
              {weeklyPayments.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 font-pretendard text-sm">
                    이번 주 결제 예정이 없습니다
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {weeklyPayments.slice(0, 5).map(event => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500 font-pretendard">
                          {formatDate(event.date)}
                        </div>
                        <span className="text-gray-900 font-pretendard">
                          {event.subscriptions[0].service_name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {formatAmount(event.totalAmount)}
                      </span>
                    </div>
                  ))}
                  {weeklyPayments.length > 5 && (
                    <div className="text-center pt-2">
                      <p className="text-sm text-gray-500 font-pretendard">
                        외 {weeklyPayments.length - 5}개 더
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 월간 총 결제액 */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CurrencyDollarIcon className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold font-pretendard text-gray-900">
                  월간 총 결제액
                </h3>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatAmount(monthlyTotal)}
                </div>
                <p className="text-sm text-gray-500 font-pretendard">
                  {paymentEvents.length}일의 결제 예정
                </p>
              </div>
            </div>

            {/* 빠른 액션 */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold font-pretendard mb-3">
                빠른 액션
              </h3>
              <div className="space-y-2">
                <button className="w-full py-2 px-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200 font-pretendard text-sm">
                  구독 추가하기
                </button>
                <button className="w-full py-2 px-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200 font-pretendard text-sm">
                  알림 설정
                </button>
                <button className="w-full py-2 px-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200 font-pretendard text-sm">
                  리포트 보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}