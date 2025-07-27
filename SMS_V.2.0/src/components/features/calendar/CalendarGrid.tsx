import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { cn } from '../../../lib/utils';
import { 
  type CalendarGrid as CalendarGridType, 
  type CalendarDay, 
  formatMonthName,
  formatAmount,
  formatDate,
  getServiceIcon
} from '../../../utils/calendar';
import Typography from '../../ui/Typography';

interface CalendarGridProps {
  calendar: CalendarGridType;
  onMonthChange: (year: number, month: number) => void;
  onDayClick?: (date: Date) => void;
  className?: string;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  calendar,
  onMonthChange,
  onDayClick,
  className
}) => {
  const handlePreviousMonth = () => {
    const newDate = new Date(calendar.year, calendar.month - 2, 1);
    onMonthChange(newDate.getFullYear(), newDate.getMonth() + 1);
  };

  const handleNextMonth = () => {
    const newDate = new Date(calendar.year, calendar.month, 1);
    onMonthChange(newDate.getFullYear(), newDate.getMonth() + 1);
  };

  const handleToday = () => {
    const today = new Date();
    onMonthChange(today.getFullYear(), today.getMonth() + 1);
  };

  const renderDayEvents = (day: CalendarDay) => {
    if (day.events.length === 0) return null;

    return (
      <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-1">
        {day.events.slice(0, 3).map((event) => {
          const serviceIcon = getServiceIcon(event.subscriptions[0].service_name);
          return (
            <div
              key={event.id}
              className={cn(
                "flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full border font-pretendard tracking-ko-normal",
                serviceIcon.color,
                "hover:scale-105 transition-transform duration-200"
              )}
              title={`${event.subscriptions.map(s => s.service_name).join(', ')} - ${formatAmount(event.totalAmount)}`}
            >
              <span className="text-sm">{serviceIcon.icon}</span>
              <span className="hidden @sm:inline font-medium">
                {formatAmount(event.totalAmount)}
              </span>
            </div>
          );
        })}
        {day.events.length > 3 && (
          <div className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full border border-gray-200 font-pretendard tracking-ko-normal">
            +{day.events.length - 3}
          </div>
        )}
      </div>
    );
  };

  const renderDayTooltip = (day: CalendarDay) => {
    if (day.events.length === 0) return null;

    return (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 card-glass text-sm rounded-xl shadow-2xl z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none min-w-[280px]">
        <div className="font-semibold mb-2 text-gray-900 border-b border-gray-100 pb-2 font-pretendard tracking-ko-normal">
          {day.date && formatDate(day.date)}
        </div>
        <div className="space-y-2">
          {day.events.map(event => {
            const serviceIcon = getServiceIcon(event.subscriptions[0].service_name);
            return (
              <div key={event.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-sm",
                    serviceIcon.color
                  )}>
                    {serviceIcon.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 font-pretendard tracking-ko-normal">
                      {event.subscriptions[0].service_name}
                    </div>
                    {event.subscriptions.length > 1 && (
                      <div className="text-xs text-gray-500 font-pretendard tracking-ko-normal">
                        외 {event.subscriptions.length - 1}개 서비스
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 font-pretendard tracking-ko-normal">
                    {formatAmount(event.totalAmount)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {day.events.length > 1 && (
          <div className="border-t border-gray-100 mt-2 pt-2 font-semibold text-gray-900 flex justify-between font-pretendard tracking-ko-normal">
            <span>총 결제액</span>
            <span>{formatAmount(day.events.reduce((sum, e) => sum + e.totalAmount, 0))}</span>
          </div>
        )}
      </div>
    );
  };

  const getDayBackgroundColor = (day: CalendarDay) => {
    if (day.isToday) {
      return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200';
    }
    if (day.events.length > 0) {
      const hasUpcoming = day.events.some(event => event.isUpcoming);
      const hasToday = day.events.some(event => event.isToday);
      if (hasToday) {
        return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
      }
      if (hasUpcoming) {
        return 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200';
      }
      return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200';
    }
    return 'bg-white hover:bg-gray-50';
  };

  return (
    <div className={cn("@container", className)}>
      {/* 캘린더 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <Typography.H2 className="text-gray-900">
          {formatMonthName(calendar.year, calendar.month)}
        </Typography.H2>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousMonth}
            className="p-2 rounded-lg card-glass border border-gray-200 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:shadow-md"
            aria-label="이전 달"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          
          <button
            onClick={handleToday}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:shadow-md font-pretendard tracking-ko-normal"
          >
            오늘
          </button>
          
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg card-glass border border-gray-200 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:shadow-md"
            aria-label="다음 달"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 캘린더 그리드 */}
      <div className="card-glass rounded-2xl shadow-xl overflow-hidden">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
            <div
              key={day}
              className={cn(
                "px-3 py-4 text-center text-sm font-semibold text-gray-900 font-pretendard tracking-ko-normal",
                index === 0 && "text-red-600",
                index === 6 && "text-blue-600"
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7">
          {calendar.weeks.map((week, weekIndex) =>
            week.days.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={cn(
                  "relative min-h-[100px] p-2 border-r border-b border-gray-200 transition-all duration-300 group cursor-pointer",
                  getDayBackgroundColor(day),
                  !day?.isCurrentMonth && "bg-gray-25 text-gray-400",
                  day?.isWeekend && "bg-gray-25/50",
                  "hover:shadow-lg hover:scale-[1.02] hover:z-10",
                  dayIndex === 6 && "border-r-0"
                )}
                onClick={() => {
                  if (day?.date) {
                    onDayClick?.(day.date);
                  }
                }}
                tabIndex={day?.date ? 0 : -1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (day?.date) {
                      onDayClick?.(day.date);
                    }
                  }
                }}
                role={day?.date ? "button" : undefined}
                aria-label={day?.date ? `${formatDate(day.date)} - ${day.events.length}개 결제 예정` : undefined}
              >
                {day?.date && (
                  <>
                    <div
                      className={cn(
                        "text-sm font-semibold mb-2 font-pretendard tracking-ko-normal",
                        day.isToday && "text-blue-700 font-bold",
                        !day.isCurrentMonth && "text-gray-400",
                        day.isWeekend && "text-gray-600"
                      )}
                    >
                      {day.date.getDate()}
                    </div>
                    
                    {renderDayEvents(day)}
                    {renderDayTooltip(day)}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 접근성 개선을 위한 숨겨진 설명 */}
      <div className="sr-only">
        <p>결제 캘린더입니다. 각 날짜를 클릭하면 해당 날짜의 결제 상세 정보를 확인할 수 있습니다.</p>
        <p>파란색 배경은 오늘 날짜를 나타냅니다.</p>
        <p>노란색 배경은 다가오는 결제가 있는 날짜를 나타냅니다.</p>
        <p>초록색 배경은 오늘 결제가 있는 날짜를 나타냅니다.</p>
        <p>각 결제는 서비스 아이콘과 함께 표시됩니다.</p>
      </div>
    </div>
  );
};