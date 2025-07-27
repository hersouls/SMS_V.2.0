import React from 'react';
import { cn } from '../../lib/utils';
import { DESIGN_TOKENS, ICON_SIZES } from '../../lib/design-tokens';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  text 
}) => {
  const sizeClasses = {
    sm: ICON_SIZES.sm,
    md: ICON_SIZES.md,
    lg: ICON_SIZES.lg,
    xl: ICON_SIZES.xl,
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
          sizeClasses[size]
        )}
        role="status"
        aria-label="로딩 중"
      >
        <span className="sr-only">로딩 중...</span>
      </div>
      {text && (
        <p className={cn(
          DESIGN_TOKENS.KOREAN_TEXT_BASE,
          "mt-2 text-sm text-gray-600"
        )}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;