import React from 'react';
import { cn } from '../../lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 배경 그라디언트 */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      
      {/* Wave 효과 */}
      <div className="fixed inset-x-0 bottom-0 h-64 overflow-hidden">
        <svg 
          className="absolute bottom-0 w-full h-full wave-single opacity-10" 
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path 
            fill="#3b82f6" 
            d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,213.3C672,235,768,245,864,218.7C960,192,1056,128,1152,106.7C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
      
      {/* 메인 콘텐츠 */}
      <main className="relative flex-1 flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;