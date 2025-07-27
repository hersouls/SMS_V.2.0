import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="space-y-1 @sm:space-y-2">
      {label && (
        <label className="font-sans text-sm @sm:text-base font-medium text-gray-700 tracking-ko-normal break-keep-ko">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-3 py-2 @sm:px-4 @sm:py-3 @lg:px-5 @lg:py-4 border rounded-md',
          'font-sans tracking-ko-normal text-sm @sm:text-base @lg:text-lg',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'transition-all duration-200',
          error ? 'border-red-300' : 'border-gray-300',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm @sm:text-base text-red-600 font-sans tracking-ko-normal">{error}</p>
      )}
    </div>
  );
};

export default Input;