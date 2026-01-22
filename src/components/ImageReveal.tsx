/**
 * ImageReveal Component
 * Premium image reveal with Ken Burns effect and mask animations
 */

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  delay?: number;
  duration?: number;
  effect?: 'fade' | 'slideUp' | 'slideLeft' | 'mask' | 'zoom';
  kenBurns?: boolean;
  parallax?: boolean;
  parallaxIntensity?: number;
  aspectRatio?: string;
}

const easings = {
  expo: [0.16, 1, 0.3, 1] as const,
};

const ImageReveal = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  delay = 0,
  duration = 1,
  effect = 'slideUp',
  kenBurns = false,
  parallax = false,
  parallaxIntensity = 0.2,
  aspectRatio = '16/9',
}: ImageRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [`${parallaxIntensity * -100}%`, `${parallaxIntensity * 100}%`]
  );

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  const getEffectStyles = () => {
    switch (effect) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        };
      case 'slideUp':
        return {
          initial: { opacity: 0, y: 60, scale: 1.05 },
          animate: { opacity: 1, y: 0, scale: 1 },
        };
      case 'slideLeft':
        return {
          initial: { opacity: 0, x: 60 },
          animate: { opacity: 1, x: 0 },
        };
      case 'mask':
        return {
          initial: { clipPath: 'inset(100% 0 0 0)' },
          animate: { clipPath: 'inset(0% 0 0 0)' },
        };
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 1.3 },
          animate: { opacity: 1, scale: 1 },
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        };
    }
  };

  const effectStyles = getEffectStyles();

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${containerClassName}`}
      style={{ aspectRatio }}
    >
      <motion.div
        className="relative w-full h-full overflow-hidden"
        initial={effectStyles.initial}
        animate={isInView && imageLoaded ? effectStyles.animate : effectStyles.initial}
        transition={{
          duration,
          delay,
          ease: easings.expo,
        }}
      >
        <motion.img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${className}`}
          style={{
            y: parallax ? parallaxY : 0,
            scale: kenBurns ? scale : 1,
          }}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Optional overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
      </motion.div>
    </motion.div>
  );
};

export default ImageReveal;
