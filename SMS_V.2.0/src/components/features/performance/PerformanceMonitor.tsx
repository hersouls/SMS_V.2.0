import { useEffect, useRef, useState, useCallback } from 'react';

interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface NavigationEntry extends PerformanceEntry {
  responseStart: number;
  requestStart: number;
  entryType: string;
}

interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface NetworkConnection {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface GtagWindow extends Window {
  gtag?: (command: string, eventName: string, parameters?: Record<string, unknown>) => void;
}

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

interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  enableReporting?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  onMetricsUpdate,
  enableReporting = true
}) => {
  const metricsRef = useRef<PerformanceMetrics>({
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

  // Calculate performance score based on thresholds
  const calculateScore = (value: number, thresholds: { good: number; needsImprovement: number }): number => {
    if (value <= thresholds.good) return 1.0;
    if (value <= thresholds.needsImprovement) return 0.5;
    return 0.0;
  };

  // Measure First Contentful Paint (FCP)
  const measureFCP = useCallback(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        
        if (fcpEntry) {
          const fcp = fcpEntry.startTime;
          const fcpScore = calculateScore(fcp, { good: 1800, needsImprovement: 3000 });
          
          metricsRef.current.fcp = fcp;
          metricsRef.current.fcpScore = fcpScore;
          
          onMetricsUpdate?.(metricsRef.current);
          
          if (enableReporting) {
            console.log('FCP:', fcp, 'Score:', fcpScore);
          }
        }
      });
      
      observer.observe({ entryTypes: ['paint'] });
    }
  }, [onMetricsUpdate, enableReporting]);

  // Measure Largest Contentful Paint (LCP)
  const measureLCP = useCallback(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (lastEntry) {
          const lcp = lastEntry.startTime;
          const lcpScore = calculateScore(lcp, { good: 2500, needsImprovement: 4000 });
          
          metricsRef.current.lcp = lcp;
          metricsRef.current.lcpScore = lcpScore;
          
          onMetricsUpdate?.(metricsRef.current);
          
          if (enableReporting) {
            console.log('LCP:', lcp, 'Score:', lcpScore);
          }
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }, [onMetricsUpdate, enableReporting]);

  // Measure First Input Delay (FID)
  const measureFID = useCallback(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        

          const fidScore = calculateScore(fid, { good: 100, needsImprovement: 300 });
          
          metricsRef.current.fid = fid;
          metricsRef.current.fidScore = fidScore;
          
          onMetricsUpdate?.(metricsRef.current);
          
          if (enableReporting) {
            console.log('FID:', fid, 'Score:', fidScore);
          }
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    }
  }, [onMetricsUpdate, enableReporting]);

  // Measure Cumulative Layout Shift (CLS)
  const measureCLS = useCallback(() => {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          const clsEntry = entry as LayoutShiftEntry;
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value;
          }
        });
        
        const clsScore = calculateScore(clsValue, { good: 0.1, needsImprovement: 0.25 });
        
        metricsRef.current.cls = clsValue;
        metricsRef.current.clsScore = clsScore;
        
        onMetricsUpdate?.(metricsRef.current);
        
        if (enableReporting) {
          console.log('CLS:', clsValue, 'Score:', clsScore);
        }
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }, [onMetricsUpdate, enableReporting]);

  // Measure Time to First Byte (TTFB)
  const measureTTFB = useCallback(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          const navEntry = entry as NavigationEntry;
          if (navEntry.entryType === 'navigation') {
            const ttfb = navEntry.responseStart - navEntry.requestStart;
            const ttfbScore = calculateScore(ttfb, { good: 800, needsImprovement: 1800 });
            
            metricsRef.current.ttfb = ttfb;
            metricsRef.current.ttfbScore = ttfbScore;
            
            onMetricsUpdate?.(metricsRef.current);
            
            if (enableReporting) {
              console.log('TTFB:', ttfb, 'Score:', ttfbScore);
            }
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    }
  }, [onMetricsUpdate, enableReporting]);

  // Measure memory usage
  const measureMemory = () => {
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory: PerformanceMemory }).memory;
      console.log('Memory Usage:', {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      });
    }
  };

  // Measure network information
  const measureNetwork = () => {
    if ('connection' in navigator) {
      const connection = (navigator as Navigator & { connection: NetworkConnection }).connection;
      console.log('Network Info:', {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      });
    }
  };

  // Report performance metrics to analytics
  const reportMetrics = useCallback((metrics: PerformanceMetrics) => {
    if (!enableReporting) return;

    // Calculate overall performance score
    const scores = [
      metrics.fcpScore,
      metrics.lcpScore,
      metrics.fidScore,
      metrics.clsScore,
      metrics.ttfbScore
    ].filter(score => score !== null) as number[];

    const overallScore = scores.length > 0 
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
      : 0;

    // Send to analytics (replace with your analytics service)
    if (typeof window !== 'undefined' && (window as GtagWindow).gtag) {
      (window as GtagWindow).gtag!('event', 'performance_metrics', {
        event_category: 'Performance',
        event_label: 'Core Web Vitals',
        value: Math.round(overallScore * 100),
        custom_parameters: {
          fcp: metrics.fcp,
          lcp: metrics.lcp,
          fid: metrics.fid,
          cls: metrics.cls,
          ttfb: metrics.ttfb
        }
      });
    }

    // Log to console for development
    console.log('Performance Metrics:', {
      ...metrics,
      overallScore: Math.round(overallScore * 100)
    });
  }, [enableReporting]);

  useEffect(() => {
    // Start measuring when component mounts
    measureFCP();
    measureLCP();
    measureFID();
    measureCLS();
    measureTTFB();

    // Measure memory and network info after a delay
    const timer = setTimeout(() => {
      measureMemory();
      measureNetwork();
    }, 2000);

    // Report metrics periodically
    const reportTimer = setInterval(() => {
      reportMetrics(metricsRef.current);
    }, 30000); // Report every 30 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(reportTimer);
    };
  }, [measureFCP, measureLCP, measureFID, measureCLS, measureTTFB, reportMetrics]);

  // Listen for visibility change to measure performance when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Re-measure when tab becomes visible
        setTimeout(() => {
          measureMemory();
          measureNetwork();
        }, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // This component doesn't render anything
  return null;
};

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
    PerformanceMonitor: () => (
      <PerformanceMonitor
        onMetricsUpdate={setMetrics}
        enableReporting={true}
      />
    )
  };
};

// Utility function to get performance grade
export const getPerformanceGrade = (score: number): string => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

// Utility function to get performance color
export const getPerformanceColor = (score: number): string => {
  if (score >= 90) return '#10b981'; // Green
  if (score >= 80) return '#f59e0b'; // Yellow
  if (score >= 70) return '#f97316'; // Orange
  return '#ef4444'; // Red
};