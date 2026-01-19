import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useTheme } from 'next-themes';

interface MapAmbientParticlesProps {
  particleCount?: number;
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export default function MapAmbientParticles({ 
  particleCount = 40, 
  className = '' 
}: MapAmbientParticlesProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Theme-aware colors
  const particleColor = isDark ? 'hsl(175, 42%, 50%)' : 'hsl(178, 48%, 35%)';
  const orbColor = isDark ? 'hsl(175, 42%, 30%, 0.15)' : 'hsl(175, 42%, 50%, 0.06)';
  
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: isDark ? (Math.random() * 0.4 + 0.1) : (Math.random() * 0.25 + 0.08),
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
    }));
  }, [particleCount, isDark]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle, ${particleColor} 0%, transparent 70%)`,
          }}
          initial={{ 
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            opacity: [0, particle.opacity, particle.opacity * 0.5, particle.opacity, 0],
            scale: [0.5, 1, 1.2, 1, 0.5],
            x: [0, Math.random() * 60 - 30, Math.random() * 80 - 40, Math.random() * 60 - 30, 0],
            y: [0, Math.random() * 40 - 20, Math.random() * 60 - 30, Math.random() * 40 - 20, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Larger floating orbs for depth */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full blur-xl"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
            width: 80 + i * 20,
            height: 80 + i * 20,
            background: `radial-gradient(circle, ${orbColor} 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 30 * (i % 2 === 0 ? 1 : -1), 0],
            y: [0, 20 * (i % 2 === 0 ? -1 : 1), 0],
            scale: [1, 1.1, 1],
            opacity: isDark ? [0.3, 0.5, 0.3] : [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
