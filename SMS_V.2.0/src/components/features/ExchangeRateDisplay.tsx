import React from 'react';
import { CurrencyDollarIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';
import { useExchangeRate } from '../../hooks/useExchangeRate';

interface ExchangeRateDisplayProps {
  onEditClick?: () => void;
  className?: string;
  showRefreshButton?: boolean;
}

export const ExchangeRateDisplay: React.FC<ExchangeRateDisplayProps> = ({
  onEditClick,
  className,
  showRefreshButton = false
}) => {
  const {
    rate,
    isLoading,
    error,
    getFormattedRate,
    getFormattedLastUpdated,
    updateWithLatestRate
  } = useExchangeRate();

  const handleRefresh = async () => {
    await updateWithLatestRate();
  };

  const handleClick = () => {
    if (onEditClick) {
      onEditClick();
    }
  };

  return (
    <div className={cn("@container", className)}>
      <div
        className={cn(
          "bg-white/80 backdrop-blur-md rounded-xl border border-white/20 p-4",
          "hover:bg-white/90 transition-all duration-200",
          onEditClick && "cursor-pointer hover:shadow-lg",
          "group"
        )}
        onClick={handleClick}
        role={onEditClick ? "button" : undefined}
        tabIndex={onEditClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (onEditClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onEditClick();
          }
        }}
        aria-label={onEditClick ? "환율 설정을 편집하려면 클릭하세요" : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 text-blue-600" />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold font-pretendard text-gray-900">
                  USD → KRW 환율
                </h3>
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                )}
              </div>
              
              {error ? (
                <p className="text-sm text-red-600 font-pretendard">
                  {error}
                </p>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900 font-pretendard">
                    {rate.toLocaleString()}
                  </p>
                  <span className="text-sm text-gray-500 font-pretendard">
                    KRW
                  </span>
                </div>
              )}
              
              <p className="text-xs text-gray-500 font-pretendard">
                마지막 업데이트: {getFormattedLastUpdated()}
              </p>
            </div>
          </div>

          {showRefreshButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRefresh();
              }}
              disabled={isLoading}
              className={cn(
                "p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              aria-label="실시간 환율로 업데이트"
            >
              <ArrowPathIcon className={cn(
                "w-4 h-4 text-gray-600",
                isLoading && "animate-spin"
              )} />
            </button>
          )}

          {onEditClick && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="text-xs text-gray-500 font-pretendard">
                클릭하여 편집
              </div>
            </div>
          )}
        </div>

        {/* 추가 정보 */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 font-pretendard">현재 환율</p>
              <p className="font-medium text-gray-900 font-pretendard">
                {getFormattedRate()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 font-pretendard">실시간 환율</p>
              <p className="font-medium text-gray-900 font-pretendard">
                1,298 KRW
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 접근성 개선을 위한 숨겨진 설명 */}
      <div className="sr-only">
        <p>현재 USD 대비 KRW 환율은 {rate.toLocaleString()}원입니다.</p>
        {onEditClick && <p>환율을 수정하려면 이 영역을 클릭하세요.</p>}
        {showRefreshButton && <p>실시간 환율로 업데이트하려면 새로고침 버튼을 클릭하세요.</p>}
      </div>
    </div>
  );
};