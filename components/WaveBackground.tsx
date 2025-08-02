import { useEffect, useRef } from 'react';

export function WaveBackground() {
  return (
    <>
      {/* Enhanced main gradient background - 최적화된 Moonwave 배경 */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-primary-950 to-gray-950" />
      
      {/* Enhanced secondary depth layer */}
      <div className="fixed inset-0 bg-gradient-to-t from-gray-950/95 via-transparent to-primary-950/30" />
      
      {/* Additional atmospheric layer */}
      <div className="fixed inset-0 bg-gradient-radial from-primary-900/20 via-transparent to-secondary-900/20 opacity-60" />
      
      {/* Enhanced animated wave layers */}
      <div className="fixed inset-0 opacity-30 pointer-events-none overflow-hidden">
        {/* Primary Wave Layer - Enhanced */}
        <svg
          viewBox="0 0 1400 800"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="primaryWaveEnhanced" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary-400)" stopOpacity="0.5" />
              <stop offset="30%" stopColor="var(--primary-500)" stopOpacity="0.4" />
              <stop offset="70%" stopColor="var(--secondary-500)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--primary-600)" stopOpacity="0.2" />
            </linearGradient>
            <filter id="blurEnhanced1">
              <feGaussianBlur stdDeviation="3" />
              <feColorMatrix type="saturate" values="1.4"/>
            </filter>
          </defs>
          <path
            d="M0,400 C200,300 400,500 700,400 C1000,300 1200,500 1400,400 L1400,800 L0,800 Z"
            fill="url(#primaryWaveEnhanced)"
            filter="url(#blurEnhanced1)"
            className="wave-gentle"
            style={{
              transformOrigin: 'center',
              animationDelay: '0s',
              animation: 'wave-gentle 12s ease-in-out infinite'
            }}
          />
        </svg>
        
        {/* Secondary Wave Layer - Enhanced */}
        <svg
          viewBox="0 0 1400 800"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="secondaryWaveEnhanced" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--secondary-400)" stopOpacity="0.4" />
              <stop offset="50%" stopColor="var(--primary-500)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--secondary-600)" stopOpacity="0.2" />
            </linearGradient>
            <filter id="blurEnhanced2">
              <feGaussianBlur stdDeviation="4" />
              <feColorMatrix type="saturate" values="1.6"/>
            </filter>
          </defs>
          <path
            d="M0,500 C300,400 500,600 800,500 C1100,400 1300,600 1400,500 L1400,800 L0,800 Z"
            fill="url(#secondaryWaveEnhanced)"
            filter="url(#blurEnhanced2)"
            className="wave-gentle"
            style={{
              transformOrigin: 'center',
              animationDelay: '2s',
              animationDirection: 'reverse',
              animation: 'wave-pulse 15s ease-in-out infinite'
            }}
          />
        </svg>
        
        {/* Accent Wave Layer - Enhanced */}
        <svg
          viewBox="0 0 1400 800"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="accentWaveEnhanced" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary-300)" stopOpacity="0.4" />
              <stop offset="50%" stopColor="var(--secondary-300)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--primary-400)" stopOpacity="0.2" />
            </linearGradient>
            <filter id="blurEnhanced3">
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="saturate" values="1.8"/>
            </filter>
          </defs>
          <path
            d="M0,300 C250,200 450,400 750,300 C1050,200 1250,400 1400,300 L1400,800 L0,800 Z"
            fill="url(#accentWaveEnhanced)"
            filter="url(#blurEnhanced3)"
            className="wave-pulse"
            style={{
              transformOrigin: 'center',
              animationDelay: '1s',
              animation: 'wave-gentle 10s ease-in-out infinite'
            }}
          />
        </svg>

        {/* New Dynamic Wave Layer */}
        <svg
          viewBox="0 0 1400 800"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="dynamicWave" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--secondary-200)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--primary-200)" stopOpacity="0.1" />
            </linearGradient>
            <filter id="dynamicBlur">
              <feGaussianBlur stdDeviation="1" />
            </filter>
          </defs>
          <path
            d="M0,200 C350,150 700,250 1050,200 C1225,175 1300,225 1400,200 L1400,400 L0,400 Z"
            fill="url(#dynamicWave)"
            filter="url(#dynamicBlur)"
            style={{
              animation: 'wave-pulse 8s ease-in-out infinite 0.5s'
            }}
          />
        </svg>

        {/* Deep Current Layer - Enhanced */}
        <svg
          viewBox="0 0 1400 800"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="deepWaveEnhanced" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--gray-700)" stopOpacity="0.5" />
              <stop offset="50%" stopColor="var(--primary-800)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--gray-800)" stopOpacity="0.3" />
            </linearGradient>
            <filter id="deepBlur">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>
          <path
            d="M0,600 C350,500 700,700 1050,600 C1225,550 1300,650 1400,600 L1400,800 L0,800 Z"
            fill="url(#deepWaveEnhanced)"
            filter="url(#deepBlur)"
            className="float"
            style={{
              transformOrigin: 'center',
              animationDelay: '3s',
              animation: 'float 18s ease-in-out infinite'
            }}
          />
        </svg>
      </div>
      
      {/* Enhanced floating light particles */}
      <div className="fixed inset-0 opacity-15 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => {
          const size = Math.random() * 4 + 1;
          const colors = [
            'var(--primary-300)',
            'var(--secondary-300)',
            'var(--primary-400)',
            'var(--secondary-400)',
            'var(--primary-200)',
            'var(--secondary-200)'
          ];
          const color = colors[i % colors.length];
          
          return (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full blur-sm"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: color,
                animation: `floating-orb ${Math.random() * 6 + 8}s ease-in-out infinite ${Math.random() * 4}s`,
                boxShadow: `0 0 ${size * 6}px ${color}`,
              }}
            />
          );
        })}
      </div>

      {/* Enhanced larger floating orbs */}
      <div className="fixed inset-0 opacity-8 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => {
          const size = Math.random() * 30 + 20;
          const positions = [
            { left: '10%', top: '20%' },
            { left: '80%', top: '15%' },
            { left: '25%', top: '75%' },
            { left: '75%', top: '80%' },
            { left: '50%', top: '30%' },
            { left: '15%', top: '60%' },
          ];
          const pos = positions[i];
          const isSecondary = i % 2 === 1;
          
          return (
            <div
              key={`orb-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: pos.left,
                top: pos.top,
                background: `radial-gradient(circle, var(--${isSecondary ? 'secondary' : 'primary'}-400) 0%, var(--${isSecondary ? 'secondary' : 'primary'}-600) 40%, transparent 70%)`,
                animation: `floating-orb ${Math.random() * 4 + 12}s ease-in-out infinite ${Math.random() * 3}s`,
                filter: 'blur(12px)',
              }}
            />
          );
        })}
      </div>
      
      {/* Enhanced moonbeam effects */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`beam-${i}`}
            className="absolute"
            style={{
              width: '3px',
              height: '100%',
              left: `${15 + i * 20}%`,
              background: `linear-gradient(to bottom, var(--${i % 2 === 0 ? 'primary' : 'secondary'}-300), transparent)`,
              animation: `shimmer ${5 + i * 0.5}s ease-in-out infinite ${i * 2}s`,
              transform: `rotate(${-10 + i * 5}deg)`,
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>
      
      {/* Enhanced animated gradient overlay */}
      <div 
        className="fixed inset-0 opacity-6 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, var(--primary-400) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 80%, var(--secondary-400) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 50%, var(--primary-300) 0%, transparent 50%)
          `,
          animation: 'glass-glow 20s ease-in-out infinite alternate',
        }}
      />
      
      {/* Enhanced noise texture */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' fill='%23${encodeURIComponent('94a3b8')}'/%3E%3C/svg%3E")`,
        }}
      />

      {/* New: Dynamic light rays */}
      <div className="fixed inset-0 opacity-5 pointer-events-none overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`ray-${i}`}
            className="absolute"
            style={{
              width: '200px',
              height: '2px',
              left: `${30 + i * 20}%`,
              top: `${20 + i * 30}%`,
              background: `linear-gradient(90deg, transparent, var(--primary-300), transparent)`,
              animation: `wave-shimmer ${8 + i * 2}s ease-in-out infinite ${i * 3}s`,
              transform: `rotate(${30 + i * 15}deg)`,
              filter: 'blur(2px)',
            }}
          />
        ))}
      </div>
    </>
  );
}