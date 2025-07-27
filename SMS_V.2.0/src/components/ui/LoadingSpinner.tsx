import React from 'react'
import { cn } from '../../lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  text = '로딩 중...'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className={cn(
          'mt-2 text-gray-600 break-keep-ko tracking-ko-normal font-pretendard font-medium',
          textSizes[size]
        )}>
          {text}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner