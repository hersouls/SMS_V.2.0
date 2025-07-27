import { createContext } from 'react';

export interface ExchangeRate {
  id?: string;
  user_id: string;
  usd_krw: number;
  created_at?: string;
  updated_at?: string;
}

export interface ExchangeRateContextType {
  rate: number;
  lastUpdated: string;
  isLoading: boolean;
  error: string | null;
  updateExchangeRate: (newRate: number) => Promise<boolean>;
  updateWithLatestRate: () => Promise<boolean>;
  convertCurrency: (amount: number, fromCurrency: string, toCurrency?: string) => number;
  getFormattedRate: () => string;
  getFormattedLastUpdated: () => string;
  refetch: () => Promise<void>;
}

export const ExchangeRateContext = createContext<ExchangeRateContextType | undefined>(undefined);