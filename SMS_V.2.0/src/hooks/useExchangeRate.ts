
// Re-export the interface for backward compatibility
export { ExchangeRate } from '../contexts/ExchangeRateContext';

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