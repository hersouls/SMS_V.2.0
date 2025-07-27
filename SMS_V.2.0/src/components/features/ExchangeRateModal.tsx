import React, { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CurrencyDollarIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';
import { useExchangeRate } from '../../hooks/useExchangeRate';

interface ExchangeRateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExchangeRateModal: React.FC<ExchangeRateModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    rate,
    isLoading,
    error,
    updateExchangeRate,
    updateWithLatestRate,
    getFormattedLastUpdated
  } = useExchangeRate();

  const [inputValue, setInputValue] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');

  // 모달이 열릴 때 현재 환율로 입력값 초기화
  useEffect(() => {
    if (isOpen) {
      setInputValue(rate.toString());
      setValidationError('');
    }
  }, [isOpen, rate]);

  // 입력값 검증
  const validateInput = (value: string): string => {
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

  // 입력값 변경 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // 실시간 검증
    const error = validateInput(value);
    setValidationError(error);
  };

  // 저장 처리
  const handleSave = async () => {
    const error = validateInput(inputValue);
    if (error) {
      setValidationError(error);
      return;
    }

    const newRate = parseFloat(inputValue);
    if (newRate === rate) {
      onClose();
      return;
    }

    setIsUpdating(true);
    try {
      const success = await updateExchangeRate(newRate);
      if (success) {
        onClose();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // 실시간 환율로 업데이트
  const handleUpdateWithLatest = async () => {
    setIsUpdating(true);
    try {
      const success = await updateWithLatestRate();
      if (success) {
        setInputValue(rate.toString());
        setValidationError('');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 border border-white/20">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white/20 backdrop-blur-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    onClick={onClose}
                  >
                    <span className="sr-only">닫기</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <CurrencyDollarIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 font-pretendard">
                      환율 설정
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 font-pretendard">
                        USD 대비 KRW 환율을 설정하세요. 이 값은 달러 구독료의 원화 환산에 사용됩니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {/* 현재 환율 정보 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 font-pretendard">
                          현재 환율
                        </p>
                        <p className="text-2xl font-bold text-gray-900 font-pretendard">
                          1 USD = {rate.toLocaleString()} KRW
                        </p>
                        <p className="text-xs text-gray-500 font-pretendard">
                          마지막 업데이트: {getFormattedLastUpdated()}
                        </p>
                      </div>
                      <button
                        onClick={handleUpdateWithLatest}
                        disabled={isUpdating}
                        className={cn(
                          "p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors duration-200",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                          isUpdating && "opacity-50 cursor-not-allowed"
                        )}
                        aria-label="실시간 환율로 업데이트"
                      >
                        <ArrowPathIcon className={cn(
                          "w-4 h-4 text-blue-600",
                          isUpdating && "animate-spin"
                        )} />
                      </button>
                    </div>
                  </div>

                  {/* 환율 입력 */}
                  <div>
                    <label htmlFor="exchange-rate" className="block text-sm font-medium text-gray-700 font-pretendard mb-2">
                      새로운 환율 (KRW)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="exchange-rate"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className={cn(
                          "block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset",
                          "font-pretendard tracking-ko-normal",
                          "focus:ring-2 focus:ring-inset focus:ring-blue-600",
                          "placeholder:text-gray-400",
                          validationError ? "ring-red-300" : "ring-gray-300"
                        )}
                        placeholder="예: 1300"
                        min="1"
                        max="10000"
                        step="0.01"
                        disabled={isUpdating}
                        aria-describedby={validationError ? "exchange-rate-error" : undefined}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 text-sm font-pretendard">KRW</span>
                      </div>
                    </div>
                    {validationError && (
                      <p id="exchange-rate-error" className="mt-2 text-sm text-red-600 font-pretendard">
                        {validationError}
                      </p>
                    )}
                  </div>

                  {/* 실시간 환율 정보 */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900 font-pretendard mb-1">
                      실시간 환율 정보
                    </p>
                    <p className="text-sm text-blue-700 font-pretendard">
                      현재 실시간 환율: 1 USD = 1,298 KRW
                    </p>
                    <p className="text-xs text-blue-600 font-pretendard mt-1">
                      위의 새로고침 버튼을 클릭하여 실시간 환율로 자동 업데이트할 수 있습니다.
                    </p>
                  </div>
                </div>

                <div className="mt-6 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isUpdating || !!validationError}
                    className={cn(
                      "inline-flex w-full justify-center rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-sm",
                      "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                      "transition-all duration-200 font-pretendard",
                      (isUpdating || !!validationError) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        저장 중...
                      </>
                    ) : (
                      '저장'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isUpdating}
                    className={cn(
                      "mt-3 inline-flex w-full justify-center rounded-lg px-3 py-2 text-sm font-semibold",
                      "bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300",
                      "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                      "transition-colors duration-200 font-pretendard",
                      isUpdating && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    취소
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};