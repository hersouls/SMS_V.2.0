import React, { useState } from 'react';
import { PerformanceMonitor } from '../components/features/performance/PerformanceMonitor';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  fcpScore: number | null;
  lcpScore: number | null;
  fidScore: number | null;
  clsScore: number | null;
  ttfbScore: number | null;
}

// Hook for using performance metrics in components
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fcpScore: null,
    lcpScore: null,
    fidScore: null,
    clsScore: null,
    ttfbScore: null
  });

  return {
    metrics,
    PerformanceMonitor: () => {
      return React.createElement(PerformanceMonitor, {
        onMetricsUpdate: setMetrics,
        enableReporting: true
      });
    }
  };
};