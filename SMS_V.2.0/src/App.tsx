import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import MusicPlayer from './components/layout/MusicPlayer'
import LoadingSpinner from './components/ui/LoadingSpinner'
import { ErrorBoundary } from './components/features/monitoring/ErrorBoundary'
import { PerformanceMonitor } from './components/features/performance/PerformanceMonitor'

// Lazy load pages for code splitting
const Login = lazy(() => import('./pages/auth/Login'))
const Signup = lazy(() => import('./pages/auth/Signup'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Subscriptions = lazy(() => import('./pages/Subscriptions'))
const Calendar = lazy(() => import('./pages/Calendar'))
const Settings = lazy(() => import('./pages/Settings'))

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
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
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
              <Header />
              <main className="pt-16 pb-20">
                <Dashboard />
              </main>
              <Footer />
              <MusicPlayer />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/subscriptions" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
              <Header />
              <main className="pt-16 pb-20">
                <Subscriptions />
              </main>
              <Footer />
              <MusicPlayer />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/calendar" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
              <Header />
              <main className="pt-16 pb-20">
                <Calendar />
              </main>
              <Footer />
              <MusicPlayer />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
              <Header />
              <main className="pt-16 pb-20">
                <Settings />
              </main>
              <Footer />
              <MusicPlayer />
            </div>
          </ProtectedRoute>
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
          <PerformanceMonitor enableReporting={process.env.NODE_ENV === 'production'} />
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App