import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console
    console.error('Error caught by boundary:', error, errorInfo);

    // Report error to monitoring service
    this.reportError(error, errorInfo);

    // Call custom error handler
    this.props.onError?.(error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getUserId(),
      sessionId: this.getSessionId()
    };

    // Send to error tracking service (replace with your service)
    this.sendToErrorService(errorData);

    // Log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.group('Error Details');
      console.log('Error:', error);
      console.log('Component Stack:', errorInfo.componentStack);
      console.log('Error Data:', errorData);
      console.groupEnd();
    }
  };

  private getUserId = (): string | null => {
    // Get user ID from auth context or localStorage
    try {
      const user = localStorage.getItem('moonwave_user');
      return user ? JSON.parse(user).id : null;
    } catch {
      return null;
    }
  };

  private getSessionId = (): string => {
    // Generate or get session ID
    let sessionId = sessionStorage.getItem('moonwave_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('moonwave_session_id', sessionId);
    }
    return sessionId;
  };

  private sendToErrorService = async (errorData: any) => {
    try {
      // Replace with your error tracking service (Sentry, LogRocket, etc.)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'exception', {
          description: errorData.message,
          fatal: true,
          custom_parameters: errorData
        });
      }

      // You can also send to your own API endpoint
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorData)
      // });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              문제가 발생했습니다
            </h1>
            
            <p className="text-gray-600 mb-6">
              예상치 못한 오류가 발생했습니다. 다시 시도하거나 페이지를 새로고침해주세요.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                  개발자 정보 (클릭하여 확장)
                </summary>
                <div className="bg-gray-50 rounded-lg p-4 text-xs font-mono text-gray-600 overflow-auto max-h-40">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <div className="mb-2">
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                    </div>
                  )}
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                다시 시도
              </button>
              
              <button
                onClick={this.handleReload}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                새로고침
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>문제가 지속되면 관리자에게 문의해주세요.</p>
              <p className="mt-1">
                오류 ID: {this.state.error?.message?.substring(0, 8) || 'unknown'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for error tracking
export const useErrorTracking = () => {
  const trackError = (error: Error, context?: Record<string, any>) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userId: getUserId(),
      sessionId: getSessionId()
    };

    // Send to error tracking service
    sendToErrorService(errorData);
  };

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    // const eventData = {
    //   event: eventName,
    //   properties,
    //   timestamp: new Date().toISOString(),
    //   url: window.location.href,
    //   userId: getUserId(),
    //   sessionId: getSessionId()
    // };

    // Send to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }
  };

  return { trackError, trackEvent };
};

// Helper functions
const getUserId = (): string | null => {
  try {
    const user = localStorage.getItem('moonwave_user');
    return user ? JSON.parse(user).id : null;
  } catch {
    return null;
  }
};

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('moonwave_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('moonwave_session_id', sessionId);
  }
  return sessionId;
};

const sendToErrorService = async (errorData: any) => {
  try {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: errorData.message,
        fatal: false,
        custom_parameters: errorData
      });
    }
  } catch (reportingError) {
    console.error('Failed to report error:', reportingError);
  }
};