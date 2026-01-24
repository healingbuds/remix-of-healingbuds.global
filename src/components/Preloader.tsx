/**
 * Premium Preloader Component
 * Cinematic loading experience with logo morph animation
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import hbLogoIconWhite from '@/assets/hb-logo-icon.png';
import hbLogoIconGreen from '@/assets/hb-logo-icon-green.png';

interface PreloaderProps {
  onComplete?: () => void;
  minimumDuration?: number;
}

const Preloader = ({ onComplete, minimumDuration = 2400 }: PreloaderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [phase, setPhase] = useState<'icon' | 'wordmark' | 'tagline' | 'exit'>('icon');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const logoIcon = isDark ? hbLogoIconWhite : hbLogoIconGreen;

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setIsLoading(false);
      onComplete?.();
      return;
    }

    // Phase timing
    const iconPhase = setTimeout(() => setPhase('wordmark'), 800);
    const wordmarkPhase = setTimeout(() => setPhase('tagline'), 1500);
    const taglinePhase = setTimeout(() => setPhase('exit'), 2200);
    
    // Complete loading
    const completeTimer = setTimeout(() => {
      setIsLoading(false);
      onComplete?.();
    }, minimumDuration);

    return () => {
      clearTimeout(iconPhase);
      clearTimeout(wordmarkPhase);
      clearTimeout(taglinePhase);
      clearTimeout(completeTimer);
    };
  }, [minimumDuration, onComplete]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05,
            filter: 'blur(10px)',
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          aria-busy="true"
          aria-label="Loading Healing Buds"
        >
          {/* Ambient glow background */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{
                background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>

          {/* Logo Container */}
          <div className="relative flex flex-col items-center gap-6">
            {/* Icon */}
            <motion.div
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: phase === 'icon' ? 1 : 0.9,
                opacity: 1,
                y: phase === 'wordmark' || phase === 'tagline' || phase === 'exit' ? -20 : 0,
              }}
              transition={{ 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              {/* Logo icon */}
              <motion.img
                src={logoIcon}
                alt="Healing Buds"
                className="w-24 h-24 md:w-32 md:h-32 relative z-10"
                initial={{ rotate: -5 }}
                animate={{ 
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            {/* Wordmark */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: phase === 'wordmark' || phase === 'tagline' || phase === 'exit' ? 1 : 0,
                y: phase === 'wordmark' || phase === 'tagline' || phase === 'exit' ? 0 : 20,
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-pharma text-3xl md:text-4xl font-bold text-foreground tracking-wide">
                {'Healing Buds'.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: phase === 'wordmark' || phase === 'tagline' || phase === 'exit' ? 1 : 0,
                      y: phase === 'wordmark' || phase === 'tagline' || phase === 'exit' ? 0 : 10,
                    }}
                    transition={{ 
                      duration: 0.4, 
                      delay: i * 0.03,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="text-muted-foreground text-sm md:text-base tracking-widest uppercase font-geist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: phase === 'tagline' || phase === 'exit' ? 1 : 0,
                y: phase === 'tagline' || phase === 'exit' ? 0 : 10,
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Shaping the Future of Cannabis
            </motion.p>

            {/* Loading indicator */}
            <motion.div
              className="absolute -bottom-16 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary/60"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
