
import React, { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { ExchangeRateContext } from './ExchangeRateContextDefinition';
import type { ExchangeRateContextType, ExchangeRate } from './ExchangeRateContextDefinition';
import { DEFAULT_RATE } from '../constants/exchangeRate';
import { convertCurrency as convertCurrencyUtil, getFormattedRate as getFormattedRateUtil, getFormattedLastUpdated as getFormattedLastUpdatedUtil } from '../utils/exchangeRateUtils';

interface ExchangeRateProviderProps {
  children: ReactNode;
}

export const ExchangeRateProvider: React.FC<ExchangeRateProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [rate, setRate] = useState<number>(DEFAULT_RATE);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 기본 환율 생성
  const createDefaultRate = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error: createError } = await supabase
        .from('exchange_rates')
        .insert({
          user_id: user.id,
          usd_krw: DEFAULT_RATE
        })
        .select()
        .single();

      if (createError) throw createError;

      setRate(data.usd_krw);
      setLastUpdated(data.created_at || '');
    } catch (err) {
      console.error('기본 환율 생성 실패:', err);
      setError('기본 환율을 생성하는데 실패했습니다.');
    }
  }, [user]);

  // 환율 데이터 가져오기
  const fetchExchangeRate = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('exchange_rates')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (data) {
        setRate(data.usd_krw);
        setLastUpdated(data.updated_at || data.created_at || '');
      } else {
        // 기본 환율로 초기화
        await createDefaultRate();
      }
    } catch (err) {
      console.error('환율 데이터 가져오기 실패:', err);
      setError('환율 데이터를 가져오는데 실패했습니다.');
      setRate(DEFAULT_RATE);
    } finally {
      setIsLoading(false);
    }
  }, [user, createDefaultRate]);

  // 환율 업데이트
  const updateExchangeRate = async (newRate: number): Promise<boolean> => {
    if (!user) return false;

    try {
      setIsLoading(true);
      setError(null);

      // 입력 검증
      if (newRate <= 0) {
        throw new Error('환율은 0보다 커야 합니다.');
      }

      if (newRate > 10000) {
        throw new Error('환율이 너무 높습니다.');
      }

      const { data, error: updateError } = await supabase
        .from('exchange_rates')
        .upsert({
          user_id: user.id,
          usd_krw: newRate,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (updateError) throw updateError;

      setRate(data.usd_krw);
      setLastUpdated(data.updated_at || data.created_at || '');
      return true;
    } catch (err) {
      console.error('환율 업데이트 실패:', err);
      setError(err instanceof Error ? err.message : '환율 업데이트에 실패했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 실시간 환율 API에서 최신 환율 가져오기
  const fetchLatestRateFromAPI = async (): Promise<number | null> => {
    try {
      // 무료 환율 API 사용 (API 키 불필요)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      if (data.rates && data.rates.KRW) {
        return data.rates.KRW;
      }
      
      // 백업 API 시도
      const backupResponse = await fetch('https://open.er-api.com/v6/latest/USD');
      const backupData = await backupResponse.json();
      
      if (backupData.rates && backupData.rates.KRW) {
        return backupData.rates.KRW;
      }
      
      console.warn('환율 API에서 데이터를 가져올 수 없습니다. 기본값을 사용합니다.');
      return null;
    } catch (err) {
      console.error('실시간 환율 API 호출 실패:', err);
      return null;
    }
  };

  // 실시간 환율로 업데이트
  const updateWithLatestRate = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const latestRate = await fetchLatestRateFromAPI();
      if (latestRate) {
        return await updateExchangeRate(latestRate);
      } else {
        setError('실시간 환율을 가져올 수 없습니다. 네트워크 연결을 확인해주세요.');
        return false;
      }
    } catch {
      setError('실시간 환율 업데이트에 실패했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 통화 변환 유틸리티
  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string = 'KRW'): number => {
    return convertCurrencyUtil(amount, fromCurrency, toCurrency, rate);
  };

  // 포맷된 환율 문자열
  const getFormattedRate = (): string => {
    return getFormattedRateUtil(rate);
  };

  // 마지막 업데이트 시간 포맷팅
  const getFormattedLastUpdated = (): string => {
    return getFormattedLastUpdatedUtil(lastUpdated);
  };

  // 초기 로드 및 실시간 구독
  useEffect(() => {
    if (user) {
      fetchExchangeRate();

      // 실시간 구독 설정
      const subscription = supabase
        .channel('exchange_rates_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'exchange_rates',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
              const newData = payload.new as ExchangeRate;
              setRate(newData.usd_krw);
              setLastUpdated(newData.updated_at || newData.created_at || '');
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user, fetchExchangeRate]);

  const value: ExchangeRateContextType = {
    rate,
    lastUpdated,
    isLoading,
    error,
    updateExchangeRate,
    updateWithLatestRate,
    convertCurrency,
    getFormattedRate,
    getFormattedLastUpdated,
    refetch: fetchExchangeRate
  };

  return (
    <ExchangeRateContext.Provider value={value}>
      {children}
    </ExchangeRateContext.Provider>
  );
};



