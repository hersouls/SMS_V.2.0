import { useContext } from 'react';
import { ExchangeRateContext } from '../contexts/ExchangeRateContextDefinition';

export const useExchangeRateContext = () => {
  const context = useContext(ExchangeRateContext);
  if (context === undefined) {
    throw new Error('useExchangeRateContext must be used within an ExchangeRateProvider');
  }
  return context;
};