import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bell, User } from 'lucide-react';
import { cn } from '../../lib/utils';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Wave SVG Background */}
      <div className="absolute inset-0">
        <svg
          className="w-full h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-blue-600"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-blue-500"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-blue-400"
          />
        </svg>
      </div>

      {/* Header Content */}
      <div className="relative flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-white font-semibold text-lg hidden sm:block">
            Moonwave
          </span>
        </Link>

        {/* Navigation Icons */}
        <nav className="flex items-center space-x-2">
          <Link
            to="/dashboard"
            className={cn(
              'p-2 rounded-lg transition-all duration-200',
              location.pathname === '/dashboard'
                ? 'bg-white/20 text-white backdrop-blur-sm'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            )}
          >
            <Home className="w-5 h-5" />
          </Link>
          
          <Link
            to="/notifications"
            className={cn(
              'p-2 rounded-lg transition-all duration-200',
              location.pathname === '/notifications'
                ? 'bg-white/20 text-white backdrop-blur-sm'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            )}
          >
            <Bell className="w-5 h-5" />
          </Link>
          
          <Link
            to="/profile"
            className={cn(
              'p-2 rounded-lg transition-all duration-200',
              location.pathname === '/profile'
                ? 'bg-white/20 text-white backdrop-blur-sm'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            )}
          >
            <User className="w-5 h-5" />
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;