import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

interface MapCornerDecorationsProps {
  className?: string;
}

// Cannabis leaf line art SVG component
function CannabisLeafArt({ className = '' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 120 150" 
      fill="none" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main stem */}
      <path
        d="M60 150 L60 75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      
      {/* Center leaf */}
      <path
        d="M60 75 Q60 40 60 10 Q65 35 75 55 Q70 45 60 35 Q75 50 85 40 Q70 55 60 50 Q80 60 90 55 Q70 65 60 60 Q75 70 80 75 Q65 70 60 75"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      
      {/* Left leaves */}
      <path
        d="M60 75 Q40 65 25 45 Q45 60 55 70"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M60 85 Q35 80 15 65 Q40 75 55 82"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
      
      {/* Right leaves */}
      <path
        d="M60 75 Q80 65 95 45 Q75 60 65 70"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M60 85 Q85 80 105 65 Q80 75 65 82"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
      
      {/* Subtle veins */}
      <path
        d="M60 50 L55 40 M60 50 L65 40 M60 60 L50 55 M60 60 L70 55"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        opacity="0.25"
      />
    </svg>
  );
}

// Organic branch line art
function OrganicBranchArt({ className = '' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 200 100" 
      fill="none" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main branch */}
      <path
        d="M0 80 Q50 70 100 50 Q150 30 200 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
      
      {/* Small leaves along branch */}
      <path
        d="M40 73 Q50 60 55 70 Q45 68 40 73"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M80 58 Q95 45 100 55 Q85 53 80 58"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M130 40 Q148 28 155 38 Q135 35 130 40"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M170 28 Q188 18 195 25 Q175 22 170 28"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        opacity="0.25"
      />
      
      {/* Small dots/buds */}
      <circle cx="60" cy="68" r="1.5" fill="currentColor" opacity="0.2" />
      <circle cx="110" cy="48" r="1.5" fill="currentColor" opacity="0.2" />
      <circle cx="160" cy="32" r="1.5" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

export default function MapCornerDecorations({ className = '' }: MapCornerDecorationsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'system';
  
  // Theme-aware opacities
  const leafOpacity = isDark ? 'text-primary/30' : 'text-primary/20';
  const leafOpacity2 = isDark ? 'text-primary/25' : 'text-primary/15';
  const branchOpacity = isDark ? 'text-primary/20' : 'text-primary/12';
  const branchOpacity2 = isDark ? 'text-primary/15' : 'text-primary/10';
  
  // Theme-aware orb colors
  const orbBg1 = isDark 
    ? 'radial-gradient(circle, hsl(175 42% 30% / 0.15) 0%, transparent 60%)'
    : 'radial-gradient(circle, hsl(175 42% 50% / 0.06) 0%, transparent 60%)';
  const orbBg2 = isDark 
    ? 'radial-gradient(circle, hsl(175 42% 25% / 0.12) 0%, transparent 60%)'
    : 'radial-gradient(circle, hsl(175 42% 45% / 0.05) 0%, transparent 60%)';
  
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Top-left corner */}
      <motion.div
        className={`absolute top-20 left-4 md:left-8 ${leafOpacity}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <CannabisLeafArt className="w-16 h-20 md:w-20 md:h-24 rotate-[-15deg]" />
      </motion.div>
      
      {/* Top-right corner */}
      <motion.div
        className={`absolute top-24 right-4 md:right-8 ${leafOpacity2}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <CannabisLeafArt className="w-12 h-16 md:w-16 md:h-20 rotate-[20deg] scale-x-[-1]" />
      </motion.div>
      
      {/* Bottom-left branch */}
      <motion.div
        className={`absolute bottom-44 md:bottom-48 left-0 ${branchOpacity}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <OrganicBranchArt className="w-32 md:w-48 h-16 md:h-20" />
      </motion.div>
      
      {/* Bottom-right branch */}
      <motion.div
        className={`absolute bottom-52 md:bottom-56 right-0 ${branchOpacity2}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <OrganicBranchArt className="w-28 md:w-40 h-14 md:h-18 scale-x-[-1]" />
      </motion.div>
      
      {/* Subtle gradient orbs in corners */}
      <div 
        className={`absolute -top-20 -left-20 w-80 h-80 rounded-full ${isDark ? 'opacity-30' : 'opacity-50'}`}
        style={{ background: orbBg1 }}
      />
      <div 
        className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full ${isDark ? 'opacity-20' : 'opacity-40'}`}
        style={{ background: orbBg2 }}
      />
    </div>
  );
}
