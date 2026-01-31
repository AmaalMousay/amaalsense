import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

/**
 * Amaalsense Logo Component
 * A unique brain-wave logo representing emotional intelligence and data analysis
 */
export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-lg' },
    md: { icon: 'w-8 h-8', text: 'text-2xl' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl' },
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/logo-icon.png" 
        alt="Amaalsense Logo" 
        className={`${sizes[size].icon} object-contain`}
      />
      {showText && (
        <span className={`font-bold gradient-text ${sizes[size].text}`}>
          Amaalsense
        </span>
      )}
    </div>
  );
}

/**
 * Logo Icon Only - for favicon, small spaces
 */
export function LogoIcon({ size = 'md', className = '' }: Omit<LogoProps, 'showText'>) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <img 
      src="/logo-icon.png" 
      alt="Amaalsense" 
      className={`${sizes[size]} object-contain ${className}`}
    />
  );
}

/**
 * SVG Logo Component - for inline use without image loading
 */
export function LogoSVG({ size = 'md', className = '' }: Omit<LogoProps, 'showText'>) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${sizes[size]} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="brainGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8D5CF6" />
          <stop offset="50%" stopColor="#457B9D" />
          <stop offset="100%" stopColor="#2A9D8F" />
        </linearGradient>
      </defs>
      {/* Abstract brain with flowing waves */}
      <path 
        d="M50 10C30 10 15 25 15 45C15 55 20 65 30 70C25 75 20 85 25 90C35 95 45 85 50 80C55 85 65 95 75 90C80 85 75 75 70 70C80 65 85 55 85 45C85 25 70 10 50 10Z" 
        stroke="url(#brainGradient)" 
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Inner wave patterns */}
      <path 
        d="M30 40C35 35 45 35 50 40C55 45 65 45 70 40" 
        stroke="url(#brainGradient)" 
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path 
        d="M30 55C35 50 45 50 50 55C55 60 65 60 70 55" 
        stroke="url(#brainGradient)" 
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Neural connection dots */}
      <circle cx="35" cy="30" r="3" fill="url(#brainGradient)" />
      <circle cx="65" cy="30" r="3" fill="url(#brainGradient)" />
      <circle cx="50" cy="65" r="3" fill="url(#brainGradient)" />
    </svg>
  );
}
