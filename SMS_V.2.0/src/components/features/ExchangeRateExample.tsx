import React, { useState } from 'react';
import { CurrencyDollarIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';
import { useExchangeRateContext } from '../../hooks/useExchangeRateContext';
import Typography from '../ui/Typography';

interface ExchangeRateExampleProps {
  className?: string;
}

export const ExchangeRateExample: React.FC<ExchangeRateExampleProps> = ({ className }) => {
  const {
    rate,
    isLoading,
    error,
    convertCurrency,
    getFormattedRate,
    getFormattedLastUpdated
  } = useExchangeRateContext();

  const [usdAmount, setUsdAmount] = useState<number>(10);
  const [krwAmount, setKrwAmount] = useState<number>(rate * 10);

  // USD 입력값 변경 시 KRW 자동 계산
  const handleUsdChange = (value: number) => {
    setUsdAmount(value);
    setKrwAmount(convertCurrency(value, 'USD', 'KRW'));
  };

  // KRW 입력값 변경 시 USD 자동 계산
  const handleKrwChange = (value: number) => {
    setKrwAmount(value);
    setUsdAmount(convertCurrency(value, 'KRW', 'USD'));
  };

  return (
    <div className={cn("@container", className)}>
      <div className="bg-white/80 backdrop-blur-md rounded-xl border border-white/20 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <CurrencyDollarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <Typography.H3 className="text-gray-900">
              실시간 환율 변환기
            </Typography.H3>
            <Typography.Caption className="text-gray-500">
              현재 환율: {getFormattedRate()}
            </Typography.Caption>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <Typography.Body className="text-red-600">{error}</Typography.Body>
          </div>
        ) : (
          <>
            {/* 환율 정보 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <Typography.Caption className="text-gray-700">
                    현재 환율
                  </Typography.Caption>
                  <Typography.H2 className="text-gray-900">
                    {isLoading ? (
                      <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    ) : (
                      `${rate.toLocaleString()} KRW`
                    )}
                  </Typography.H2>
                </div>
                                  <div className="text-right">
                    <Typography.Caption className="text-gray-500">
                      마지막 업데이트
                    </Typography.Caption>
                    <Typography.Caption className="text-gray-700">
                      {getFormattedLastUpdated()}
                    </Typography.Caption>
                  </div>
              </div>
            </div>

            {/* 통화 변환 입력 */}
            <div className="space-y-4">
              <div>
                <label className="block mb-2">
                  <Typography.Caption className="text-gray-700">
                    USD (달러)
                  </Typography.Caption>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={usdAmount}
                    onChange={(e) => handleUsdChange(parseFloat(e.target.value) || 0)}
                    className="block w-full rounded-lg border-0 py-3 px-4 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 font-pretendard"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 text-sm font-pretendard">USD</span>
                  </div>
                </div>
              </div>

              {/* 변환 화살표 */}
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <ArrowDownIcon className="w-4 h-4 text-gray-600" />
                </div>
              </div>

              <div>
                <label className="block mb-2">
                  <Typography.Caption className="text-gray-700">
                    KRW (원화)
                  </Typography.Caption>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={krwAmount}
                    onChange={(e) => handleKrwChange(parseFloat(e.target.value) || 0)}
                    className="block w-full rounded-lg border-0 py-3 px-4 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 font-pretendard"
                    placeholder="0"
                    min="0"
                    step="1"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 text-sm font-pretendard">KRW</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 변환 결과 요약 */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 rounded-lg p-3">
                  <Typography.Caption className="text-blue-600">USD</Typography.Caption>
                  <Typography.H3 className="text-blue-900">
                    ${usdAmount.toFixed(2)}
                  </Typography.H3>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <Typography.Caption className="text-purple-600">KRW</Typography.Caption>
                  <Typography.H3 className="text-purple-900">
                    {krwAmount.toLocaleString()}원
                  </Typography.H3>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 접근성 개선을 위한 숨겨진 설명 */}
        <div className="sr-only">
          <p>현재 USD 대비 KRW 환율은 {rate.toLocaleString()}원입니다.</p>
          <p>USD {usdAmount.toFixed(2)}는 KRW {krwAmount.toLocaleString()}원과 같습니다.</p>
          <p>마지막 업데이트: {getFormattedLastUpdated()}</p>
        </div>
      </div>
    </div>
  );
};