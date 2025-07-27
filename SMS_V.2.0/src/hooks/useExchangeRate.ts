import { useContext } from 'react';
import { ExchangeRateContext } from '../contexts/ExchangeRateContextDefinition';

export const useExchangeRateContext = () => {
  const context = useContext(ExchangeRateContext);
  if (context === undefined) {
    throw new Error('useExchangeRateContext must be used within an ExchangeRateProvider');
  }
  return context;
};

// Re-export the interface for backward compatibility
export { ExchangeRate } from '../contexts/ExchangeRateContextDefinition';

export interface ExchangeRateData {
  rate: number;
  lastUpdated: string;
  isLoading: boolean;
  error: string | null;
}

// Backward compatibility hook that uses the context
export const useExchangeRate = () => {
  return useExchangeRateContext();
};