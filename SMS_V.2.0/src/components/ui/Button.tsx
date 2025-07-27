import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children,
  className,
  loading = false,
  disabled,
  ...props 
}) => {
  const baseClasses = cn(
    'font-sans font-semibold rounded-lg transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'tracking-ko-normal break-keep-ko antialiased',
    'inline-flex items-center justify-center',
  );
  
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
    destructive: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700'
  };
  
  const sizes = {
    sm: 'py-1.5 px-3 text-sm gap-1.5 @sm:py-2 @sm:px-4 @sm:text-base @sm:gap-2',
    md: 'py-2 px-4 text-base gap-2 @sm:py-2.5 @sm:px-5 @sm:text-lg @sm:gap-2.5 @lg:py-3 @lg:px-6 @lg:text-xl @lg:gap-3',
    lg: 'py-3 px-6 text-lg gap-2.5 @sm:py-4 @sm:px-8 @sm:text-xl @sm:gap-3 @lg:py-5 @lg:px-10 @lg:text-2xl @lg:gap-4'
  };
  
  return (
    <button 
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
      )}
      {children}
    </button>
  );
};

export default Button;