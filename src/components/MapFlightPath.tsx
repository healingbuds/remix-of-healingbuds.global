/**
 * Map Flight Path SVG Overlay
 * 3D-style animated flight paths with energy particles
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FlightPathProps {
  mapBounds: {
    north: number;
    south: number;
    east: number;
    west: number;
    width: number;
    height: number;
  } | null;
  connections: Array<{
    from: [number, number];
    to: [number, number];
    fromKey: string;
    toKey: string;
    delay: number;
  }>;
  isDark: boolean;
}

// Convert lat/lng to SVG coordinates
function latLngToPoint(
  lat: number, 
  lng: number, 
  bounds: FlightPathProps['mapBounds']
): { x: number; y: number } {
  if (!bounds) return { x: 0, y: 0 };
  
  const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * bounds.width;
  const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * bounds.height;
  
  return { x, y };
}

// Generate curved path between two points
function generateCurvedPath(
  from: { x: number; y: number },
  to: { x: number; y: number }
): string {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  
  // Calculate control point offset based on distance
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Curve upward (negative Y in SVG)
  const curveHeight = distance * 0.25;
  const controlX = midX;
  const controlY = midY - curveHeight;
  
  return `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;
}

const MapFlightPath = ({ mapBounds, connections, isDark }: FlightPathProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!mapBounds || !isVisible) return null;

  const gradientColors = {
    portugal: isDark ? '#a855f7' : '#9333ea', // Purple for HQ
    southAfrica: isDark ? '#4fd1c5' : '#14b8a6', // Teal
    thailand: isDark ? '#60a5fa' : '#3b82f6', // Blue
    uk: isDark ? '#fbbf24' : '#f59e0b', // Amber
  };

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-[400]"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Gradient definitions for each path */}
        {connections.map(({ fromKey, toKey }) => (
          <linearGradient
            key={`gradient-${fromKey}-${toKey}`}
            id={`flight-gradient-${fromKey}-${toKey}`}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={gradientColors[fromKey as keyof typeof gradientColors] || '#a855f7'} />
            <stop offset="100%" stopColor={gradientColors[toKey as keyof typeof gradientColors] || '#4fd1c5'} />
          </linearGradient>
        ))}
        
        {/* Glow filter */}
        <filter id="flight-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Particle glow */}
        <filter id="particle-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Animated particle gradient */}
        <radialGradient id="particle-gradient">
          <stop offset="0%" stopColor={isDark ? '#4fd1c5' : '#14b8a6'} stopOpacity="1" />
          <stop offset="50%" stopColor={isDark ? '#4fd1c5' : '#14b8a6'} stopOpacity="0.6" />
          <stop offset="100%" stopColor={isDark ? '#4fd1c5' : '#14b8a6'} stopOpacity="0" />
        </radialGradient>
      </defs>

      {connections.map(({ from, to, fromKey, toKey, delay }, index) => {
        const fromPoint = latLngToPoint(from[0], from[1], mapBounds);
        const toPoint = latLngToPoint(to[0], to[1], mapBounds);
        const pathD = generateCurvedPath(fromPoint, toPoint);
        const pathId = `flight-path-${fromKey}-${toKey}`;

        return (
          <g key={pathId}>
            {/* Path definition for animation reference */}
            <defs>
              <path id={pathId} d={pathD} fill="none" />
            </defs>

            {/* Background glow path */}
            <motion.path
              d={pathD}
              fill="none"
              stroke={`url(#flight-gradient-${fromKey}-${toKey})`}
              strokeWidth={6}
              strokeOpacity={0.15}
              filter="url(#flight-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.5,
                delay: delay,
                ease: [0.16, 1, 0.3, 1],
              }}
            />

            {/* Main animated path */}
            <motion.path
              d={pathD}
              fill="none"
              stroke={`url(#flight-gradient-${fromKey}-${toKey})`}
              strokeWidth={2}
              strokeOpacity={0.8}
              strokeDasharray="10 6"
              initial={{ pathLength: 0, strokeDashoffset: 0 }}
              animate={{ 
                pathLength: 1,
                strokeDashoffset: -32,
              }}
              transition={{
                pathLength: {
                  duration: 1.5,
                  delay: delay,
                  ease: [0.16, 1, 0.3, 1],
                },
                strokeDashoffset: {
                  duration: 2,
                  delay: delay + 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }}
            />

            {/* Energy particles */}
            {[0, 1, 2].map((particleIndex) => (
              <motion.circle
                key={`particle-${pathId}-${particleIndex}`}
                r={particleIndex === 1 ? 4 : 3}
                fill="url(#particle-gradient)"
                filter="url(#particle-glow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 3,
                  delay: delay + 1.5 + particleIndex * 1,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              >
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${delay + 1.5 + particleIndex * 1}s`}
                >
                  <mpath href={`#${pathId}`} />
                </animateMotion>
              </motion.circle>
            ))}
          </g>
        );
      })}
    </svg>
  );
};

export default MapFlightPath;
