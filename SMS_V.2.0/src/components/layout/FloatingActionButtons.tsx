import React from 'react';
import { Plus, Bug, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { DESIGN_TOKENS } from '../../lib/design-tokens';

interface FloatingActionButtonsProps {
  onAddClick?: () => void;
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
      {/* 개발 환경 전용 버튼들 - Footer 디자인 가이드 표준 */}
      {process.env.NODE_ENV === 'development' && (
        <>
          {onDebugClick && (
            <button
              onClick={onDebugClick}
              className={cn(
                DESIGN_TOKENS.FAB_BASE,
                "bg-yellow-500 hover:bg-yellow-600 text-white",
                "focus:ring-yellow-400"
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
                DESIGN_TOKENS.FAB_BASE,
                "bg-red-500 hover:bg-red-600 text-white",
                "focus:ring-red-400"
              )}
              aria-label="긴급 상황"
            >
              <AlertTriangle className="w-5 h-5 @sm:w-6 @sm:h-6" />
            </button>
          )}
        </>
      )}
      
      {/* 메인 액션 버튼 - Footer 디자인 가이드 표준 */}
      {onAddClick && (
        <button
          onClick={onAddClick}
          className={cn(
            DESIGN_TOKENS.FAB_BASE,
            DESIGN_TOKENS.GRADIENT_ACCENT,
            "text-white focus:ring-purple-400"
          )}
          aria-label="새 구독 추가"
        >
          <Plus className="w-5 h-5 @sm:w-6 @sm:h-6" />
        </button>
      )}
    </div>
  );
};

export default FloatingActionButtons;