import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { WaveButton } from './WaveButton';
import { useApp } from '../App';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);

    try {
      await loginWithGoogle();
      // Google OAuth는 리다이렉트되므로 여기서는 navigate하지 않음
    } catch (err: any) {
      setError(err.message || 'Google 로그인에 실패했습니다.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" role="main" aria-label="로그인 페이지">
      {/* Enhanced floating orbs - Login specific */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating orbs with enhanced glow */}
        <div 
          className="absolute w-64 h-64 rounded-full opacity-20 blur-xl"
          style={{
            background: 'radial-gradient(circle, var(--primary-400) 0%, var(--primary-600) 50%, transparent 70%)',
            top: '10%',
            left: '15%',
            animation: 'float 8s ease-in-out infinite 0s'
          }}
        />
        <div 
          className="absolute w-48 h-48 rounded-full opacity-15 blur-xl"
          style={{
            background: 'radial-gradient(circle, var(--secondary-400) 0%, var(--secondary-600) 50%, transparent 70%)',
            top: '70%',
            right: '10%',
            animation: 'float 10s ease-in-out infinite 2s'
          }}
        />
        <div 
          className="absolute w-32 h-32 rounded-full opacity-25 blur-lg"
          style={{
            background: 'radial-gradient(circle, var(--primary-300) 0%, transparent 70%)',
            top: '40%',
            right: '25%',
            animation: 'wave-pulse 6s ease-in-out infinite 1s'
          }}
        />
        
        {/* Animated wave lines */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="loginWave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary-400)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--secondary-400)" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="loginWave2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--secondary-400)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--primary-400)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M0,150 C200,100 400,200 600,150 C700,125 750,175 800,150 L800,300 L0,300 Z"
            fill="url(#loginWave1)"
            className="wave-gentle"
            style={{ animationDelay: '0s' }}
          />
          <path
            d="M0,450 C150,400 350,500 550,450 C650,425 750,475 800,450 L800,600 L0,600 Z"
            fill="url(#loginWave2)"
            className="wave-pulse"
            style={{ animationDelay: '1.5s' }}
          />
        </svg>
      </div>

      <div className="w-full max-w-md slide-up relative z-10">
        <GlassCard variant="strong" className="p-8 backdrop-blur-xl border-white/30 shadow-2xl shadow-primary-500/20" withWaveEffect={true}>
          {/* Header with enhanced styling */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-6 wave-pulse relative">
              🌊
              <div className="absolute inset-0 rounded-full bg-primary-400/20 blur-xl scale-150 animate-pulse" />
            </div>
            <h1 className="text-4xl-ko font-bold text-white-force text-high-contrast mb-3 tracking-ko-normal break-keep-ko relative">
              <span className="bg-gradient-to-r from-primary-300 via-white to-secondary-300 bg-clip-text text-transparent">
                Moonwave
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 blur-sm -z-10 rounded-lg" />
            </h1>
            <p className="text-lg-ko text-white-force text-high-contrast tracking-ko-normal break-keep-ko opacity-90">
              구독 관리의 새로운 기준
            </p>
          </div>

          {/* Error Alert with enhanced styling */}
          {error && (
            <GlassCard variant="light" className="p-4 mb-6 border-red-400/50 bg-gradient-to-r from-red-500/20 to-red-600/10 backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <div className="text-red-300 text-xl animate-pulse">⚠️</div>
                <p className="text-sm-ko text-white-force text-high-contrast tracking-ko-normal break-keep-ko">
                  {error}
                </p>
              </div>
            </GlassCard>
          )}

          {/* Enhanced Google Login Button */}
          <WaveButton
            type="button"
            variant="glass"
            size="lg"
            className="w-full mb-6 bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/50 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 group"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            ariaLabel="Google로 로그인"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="w-6 h-6 group-hover:scale-110 transition-transform duration-200">
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              <span className="font-medium">{isGoogleLoading ? 'Google 로그인 중...' : 'Google로 간편 로그인'}</span>
            </div>
          </WaveButton>

          {/* Enhanced Divider */}
          <div className="my-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-900/50 backdrop-blur-sm px-4 py-1 rounded-full text-sm-ko text-white-force text-high-contrast tracking-ko-normal border border-white/20">
                또는 이메일로 로그인
              </span>
            </div>
          </div>

          {/* Enhanced Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Enhanced Email Field */}
            <div className="space-y-2">
              <label className="block text-sm-ko font-medium text-white-force text-high-contrast tracking-ko-normal">
                이메일 주소
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Mail className="h-5 w-5 text-white-force icon-enhanced group-focus-within:text-primary-300 transition-colors duration-200" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full pl-12 pr-4 py-4 rounded-xl
                    bg-white/10 backdrop-blur-md border border-white/20
                    text-base-ko text-white-force text-high-contrast placeholder-white/60
                    tracking-ko-normal focus:outline-none focus:ring-2 focus:ring-primary-400/50
                    focus:border-primary-400/50 focus:bg-white/15
                    hover:bg-white/15 hover:border-white/30
                    transition-all duration-300
                  "
                  placeholder="your@email.com"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>

            {/* Enhanced Password Field */}
            <div className="space-y-2">
              <label className="block text-sm-ko font-medium text-white-force text-high-contrast tracking-ko-normal">
                비밀번호
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-white-force icon-enhanced group-focus-within:text-primary-300 transition-colors duration-200" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full pl-12 pr-14 py-4 rounded-xl
                    bg-white/10 backdrop-blur-md border border-white/20
                    text-base-ko text-white-force text-high-contrast placeholder-white/60
                    tracking-ko-normal focus:outline-none focus:ring-2 focus:ring-primary-400/50
                    focus:border-primary-400/50 focus:bg-white/15
                    hover:bg-white/15 hover:border-white/30
                    transition-all duration-300
                  "
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 hover:bg-white/10 rounded-r-xl transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-white-force icon-enhanced hover:text-primary-300 transition-colors duration-200" />
                  ) : (
                    <Eye className="h-5 w-5 text-white-force icon-enhanced hover:text-primary-300 transition-colors duration-200" />
                  )}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>

            {/* Enhanced Submit Button */}
            <WaveButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-8 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transform hover:scale-[1.02] transition-all duration-300"
              disabled={isLoading}
              ariaLabel="로그인"
            >
              <div className="flex items-center justify-center space-x-3">
                <LogIn size={22} />
                <span className="font-semibold text-lg">{isLoading ? '로그인 중...' : '로그인'}</span>
              </div>
            </WaveButton>
          </form>

          {/* Enhanced Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-base-ko text-white-force text-high-contrast tracking-ko-normal break-keep-ko opacity-90">
              아직 계정이 없으신가요?{' '}
              <Link 
                to="/signup" 
                className="text-primary-300 hover:text-primary-200 font-medium transition-all duration-200 hover:underline decoration-primary-300 underline-offset-4"
              >
                회원가입하기
              </Link>
            </p>
          </div>

          {/* Enhanced Demo Credentials */}
          <GlassCard variant="light" className="mt-8 p-6 bg-gradient-to-r from-gray-800/30 to-gray-700/20 backdrop-blur-md border-gray-600/30">
            <div className="text-center space-y-3">
              <h3 className="text-base-ko font-semibold text-white-force text-high-contrast tracking-ko-normal flex items-center justify-center space-x-2">
                <span>🧪</span>
                <span>테스트 계정</span>
              </h3>
              <div className="space-y-2 text-sm-ko text-white-force text-high-contrast tracking-ko-normal bg-gray-900/40 rounded-lg p-3 border border-gray-600/20">
                <p className="flex justify-between items-center">
                  <span className="text-gray-300">이메일:</span>
                  <span className="font-mono text-primary-200">her_soul@naver.com</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-gray-300">비밀번호:</span>
                  <span className="font-mono text-primary-200">27879876</span>
                </p>
              </div>
            </div>
          </GlassCard>
        </GlassCard>
      </div>
    </div>
  );
}