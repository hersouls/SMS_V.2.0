// Performance monitoring and analytics utility

// Type definitions for performance APIs
interface LayoutShift {
  value: number;
  hadRecentInput: boolean;
}

interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
}

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export interface UserEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
}

class Analytics {
  private events: UserEvent[] = [];
  private isEnabled: boolean = true;

  constructor() {
    this.initializePerformanceMonitoring();
  }

  private initializePerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      // Monitor Core Web Vitals
      this.observeLCP();
      this.observeFID();
      this.observeCLS();
      this.observeFCP();
    }
  }

  private observeLCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry;
      this.trackPerformance('lcp', lastEntry.startTime);
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  private observeFID() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      for (const entry of entries) {
        const firstInputEntry = entry as PerformanceEventTiming;
        this.trackPerformance('fid', firstInputEntry.processingStart - entry.startTime);
      }
    });
    observer.observe({ entryTypes: ['first-input'] });
  }

  private observeCLS() {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      for (const entry of entries) {
        const layoutShiftEntry = entry as LayoutShift;
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
        }
      }
      this.trackPerformance('cls', clsValue);
    });
    observer.observe({ entryTypes: ['layout-shift'] });
  }

  private observeFCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstEntry = entries[0];
      this.trackPerformance('fcp', firstEntry.startTime);
    });
    observer.observe({ entryTypes: ['first-contentful-paint'] });
  }

  private trackPerformance(metric: string, value: number) {
    this.trackEvent('performance', metric, 'measure', undefined);
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`📊 ${metric.toUpperCase()}: ${value.toFixed(2)}ms`);
    }
  }

  public trackEvent(
    category: string,
    action: string,
    label?: string,
    value?: number
  ) {
    if (!this.isEnabled) return;

    const event: UserEvent = {
      event: 'custom',
      category,
      action,
      label,
      value,
      timestamp: Date.now()
    };

    this.events.push(event);

    // Send to analytics service (placeholder)
    this.sendToAnalytics(event);
  }

  public trackPageView(page: string) {
    this.trackEvent('navigation', 'page_view', page);
  }

  public trackError(error: Error, context?: string) {
    this.trackEvent('error', 'exception', context || error.message);
  }

  public trackUserAction(action: string, details?: Record<string, unknown>) {
    this.trackEvent('user', action, JSON.stringify(details));
  }

  public trackSubscriptionAction(action: string, serviceName?: string) {
    this.trackEvent('subscription', action, serviceName);
  }

  private sendToAnalytics(event: UserEvent) {
    // In production, send to actual analytics service
    // For now, just log to console
    if (import.meta.env.DEV) {
      console.log('📈 Analytics Event:', event);
    }

    // Example: Send to Supabase or external analytics
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event)
    // });
  }

  public getEvents(): UserEvent[] {
    return [...this.events];
  }

  public clearEvents(): void {
    this.events = [];
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }

  public getPerformanceMetrics(): PerformanceMetrics | null {
    if (!('performance' in window)) return null;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    return {
      fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      lcp: 0, // Will be updated by observer
      fid: 0, // Will be updated by observer
      cls: 0, // Will be updated by observer
      ttfb: navigation.responseStart - navigation.requestStart
    };
  }
}

// Create singleton instance
export const analytics = new Analytics();

// Export convenience functions
export const trackEvent = analytics.trackEvent.bind(analytics);
export const trackPageView = analytics.trackPageView.bind(analytics);
export const trackError = analytics.trackError.bind(analytics);
export const trackUserAction = analytics.trackUserAction.bind(analytics);
export const trackSubscriptionAction = analytics.trackSubscriptionAction.bind(analytics);