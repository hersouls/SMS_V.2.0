// Exchange rate utility functions
export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string = 'KRW', rate: number): number => {
  if (fromCurrency === toCurrency) return amount;
  
  if (fromCurrency === 'USD' && toCurrency === 'KRW') {
    return amount * rate;
  }
  
  if (fromCurrency === 'KRW' && toCurrency === 'USD') {
    return amount / rate;
  }
  
  return amount; // 지원하지 않는 통화 조합
};

export const getFormattedRate = (rate: number): string => {
  return `1 USD = ${rate.toLocaleString()} KRW`;
};

export const getFormattedLastUpdated = (lastUpdated: string | null): string => {
  if (!lastUpdated) return '업데이트 없음';
  
  const date = new Date(lastUpdated);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return '방금 전';
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
  
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};