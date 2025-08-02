import { ReactNode } from 'react';
import { cn } from './ui/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'light' | 'default' | 'strong';
  withWaveEffect?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  style?: React.CSSProperties;
}

export function GlassCard({
  children,
  className,
  variant = 'default',
  withWaveEffect = false,
  hoverable = false,
  onClick,
  ariaLabel,
  style
}: GlassCardProps) {
  const baseClasses = 'rounded-xl relative overflow-hidden transition-all duration-500 transform-gpu will-change-transform touch-target backdrop-blur-xl';
  
  const variantClasses = {
    light: 'bg-white/5 border border-white/10 shadow-lg',
    default: 'bg-white/10 border border-white/20 shadow-xl',
    strong: 'bg-white/15 border border-white/30 shadow-2xl'
  };

  const hoverClasses = hoverable ? 
    'hover:bg-white/25 hover:border-white/50 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-primary-500/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus-ring keyboard-navigation' : '';

  const waveClasses = withWaveEffect ? 'wave-enhanced' : '';

  const combinedClasses = cn(
    baseClasses,
    variantClasses[variant],
    hoverClasses,
    waveClasses,
    className
  );

  return (
    <div 
      className={combinedClasses} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : -1}
      aria-label={ariaLabel}
      style={style}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Enhanced glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            animation: 'wave-shimmer 3s ease-in-out infinite'
          }}
        />
      </div>

      {withWaveEffect && (
        <>
          {/* Enhanced wave background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              <defs>
                <linearGradient id={`wave-gradient-${variant}-enhanced`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary-400)" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="var(--secondary-400)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--primary-300)" stopOpacity="0.2" />
                </linearGradient>
                <filter id={`wave-glow-${variant}`}>
                  <feGaussianBlur stdDeviation="2" />
                  <feColorMatrix type="saturate" values="1.5"/>
                </filter>
              </defs>
              <path
                d="M0,100 C80,60 160,140 240,100 C320,60 360,140 400,100 L400,200 L0,200 Z"
                fill={`url(#wave-gradient-${variant}-enhanced)`}
                filter={`url(#wave-glow-${variant})`}
                className="wave-gentle"
                style={{
                  animation: 'wave-gentle 8s ease-in-out infinite'
                }}
              />
              <path
                d="M0,120 C100,80 200,160 300,120 C350,100 380,140 400,120 L400,200 L0,200 Z"
                fill={`url(#wave-gradient-${variant}-enhanced)`}
                opacity="0.7"
                filter={`url(#wave-glow-${variant})`}
                className="wave-pulse"
                style={{
                  animation: 'wave-pulse 6s ease-in-out infinite 1s'
                }}
              />
            </svg>
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => {
              const size = Math.random() * 3 + 1;
              const colors = ['var(--primary-300)', 'var(--secondary-300)', 'var(--primary-400)'];
              const color = colors[i % colors.length];
              
              return (
                <div
                  key={`glass-particle-${i}`}
                  className="absolute rounded-full blur-sm"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${20 + (i * 15)}%`,
                    top: `${30 + (i * 10)}%`,
                    backgroundColor: color,
                    animation: `floating-orb ${4 + i}s ease-in-out infinite ${i * 0.5}s`,
                    boxShadow: `0 0 ${size * 6}px ${color}`,
                  }}
                />
              );
            })}
          </div>

          {/* Glass reflection */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-white/30 via-transparent to-transparent" />
        </>
      )}

      {/* Content with enhanced glass border */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Enhanced bottom glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary-400/50 to-transparent blur-sm" />
    </div>
  );
}