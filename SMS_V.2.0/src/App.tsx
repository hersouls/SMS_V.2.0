import React, { Suspense, lazy, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './components/layout'
import LoadingSpinner from './components/ui/LoadingSpinner'
import { ErrorBoundary } from './components/features/monitoring/ErrorBoundary'
import { PerformanceMonitor } from './components/features/performance/PerformanceMonitor'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { useAuth } from './hooks/useAuth'
import { ExchangeRateProvider } from './contexts/ExchangeRateContext'
import SubscriptionModal from './components/features/subscription/SubscriptionModal'
import { useSubscriptions } from './hooks/useSubscriptions'
import { supabase } from './lib/supabase'


// Lazy load pages for code splitting
const Login = lazy(() => import('./pages/auth/Login'))
const Signup = lazy(() => import('./pages/auth/Signup'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Subscriptions = lazy(() => import('./pages/Subscriptions'))
const SubscriptionDetail = lazy(() => import('./pages/SubscriptionDetail'))
const Calendar = lazy(() => import('./pages/Calendar'))
const Settings = lazy(() => import('./pages/Settings'))
const DataTest = lazy(() => import('./components/features/DataTest'))

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <LoadingSpinner size="lg" />
  </div>
)

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <PageLoader />
  }
  
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

// Public route wrapper (redirect if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <PageLoader />
  }
  
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

function AppRoutes() {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<import('./types/database.types').Subscription | undefined>(undefined);
  const { addSubscription, updateSubscription } = useSubscriptions();

  const handleAddSubscription = () => {
    setEditingSubscription(undefined);
    setShowSubscriptionModal(true);
  };





  const handleSubscriptionSubmit = async (data: import('./types/database.types').SubscriptionFormData) => {
    try {
      // 구독 추가/편집 로직 구현
      if (editingSubscription) {
        // 편집 모드
        const { success, error } = await updateSubscription(editingSubscription.id, data);
        if (success) {
          console.log('구독이 성공적으로 수정되었습니다.');
        } else {
          console.error('구독 수정 실패:', error);
        }
      } else {
        // 추가 모드
        const { success, error } = await addSubscription(data);
        if (success) {
          console.log('구독이 성공적으로 추가되었습니다.');
        } else {
          console.error('구독 추가 실패:', error);
        }
      }
    } catch (error) {
      console.error('구독 처리 중 오류 발생:', error);
    } finally {
      setShowSubscriptionModal(false);
      setEditingSubscription(undefined);
    }
  };

  const handleEmergencyClick = () => {
    // 긴급 상황 처리 - 구독 일시정지 및 알림
    const emergencyAction = async () => {
      try {
        // 모든 활성 구독을 일시정지로 변경
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: activeSubscriptions } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (activeSubscriptions && activeSubscriptions.length > 0) {
          // 일시정지 처리
          const updatePromises = activeSubscriptions.map(sub => 
            supabase
              .from('subscriptions')
              .update({ status: 'paused', updated_at: new Date().toISOString() })
              .eq('id', sub.id)
          );

          await Promise.all(updatePromises);
          
          // 긴급 상황 알림
          alert('긴급 상황: 모든 구독이 일시정지되었습니다.');
          console.log('긴급 상황 처리 완료: 모든 구독 일시정지');
        } else {
          alert('활성 구독이 없습니다.');
        }
      } catch (error) {
        console.error('긴급 상황 처리 중 오류:', error);
        alert('긴급 상황 처리 중 오류가 발생했습니다.');
      }
    };

    if (confirm('정말 긴급 상황을 처리하시겠습니까?\n모든 활성 구독이 일시정지됩니다.')) {
      emergencyAction();
    }
  };

  const handleDebugClick = () => {
    // 디버그 모드 활성화 - 개발자 도구 및 진단 정보
    const debugMode = async () => {
      try {
        // 현재 사용자 정보 가져오기
        const { data: { user } } = await supabase.auth.getUser();
        
        // 구독 데이터 진단
        const { data: subscriptions } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user?.id || '');

        // 환율 데이터 진단
        const { data: exchangeRate } = await supabase
          .from('exchange_rates')
          .select('*')
          .eq('user_id', user?.id || '')
          .single();

        // 디버그 정보 수집
        const debugInfo = {
          user: user ? { id: user.id, email: user.email } : null,
          subscriptions: {
            total: subscriptions?.length || 0,
            active: subscriptions?.filter(s => s.status === 'active').length || 0,
            paused: subscriptions?.filter(s => s.status === 'paused').length || 0,
            canceled: subscriptions?.filter(s => s.status === 'canceled').length || 0
          },
          exchangeRate: exchangeRate?.usd_krw || 'Not set',
          browser: navigator.userAgent,
          timestamp: new Date().toISOString(),
          localStorage: {
            moonwave_user: localStorage.getItem('moonwave_user'),
            moonwave_session_id: sessionStorage.getItem('moonwave_session_id')
          }
        };

        // 디버그 정보를 콘솔에 출력
        console.group('🔧 Moonwave Debug Mode');
        console.log('User Info:', debugInfo.user);
        console.log('Subscriptions:', debugInfo.subscriptions);
        console.log('Exchange Rate:', debugInfo.exchangeRate);
        console.log('Browser:', debugInfo.browser);
        console.log('Local Storage:', debugInfo.localStorage);
        console.groupEnd();

        // 디버그 정보를 alert로 표시 (간단한 버전)
        const debugSummary = `
🔧 Moonwave Debug Mode

사용자: ${debugInfo.user?.email || 'Not logged in'}
구독 수: ${debugInfo.subscriptions.total}
- 활성: ${debugInfo.subscriptions.active}
- 일시정지: ${debugInfo.subscriptions.paused}
- 해지: ${debugInfo.subscriptions.canceled}
환율: ${debugInfo.exchangeRate} KRW/USD

자세한 정보는 개발자 도구 콘솔을 확인하세요.
        `;
        
        alert(debugSummary);
        
        // 개발자 도구 열기 (지원하는 브라우저에서)
        if (window.open) {
          window.open('', '_blank')?.focus();
        }
        
      } catch (error) {
        console.error('디버그 모드 실행 중 오류:', error);
        alert('디버그 모드 실행 중 오류가 발생했습니다.');
      }
    };

    debugMode();
  };

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout
              onAddClick={handleAddSubscription}
              onEmergencyClick={handleEmergencyClick}
              onDebugClick={handleDebugClick}
            >
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/subscriptions" element={
          <ProtectedRoute>
            <MainLayout
              onAddClick={handleAddSubscription}
              onEmergencyClick={handleEmergencyClick}
              onDebugClick={handleDebugClick}
            >
              <Subscriptions />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/subscriptions/:id" element={
          <ProtectedRoute>
            <MainLayout
              onAddClick={handleAddSubscription}
              onEmergencyClick={handleEmergencyClick}
              onDebugClick={handleDebugClick}
            >
              <SubscriptionDetail />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/calendar" element={
          <ProtectedRoute>
            <MainLayout
              onAddClick={handleAddSubscription}
              onEmergencyClick={handleEmergencyClick}
              onDebugClick={handleDebugClick}
            >
              <Calendar />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <MainLayout
              onAddClick={handleAddSubscription}
              onEmergencyClick={handleEmergencyClick}
              onDebugClick={handleDebugClick}
            >
              <Settings />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        {/* Test route for data verification */}
        <Route path="/test" element={
          <ProtectedRoute>
            <MainLayout
              onAddClick={handleAddSubscription}
              onEmergencyClick={handleEmergencyClick}
              onDebugClick={handleDebugClick}
            >
              <DataTest />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      
      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubmit={handleSubscriptionSubmit}
        subscription={editingSubscription}
        title={editingSubscription ? '구독 편집' : '구독 추가'}
      />
    </Suspense>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ExchangeRateProvider>
            <PerformanceMonitor enableReporting={process.env.NODE_ENV === 'production'} />
            <AppRoutes />
          </ExchangeRateProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App