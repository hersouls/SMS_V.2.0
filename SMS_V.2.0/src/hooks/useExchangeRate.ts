import { useContext } from 'react';
import { ExchangeRateContext } from '../contexts/ExchangeRateContextDefinition';

// Re-export the interface for backward compatibility
export interface ExchangeRateData {
  rate: number;
  lastUpdated: string;
  isLoading: boolean;
  error: string | null;
}

// Backward compatibility hook that uses the context
export const useExchangeRate = () => {
  const context = useContext(ExchangeRateContext);
  if (context === undefined) {
    throw new Error('useExchangeRate must be used within an ExchangeRateProvider');
  }
  return context;
};