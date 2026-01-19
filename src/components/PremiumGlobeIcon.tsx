import { motion } from 'framer-motion';

interface PremiumGlobeIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
};

const PremiumGlobeIcon = ({ className = '', size = 'md', animate = true }: PremiumGlobeIconProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`${sizeMap[size]} ${className}`}
    >
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 12px hsla(175, 42%, 35%, 0.3))' }}
      >
        <defs>
          {/* Main gradient for the globe */}
          <linearGradient id="globe-main-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(175, 42%, 45%)" />
            <stop offset="50%" stopColor="hsl(175, 42%, 38%)" />
            <stop offset="100%" stopColor="hsl(178, 48%, 25%)" />
          </linearGradient>
          
          {/* Highlight gradient for depth */}
          <radialGradient id="globe-highlight" cx="30%" cy="30%" r="50%">
            <stop offset="0%" stopColor="hsla(175, 50%, 65%, 0.4)" />
            <stop offset="100%" stopColor="hsla(175, 42%, 35%, 0)" />
          </radialGradient>
          
          {/* Shadow gradient */}
          <radialGradient id="globe-shadow" cx="70%" cy="70%" r="50%">
            <stop offset="0%" stopColor="hsla(178, 48%, 15%, 0)" />
            <stop offset="100%" stopColor="hsla(178, 48%, 15%, 0.3)" />
          </radialGradient>
          
          {/* Outer glow */}
          <filter id="globe-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Main globe circle */}
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="url(#globe-main-gradient)"
          filter="url(#globe-glow)"
        />
        
        {/* Highlight overlay */}
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="url(#globe-highlight)"
        />
        
        {/* Shadow overlay */}
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="url(#globe-shadow)"
        />
        
        {/* Meridian lines with animation */}
        <g opacity="0.3" strokeWidth="1" stroke="white" fill="none">
          {/* Central vertical meridian */}
          <ellipse cx="32" cy="32" rx="12" ry="28">
            {animate && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 32 32"
                to="360 32 32"
                dur="30s"
                repeatCount="indefinite"
              />
            )}
          </ellipse>
          
          {/* Left meridian */}
          <ellipse cx="32" cy="32" rx="22" ry="28">
            {animate && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 32 32"
                to="360 32 32"
                dur="30s"
                repeatCount="indefinite"
              />
            )}
          </ellipse>
        </g>
        
        {/* Parallel lines (latitudes) */}
        <g opacity="0.25" strokeWidth="1" stroke="white" fill="none">
          <ellipse cx="32" cy="20" rx="24" ry="6" />
          <ellipse cx="32" cy="32" rx="28" ry="8" />
          <ellipse cx="32" cy="44" rx="24" ry="6" />
        </g>
        
        {/* Stylized continent shapes */}
        <g opacity="0.5" fill="white">
          {/* Africa/Europe approximate shape */}
          <path d="M30 22 C32 20, 36 22, 38 26 C40 30, 38 36, 36 40 C34 42, 30 40, 28 36 C26 32, 28 26, 30 22 Z">
            {animate && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 32 32"
                to="360 32 32"
                dur="45s"
                repeatCount="indefinite"
              />
            )}
          </path>
          
          {/* Asia approximate shape */}
          <path d="M42 24 C46 26, 48 30, 46 34 C44 38, 40 36, 42 32 C44 28, 42 26, 42 24 Z">
            {animate && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 32 32"
                to="360 32 32"
                dur="45s"
                repeatCount="indefinite"
              />
            )}
          </path>
        </g>
        
        {/* Inner ring accent */}
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="hsla(175, 50%, 60%, 0.3)"
          strokeWidth="0.5"
        />
        
        {/* Outer glow ring */}
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="none"
          stroke="hsla(175, 42%, 45%, 0.15)"
          strokeWidth="4"
        />
      </svg>
    </motion.div>
  );
};

export default PremiumGlobeIcon;
