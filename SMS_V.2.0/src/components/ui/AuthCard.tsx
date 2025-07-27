import React from 'react';
import { cn } from '../../lib/utils';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ children, className }) => {
  return (
    <div className="@container w-full max-w-md">
      <div className={cn(
        "bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20",
        "p-8 @sm:p-10 space-y-6",
        className
      )}>
        {children}
      </div>
    </div>
  );
};

export default AuthCard;