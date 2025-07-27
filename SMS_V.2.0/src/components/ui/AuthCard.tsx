import React from 'react';
import { cn } from '../../lib/utils';
import { DESIGN_TOKENS } from '../../lib/design-tokens';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ children, className }) => {
  return (
    <div className="@container w-full max-w-md">
      <div className={cn(
        "bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20",
        "p-6 @sm:p-8 @lg:p-10 space-y-6",
        "transition-all duration-300 hover:shadow-2xl",
        DESIGN_TOKENS.KOREAN_TEXT_BASE,
        className
      )}>
        {children}
      </div>
    </div>
  );
};

export default AuthCard;