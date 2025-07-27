import { useState } from 'react';

// Performance utility functions
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null
  });

  return { metrics, setMetrics };
};

export const getPerformanceGrade = (score: number): string => {
  if (score >= 0.9) return 'A';
  if (score >= 0.7) return 'B';
  if (score >= 0.5) return 'C';
  return 'D';
};

export const getPerformanceColor = (score: number): string => {
  if (score >= 0.9) return 'text-green-600';
  if (score >= 0.7) return 'text-yellow-600';
  if (score >= 0.5) return 'text-orange-600';
  return 'text-red-600';
};