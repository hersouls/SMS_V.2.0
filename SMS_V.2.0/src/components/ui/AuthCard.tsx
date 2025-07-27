import React from 'react';
import { cn } from '../../lib/utils';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20",
      "p-6 @sm:p-8 @lg:p-10 space-y-6",
      "transition-all duration-300 hover:shadow-2xl",
      className
    )}>
      {children}
    </div>
  );
};

export default AuthCard;