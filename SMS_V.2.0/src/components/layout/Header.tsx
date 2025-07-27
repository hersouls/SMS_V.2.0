import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bell, User } from 'lucide-react';
import { cn } from '../../lib/utils';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Wave Effect Background */}
      <div className="absolute inset-0 h-20 overflow-hidden">
        <svg 
          className="absolute bottom-0 w-full wave-single"
          style={{ height: '80px', opacity: 0.3 }}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path 
            fill="#3b82f6" 
            d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,213.3C672,235,768,245,864,218.7C960,192,1056,128,1152,106.7C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
      
      {/* Glass Card Navigation */}
      <nav className="relative">
        <div className="mx-auto max-w-7xl px-4 @sm:px-6 @lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Home Button */}
            <Link
              to="/dashboard"
              className="glass-button p-3 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-200"
              aria-label="홈으로 가기"
            >
              <Home className="w-5 h-5 text-white" />
            </Link>
            
            {/* Right Side Buttons */}
            <div className="flex items-center gap-3">
              {/* Notifications Button */}
              <Link
                to="/notifications"
                className={cn(
                  "glass-button p-3 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-200",
                  location.pathname === '/notifications' && "bg-white/30"
                )}
                aria-label="알림"
              >
                <Bell className="w-5 h-5 text-white" />
              </Link>
              
              {/* Profile Button */}
              <Link
                to="/settings"
                className={cn(
                  "glass-button p-3 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-200",
                  location.pathname === '/settings' && "bg-white/30"
                )}
                aria-label="프로필"
              >
                <User className="w-5 h-5 text-white" />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;