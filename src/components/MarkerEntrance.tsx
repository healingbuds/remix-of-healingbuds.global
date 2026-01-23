/**
 * Marker Entrance Animation Component
 * Animated entrance for map markers with staggered timing
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MarkerEntranceProps {
  markers: Array<{
    key: string;
    name: string;
    x: number;
    y: number;
    status: 'LIVE' | 'HQ' | 'PRODUCTION' | 'NEXT';
    delay: number;
  }>;
  isDark: boolean;
  onMarkerClick?: (key: string) => void;
}

const MARKER_COLORS = {
  LIVE: {
    gradient: 'linear-gradient(135deg, hsl(175, 42%, 45%), hsl(168, 38%, 35%))',
    glow: 'hsl(175, 42%, 40%)',
  },
  HQ: {
    gradient: 'linear-gradient(135deg, hsl(280, 60%, 55%), hsl(260, 50%, 45%))',
    glow: 'hsl(280, 55%, 50%)',
  },
  PRODUCTION: {
    gradient: 'linear-gradient(135deg, hsl(200, 70%, 50%), hsl(210, 60%, 40%))',
    glow: 'hsl(200, 65%, 45%)',
  },
  NEXT: {
    gradient: 'linear-gradient(135deg, hsl(45, 93%, 55%), hsl(38, 80%, 50%))',
    glow: 'hsl(45, 93%, 50%)',
  },
};

const MarkerEntrance = ({ markers, isDark, onMarkerClick }: MarkerEntranceProps) => {
  const [visibleMarkers, setVisibleMarkers] = useState<string[]>([]);
  const [showRipples, setShowRipples] = useState<string[]>([]);

  useEffect(() => {
    markers.forEach(({ key, delay }) => {
      // Show marker
      setTimeout(() => {
        setVisibleMarkers(prev => [...prev, key]);
        
        // Show ripple after marker appears
        setTimeout(() => {
          setShowRipples(prev => [...prev, key]);
        }, 200);
      }, delay * 1000);
    });
  }, [markers]);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-[450]"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {Object.entries(MARKER_COLORS).map(([status, colors]) => (
          <radialGradient key={`marker-gradient-${status}`} id={`marker-gradient-${status}`}>
            <stop offset="0%" stopColor={colors.glow} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors.glow} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      <AnimatePresence>
        {markers.map(({ key, name, x, y, status, delay }) => {
          const colors = MARKER_COLORS[status];
          const isVisible = visibleMarkers.includes(key);
          const hasRipple = showRipples.includes(key);

          return (
            <g key={key}>
              {/* Ripple effect */}
              {hasRipple && (status === 'LIVE' || status === 'HQ' || status === 'PRODUCTION') && (
                <>
                  <motion.circle
                    cx={x}
                    cy={y}
                    fill="none"
                    stroke={colors.glow}
                    strokeWidth={2}
                    initial={{ r: 20, opacity: 0.6 }}
                    animate={{ r: 50, opacity: 0 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />
                  <motion.circle
                    cx={x}
                    cy={y}
                    fill="none"
                    stroke={colors.glow}
                    strokeWidth={1.5}
                    initial={{ r: 20, opacity: 0.4 }}
                    animate={{ r: 60, opacity: 0 }}
                    transition={{
                      duration: 2,
                      delay: 0.5,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />
                </>
              )}

              {/* Main marker */}
              {isVisible && (
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 15,
                    mass: 1,
                  }}
                  style={{ transformOrigin: `${x}px ${y}px` }}
                >
                  {/* Glow */}
                  <circle
                    cx={x}
                    cy={y}
                    r={30}
                    fill={`url(#marker-gradient-${status})`}
                    opacity={0.5}
                  />
                  
                  {/* Outer ring */}
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={18}
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth={2}
                    animate={{
                      r: [18, 22, 18],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </motion.g>
              )}
            </g>
          );
        })}
      </AnimatePresence>
    </svg>
  );
};

export default MarkerEntrance;
