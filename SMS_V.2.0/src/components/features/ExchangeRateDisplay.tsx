import React, { useState } from 'react';
import { CurrencyDollarIcon, ArrowPathIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';
import { useExchangeRateContext } from '../../hooks/useExchangeRateContext';
import Typography from '../ui/Typography';

interface ExchangeRateDisplayProps {
  onEditClick?: () => void;
  className?: string;
  showRefreshButton?: boolean;
  enableInlineEdit?: boolean;
}

export const ExchangeRateDisplay: React.FC<ExchangeRateDisplayProps> = ({
  onEditClick,
  className,
  showRefreshButton = false,
  enableInlineEdit = true
}) => {
  const {
    rate,
    isLoading,
    error,
    getFormattedRate,
    getFormattedLastUpdated,
    updateWithLatestRate,
    updateExchangeRate
  } = useExchangeRateContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(rate.toString());
  const [editError, setEditError] = useState('');

  const handleRefresh = async () => {
    try {
      const success = await updateWithLatestRate();
      if (success) {
        // 성공 시 시각적 피드백 (선택사항)
        console.log('실시간 환율로 업데이트되었습니다.');
      }
    } catch (error) {
      console.error('환율 업데이트 실패:', error);
    }
  };

  const handleClick = () => {
    if (onEditClick && !enableInlineEdit) {
      onEditClick();
    }
  };

  const startEditing = () => {
    if (!enableInlineEdit) return;
    setEditValue(rate.toString());
    setEditError('');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditValue(rate.toString());
    setEditError('');
  };

  const validateEditInput = (value: string): string => {
    const numValue = parseFloat(value);
    
    if (!value.trim()) {
      return '환율을 입력해주세요.';
    }
    
    if (isNaN(numValue)) {
      return '올바른 숫자를 입력해주세요.';
    }
    
    if (numValue <= 0) {
      return '환율은 0보다 커야 합니다.';
    }
    
    if (numValue > 10000) {
      return '환율이 너무 높습니다. (최대 10,000)';
    }
    
    return '';
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditValue(value);
    
    const error = validateEditInput(value);
    setEditError(error);
  };

  const handleSaveEdit = async () => {
    const error = validateEditInput(editValue);
    if (error) {
      setEditError(error);
      return;
    }

    const newRate = parseFloat(editValue);
    if (newRate === rate) {
      setIsEditing(false);
      return;
    }

    try {
      const success = await updateExchangeRate(newRate);
      if (success) {
        setIsEditing(false);
      }
    } catch {
      setEditError('환율 업데이트에 실패했습니다.');
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEditing();
    }
  };

  return (
    <div className={cn("@container", className)}>
      <div
        className={cn(
          "card-glass rounded-xl p-4",
          "hover:bg-white/90 transition-all duration-200",
          onEditClick && !enableInlineEdit && "cursor-pointer hover:shadow-lg",
          "group"
        )}
        onClick={handleClick}
        role={onEditClick && !enableInlineEdit ? "button" : undefined}
        tabIndex={onEditClick && !enableInlineEdit ? 0 : undefined}
        onKeyDown={(e) => {
          if (onEditClick && !enableInlineEdit && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onEditClick();
          }
        }}
        aria-label={onEditClick && !enableInlineEdit ? "환율 설정을 편집하려면 클릭하세요" : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 text-blue-600" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold font-pretendard tracking-ko-normal text-gray-900">
                  USD → KRW 환율
                </h3>
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                )}
              </div>
              
              {error ? (
                <p className="text-sm text-red-600 font-pretendard tracking-ko-normal">
                  {error}
                </p>
              ) : (
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editValue}
                        onChange={handleEditChange}
                        onKeyDown={handleEditKeyDown}
                        className={cn(
                          "text-2xl font-bold text-gray-900 font-pretendard tracking-ko-normal",
                          "bg-transparent border-b-2 border-blue-500 focus:outline-none",
                          "w-24 text-center"
                        )}
                        min="1"
                        max="10000"
                        step="0.01"
                        autoFocus
                      />
                      <Typography.Caption className="text-gray-500">
                        KRW
                      </Typography.Caption>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={handleSaveEdit}
                          disabled={!!editError}
                          className={cn(
                            "p-1 rounded hover:bg-green-100 transition-colors",
                            "focus:outline-none focus:ring-2 focus:ring-green-500",
                            editError && "opacity-50 cursor-not-allowed"
                          )}
                          aria-label="저장"
                        >
                          <CheckIcon className="w-4 h-4 text-green-600" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-1 rounded hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                          aria-label="취소"
                        >
                          <XMarkIcon className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Typography.H2 className="text-gray-900">
                        {rate.toLocaleString()}
                      </Typography.H2>
                      <Typography.Caption className="text-gray-500">
                        KRW
                      </Typography.Caption>
                      {enableInlineEdit && (
                        <button
                          onClick={startEditing}
                          className="p-1 rounded hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-0 group-hover:opacity-100"
                          aria-label="환율 편집"
                        >
                          <PencilIcon className="w-4 h-4 text-gray-600" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {editError && (
                <Typography.Caption className="text-red-600 mt-1">
                  {editError}
                </Typography.Caption>
              )}
              
              <Typography.Caption className="text-gray-500">
                마지막 업데이트: {getFormattedLastUpdated()}
              </Typography.Caption>
            </div>
          </div>

          {showRefreshButton && !isEditing && (
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
                "w-5 h-5 text-gray-600",
                isLoading && "animate-spin"
              )} />
            </button>
          )}

          {onEditClick && !enableInlineEdit && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Typography.Caption className="text-gray-500">
                클릭하여 편집
              </Typography.Caption>
            </div>
          )}
        </div>

        {/* 추가 정보 */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 font-pretendard tracking-ko-normal">현재 환율</p>
              <p className="font-medium text-gray-900 font-pretendard tracking-ko-normal">
                {getFormattedRate()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 font-pretendard tracking-ko-normal">실시간 환율</p>
              <p className="font-medium text-gray-900 font-pretendard tracking-ko-normal">
                {showRefreshButton ? '새로고침 버튼으로 확인' : '설정에서 확인'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 접근성 개선을 위한 숨겨진 설명 */}
      <div className="sr-only">
        <p>현재 USD 대비 KRW 환율은 {rate.toLocaleString()}원입니다.</p>
        {enableInlineEdit && <p>환율을 수정하려면 연필 아이콘을 클릭하세요.</p>}
        {onEditClick && !enableInlineEdit && <p>환율을 수정하려면 이 영역을 클릭하세요.</p>}
        {showRefreshButton && <p>실시간 환율로 업데이트하려면 새로고침 버튼을 클릭하세요.</p>}
      </div>
    </div>
  );
};