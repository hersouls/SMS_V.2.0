import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className, hover = true }) => {
  return (
    <div className={cn(
      'bg-white rounded-xl border border-gray-200 shadow-sm',
      hover && 'hover:shadow-lg transition-shadow duration-200',
      '@container',
      className
    )}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn('p-6 pb-0', className)}>
      {children}
    </div>
  );
};

const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return (
    <h3 className={cn(
      'text-lg font-semibold font-pretendard tracking-ko-normal break-keep-ko',
      'text-gray-900',
      className
    )}>
      {children}
    </h3>
  );
};

const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={cn('p-6 pt-4', className)}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardContent };