import React from 'react';
import { Plus, Bug, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FloatingActionButtonsProps {
  onAddClick: () => void;
  onEmergencyClick?: () => void;
  onDebugClick?: () => void;
}

const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({ 
  onAddClick, 
  onEmergencyClick,
  onDebugClick 
}) => {
  return (
    <div className="@container fixed bottom-32 right-4 @sm:right-6 @lg:right-8 flex flex-col gap-3 z-40">
      {/* 개발 환경 전용 버튼들 */}
      {process.env.NODE_ENV === 'development' && (
        <>
          {onDebugClick && (
            <button
              onClick={onDebugClick}
              className={cn(
                "w-12 h-12 rounded-full shadow-lg hover:shadow-xl",
                "transition-all duration-300 hover:scale-110",
                "bg-yellow-500 hover:bg-yellow-600 text-white",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400",
                "flex items-center justify-center",
                "transform active:scale-95"
              )}
              aria-label="디버그 모드"
            >
              <Bug className="w-5 h-5 @sm:w-6 @sm:h-6" />
            </button>
          )}
          
          {onEmergencyClick && (
            <button
              onClick={onEmergencyClick}
              className={cn(
                "w-12 h-12 rounded-full shadow-lg hover:shadow-xl",
                "transition-all duration-300 hover:scale-110",
                "bg-red-500 hover:bg-red-600 text-white",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400",
                "flex items-center justify-center",
                "transform active:scale-95"
              )}
              aria-label="긴급 상황"
            >
              <AlertTriangle className="w-5 h-5 @sm:w-6 @sm:h-6" />
            </button>
          )}
        </>
      )}
      
      {/* 메인 액션 버튼 */}
      <button
        onClick={onAddClick}
        className={cn(
          "w-12 h-12 rounded-full shadow-lg hover:shadow-xl",
          "transition-all duration-300 hover:scale-110",
          "bg-gradient-to-br from-purple-500 to-blue-500",
          "text-white focus:ring-2 focus:ring-offset-2 focus:ring-purple-400",
          "flex items-center justify-center",
          "transform active:scale-95",
          "font-pretendard font-semibold"
        )}
        aria-label="새 구독 추가"
      >
        <Plus className="w-5 h-5 @sm:w-6 @sm:h-6" />
      </button>
    </div>
  );
};

export default FloatingActionButtons;