import React from 'react';
import { cn } from '../../lib/utils';
import { DESIGN_TOKENS } from '../../lib/design-tokens';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className 
}) => {
  const baseClasses = cn(
    'inline-flex items-center rounded-md font-medium ring-1 ring-inset',
    DESIGN_TOKENS.KOREAN_TEXT_BASE,
    'moonwave-badge'
  );

  const variants = {
    default: 'bg-gray-50 text-gray-600 ring-gray-500/10',
    success: 'bg-green-50 text-green-700 ring-green-600/20',
    warning: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
    error: 'bg-red-50 text-red-700 ring-red-600/20',
    info: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  return (
    <span className={cn(baseClasses, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};

export default Badge;