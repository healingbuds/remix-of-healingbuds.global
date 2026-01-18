import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const RouteProgress = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const completeRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timers
    if (progressRef.current) clearInterval(progressRef.current);
    if (completeRef.current) clearTimeout(completeRef.current);

    // Start loading
    setIsLoading(true);
    setProgress(0);

    // Animate progress with easing simulation
    let currentProgress = 0;
    const targetProgress = 85; // Stop at 85% until complete
    
    progressRef.current = setInterval(() => {
      // Ease out - progress slows as it approaches target
      const remaining = targetProgress - currentProgress;
      const increment = remaining * 0.15;
      currentProgress = Math.min(currentProgress + increment, targetProgress);
      setProgress(currentProgress);
      
      if (currentProgress >= targetProgress - 0.5) {
        if (progressRef.current) clearInterval(progressRef.current);
      }
    }, 50);

    // Complete the progress bar after content loads
    completeRef.current = setTimeout(() => {
      setProgress(100);
      // Hide after completion animation
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 400);
    }, 350);

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
      if (completeRef.current) clearTimeout(completeRef.current);
    };
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[9999] h-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Background track */}
          <div className="absolute inset-0 bg-primary/10" />
          
          {/* Progress bar */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-accent to-primary"
            style={{ 
              width: `${progress}%`,
              boxShadow: '0 0 10px hsl(var(--primary) / 0.5), 0 0 20px hsl(var(--primary) / 0.3)'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ 
              duration: 0.15,
              ease: [0.4, 0, 0.2, 1]
            }}
          />
          
          {/* Animated glow dot at the end */}
          <motion.div
            className="absolute top-0 h-full w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{ left: `${Math.max(0, progress - 8)}%` }}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ width: '50%' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RouteProgress;
