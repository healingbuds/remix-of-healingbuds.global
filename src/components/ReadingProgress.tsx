/**
 * Reading Progress Bar
 * Shows scroll progress through article content with elegant animation
 */

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState, RefObject } from 'react';

interface ReadingProgressProps {
  containerRef?: RefObject<HTMLElement>;
  className?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'gradient' | 'white';
}

const ReadingProgress = ({ 
  containerRef,
  className = '',
  showPercentage = false,
  color = 'gradient',
}: ReadingProgressProps) => {
  const [mounted, setMounted] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  });

  const percentage = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    const unsubscribe = percentage.on('change', (latest) => {
      setDisplayPercentage(Math.round(latest));
    });

    return () => unsubscribe();
  }, [percentage]);

  if (!mounted) return null;

  const colorClasses = {
    primary: 'bg-primary',
    gradient: 'bg-gradient-to-r from-primary via-primary/80 to-primary/60',
    white: 'bg-white',
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-[101] ${className}`}>
      {/* Track */}
      <div className="h-[3px] bg-muted/20 backdrop-blur-sm">
        {/* Progress */}
        <motion.div
          className={`h-full origin-left ${colorClasses[color]}`}
          style={{ scaleX }}
        />
      </div>
      
      {/* Optional percentage indicator */}
      {showPercentage && (
        <motion.div
          className="absolute right-4 top-3 text-xs font-medium text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: displayPercentage > 0 ? 1 : 0, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {displayPercentage}%
        </motion.div>
      )}
    </div>
  );
};

export default ReadingProgress;
