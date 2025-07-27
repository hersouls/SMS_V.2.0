import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import MusicPlayer from './components/layout/MusicPlayer'
import FloatingActionButtons from './components/layout/FloatingActionButtons'
import LoadingSpinner from './components/ui/LoadingSpinner'
import { ErrorBoundary } from './components/features/monitoring/ErrorBoundary'
import { PerformanceMonitor } from './components/features/performance/PerformanceMonitor'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { useAuth } from './hooks/useAuth'
import { ExchangeRateProvider } from './contexts/ExchangeRateContext'

// Lazy load pages for code splitting
const Login = lazy(() => import('./pages/auth/Login'))
const Signup = lazy(() => import('./pages/auth/Signup'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Subscriptions = lazy(() => import('./pages/Subscriptions'))
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
  const handleAddSubscription = () => {
    // TODO: 구독 추가 모달 또는 페이지로 이동
    console.log('구독 추가 버튼 클릭됨');
  };

  const handleEmergencyClick = () => {
    // TODO: 긴급 상황 처리
    console.log('긴급 상황 버튼 클릭됨');
  };

  const handleDebugClick = () => {
    // TODO: 디버그 모드 활성화
    console.log('디버그 버튼 클릭됨');
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
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
              <Header />
              <main className="flex-1 pt-16 pb-32">
                <div className="container mx-auto px-4 @sm:px-6 @lg:px-8">
                  <Dashboard />
                </div>
              </main>
              <Footer />
              <MusicPlayer />
              <FloatingActionButtons 
                onAddClick={handleAddSubscription}
                onEmergencyClick={handleEmergencyClick}
                onDebugClick={handleDebugClick}
              />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/subscriptions" element={
          <ProtectedRoute>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
              <Header />
              <main className="flex-1 pt-16 pb-32">
                <div className="container mx-auto px-4 @sm:px-6 @lg:px-8">
                  <Subscriptions />
                </div>
              </main>
              <Footer />
              <MusicPlayer />
              <FloatingActionButtons 
                onAddClick={handleAddSubscription}
                onEmergencyClick={handleEmergencyClick}
                onDebugClick={handleDebugClick}
              />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/calendar" element={
          <ProtectedRoute>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
              <Header />
              <main className="flex-1 pt-16 pb-32">
                <div className="container mx-auto px-4 @sm:px-6 @lg:px-8">
                  <Calendar />
                </div>
              </main>
              <Footer />
              <MusicPlayer />
              <FloatingActionButtons 
                onAddClick={handleAddSubscription}
                onEmergencyClick={handleEmergencyClick}
                onDebugClick={handleDebugClick}
              />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
              <Header />
              <main className="flex-1 pt-16 pb-32">
                <div className="container mx-auto px-4 @sm:px-6 @lg:px-8">
                  <Settings />
                </div>
              </main>
              <Footer />
              <MusicPlayer />
              <FloatingActionButtons 
                onAddClick={handleAddSubscription}
                onEmergencyClick={handleEmergencyClick}
                onDebugClick={handleDebugClick}
              />
            </div>
          </ProtectedRoute>
        } />
        
        {/* Test route for data verification */}
        <Route path="/test" element={
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Header />
            <main className="flex-1 pt-16 pb-32">
              <div className="container mx-auto px-4 @sm:px-6 @lg:px-8">
                <DataTest />
              </div>
            </main>
            <Footer />
          </div>
        } />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
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