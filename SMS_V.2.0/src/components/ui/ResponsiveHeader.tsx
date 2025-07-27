import React from 'react';
import { HomeIcon, BellIcon, UserIcon } from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';

interface ResponsiveHeaderProps {
  title?: string;
  subtitle?: string;
  showIcons?: boolean;
  className?: string;
}

const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
  title,
  subtitle,
  showIcons = true,
  className
}) => {
  return (
    <div className={cn(
      'relative bg-gradient-to-r from-blue-400 to-purple-400 overflow-hidden',
      className
    )}>
      {/* Wave Effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-blue-400/20 to-transparent"></div>
      </div>
      
      <div className="relative px-4 py-3">
        <div className="flex items-center justify-between">
          {showIcons && (
            <div className="flex items-center space-x-4 sm:space-x-6">
              <HomeIcon className="w-6 h-6 text-white hover:text-white/80 transition-colors cursor-pointer" />
              <BellIcon className="w-6 h-6 text-white hover:text-white/80 transition-colors cursor-pointer" />
              <UserIcon className="w-6 h-6 text-white hover:text-white/80 transition-colors cursor-pointer" />
            </div>
          )}
          
          <div className="flex-1"></div>
          
          {/* Center title for larger screens */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-xl font-semibold text-white">Subscriptions</h1>
          </div>
          
          {/* Right side space for potential future elements */}
          <div className="w-24"></div>
        </div>
        
        {(title || subtitle) && (
          <div className="mt-4 text-center">
            {title && (
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-white/90 text-sm md:text-base">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsiveHeader;