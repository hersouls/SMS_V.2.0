import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, XCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import AuthLayout from '../../components/layout/AuthLayout';
import { AuthCard, GoogleIcon } from '../../components/ui';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    const { error } = await signInWithGoogle();
    
    if (error) {
      setError(error.message);
    }
    
    setLoading(false);
  };

  return (
    <AuthLayout>
      <AuthCard>
        {/* 로고 */}
        <div className="text-center space-y-2">
          <h1 className={cn(
            "text-2xl @sm:text-3xl @lg:text-4xl font-bold font-pretendard",
            "bg-gradient-to-r from-blue-600 to-purple-600",
            "bg-clip-text text-transparent tracking-ko-tight"
          )}>
            Moonwave
          </h1>
          <p className="text-sm @sm:text-base text-gray-600 font-pretendard tracking-ko-normal">
            구독 관리의 새로운 기준
          </p>
        </div>

        {/* 입력 필드 */}
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-3 rounded-lg",
                "font-pretendard tracking-ko-normal text-sm @sm:text-base",
                "border border-gray-200 focus:border-blue-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                "transition-all duration-200",
                "placeholder:text-gray-400"
              )}
              placeholder="이메일"
              aria-label="이메일 주소"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "w-full pl-10 pr-12 py-3 rounded-lg",
                "font-pretendard tracking-ko-normal text-sm @sm:text-base",
                "border border-gray-200 focus:border-blue-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                "transition-all duration-200",
                "placeholder:text-gray-400"
              )}
              placeholder="비밀번호"
              aria-label="비밀번호"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className={cn(
            "p-3 rounded-lg bg-red-50 border border-red-200",
            "flex items-center gap-2 text-sm text-red-700 font-pretendard",
            "animate-in slide-in-from-top-2 duration-200"
          )}>
            <XCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 로그인 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={cn(
            "w-full py-3 rounded-lg font-pretendard font-semibold",
            "bg-gradient-to-r from-blue-600 to-purple-600",
            "text-white hover:shadow-lg transform hover:scale-[1.02]",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
            "text-sm @sm:text-base",
            loading && "opacity-70 cursor-not-allowed"
          )}
          aria-label="로그인하기"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              로그인 중...
            </span>
          ) : (
            "로그인"
          )}
        </button>

        {/* 구분선 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white/80 px-4 text-gray-500 font-pretendard">또는</span>
          </div>
        </div>

        {/* 구글 로그인 */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={cn(
            "w-full py-3 rounded-lg border border-gray-200",
            "flex items-center justify-center gap-3",
            "font-pretendard font-medium text-gray-700",
            "hover:bg-gray-50 transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-gray-500/20",
            "text-sm @sm:text-base",
            loading && "opacity-70 cursor-not-allowed"
          )}
          aria-label="구글로 로그인하기"
        >
          <GoogleIcon className="w-5 h-5" />
          구글로 계속하기
        </button>

        {/* 회원가입 링크 */}
        <p className="text-center text-sm text-gray-600 font-pretendard tracking-ko-normal">
          계정이 없으신가요?{' '}
          <Link 
            to="/signup" 
            className="text-blue-600 hover:underline font-medium transition-colors duration-200"
            aria-label="회원가입 페이지로 이동"
          >
            회원가입
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};

export default Login;