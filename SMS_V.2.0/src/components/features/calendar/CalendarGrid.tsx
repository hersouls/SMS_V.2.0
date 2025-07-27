import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { cn } from '../../../lib/utils';
import { 
  CalendarGrid as CalendarGridType, 
  CalendarDay, 
  CalendarEvent,
  formatMonthName,
  formatAmount,
  formatDate
} from '../../../utils/calendar';

interface CalendarGridProps {
  calendar: CalendarGridType;
  onMonthChange: (year: number, month: number) => void;
  onDayClick?: (date: Date) => void;
  className?: string;
}

const serviceIcons: Record<string, string> = {
  'Netflix': '🎬',
  'Spotify': '🎵',
  'YouTube': '📺',
  'ChatGPT': '🤖',
  'GitHub': '💻',
  'Adobe': '🎨',
  'Microsoft': '💼',
  'Apple': '🍎',
  'Google': '🔍',
  'Amazon': '📦',
  'Disney': '🏰',
  'Hulu': '📺',
  'Twitch': '🎮',
  'Discord': '💬',
  'Slack': '💼',
  'Zoom': '📹',
  'Dropbox': '📁',
  'Notion': '📝',
  'Figma': '🎨',
  'Canva': '🎨'
};

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

  const getServiceIcon = (subscription: any): string => {
    const serviceName = subscription.service_name || subscription.name || '';
    return serviceIcons[serviceName] || '📱';
  };

  const renderDayEvents = (day: CalendarDay) => {
    if (day.events.length === 0) return null;

    return (
      <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-0.5">
        {day.events.slice(0, 3).map((event, index) => (
          <div
            key={event.id}
            className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded"
            title={`${event.subscriptions.map(s => s.service_name).join(', ')} - ${formatAmount(event.totalAmount)}`}
          >
            <span>{getServiceIcon(event.subscriptions[0])}</span>
            <span className="hidden @sm:inline">
              {formatAmount(event.totalAmount)}
            </span>
          </div>
        ))}
        {day.events.length > 3 && (
          <div className="bg-gray-100 text-gray-600 text-xs px-1 py-0.5 rounded">
            +{day.events.length - 3}
          </div>
        )}
      </div>
    );
  };

  const renderDayTooltip = (day: CalendarDay) => {
    if (day.events.length === 0) return null;

    return (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="font-semibold mb-1">
          {day.date && formatDate(day.date)}
        </div>
        {day.events.map(event => (
          <div key={event.id} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1">
              <span>{getServiceIcon(event.subscriptions[0])}</span>
              <span>{event.subscriptions[0].service_name}</span>
            </span>
            <span className="font-medium">
              {formatAmount(event.totalAmount)}
            </span>
          </div>
        ))}
        <div className="border-t border-gray-700 mt-1 pt-1 font-semibold">
          총 {formatAmount(day.events.reduce((sum, e) => sum + e.totalAmount, 0))}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("@container", className)}>
      {/* 캘린더 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-pretendard text-gray-900 tracking-ko-tight">
          {formatMonthName(calendar.year, calendar.month)}
        </h2>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousMonth}
            className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="이전 달"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          
          <button
            onClick={handleToday}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            오늘
          </button>
          
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="다음 달"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 캘린더 그리드 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
            <div
              key={day}
              className={cn(
                "px-3 py-3 text-center text-sm font-medium text-gray-900 font-pretendard",
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
                  "relative min-h-[80px] p-2 border-r border-b border-gray-200 transition-colors duration-200 group",
                  day?.isToday && "bg-blue-50 border-blue-200",
                  day?.isPast && !day?.isToday && "bg-gray-50",
                  !day?.isCurrentMonth && "bg-gray-25 text-gray-400",
                  day?.events.length > 0 && "bg-yellow-25",
                  "hover:bg-gray-50 cursor-pointer",
                  dayIndex === 6 && "border-r-0"
                )}
                onClick={() => day?.date && onDayClick?.(day.date)}
                tabIndex={day?.date ? 0 : -1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    day?.date && onDayClick?.(day.date);
                  }
                }}
                role={day?.date ? "button" : undefined}
                aria-label={day?.date ? `${formatDate(day.date)} - ${day.events.length}개 결제 예정` : undefined}
              >
                {day?.date && (
                  <>
                    <div
                      className={cn(
                        "text-sm font-medium mb-1",
                        day.isToday && "text-blue-600 font-bold",
                        !day.isCurrentMonth && "text-gray-400"
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
        <p>노란색 배경은 결제 예정이 있는 날짜를 나타냅니다.</p>
      </div>
    </div>
  );
};