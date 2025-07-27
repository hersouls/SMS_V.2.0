import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="font-pretendard text-sm font-medium text-gray-700 tracking-ko-normal break-keep-ko">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-3 py-2 border rounded-md',
          'font-pretendard tracking-ko-normal',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'transition-all duration-200',
          error ? 'border-red-300' : 'border-gray-300',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 font-pretendard tracking-ko-normal">{error}</p>
      )}
    </div>
  );
};

export default Input;