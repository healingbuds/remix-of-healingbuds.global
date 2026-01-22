/**
 * SplitText Component
 * Animates text character-by-character or word-by-word for cinematic reveals
 */

import { motion, Variants, useInView } from 'framer-motion';
import { useRef, useMemo } from 'react';

type SplitType = 'chars' | 'words' | 'lines';

interface SplitTextProps {
  children: string;
  type?: SplitType;
  className?: string;
  charClassName?: string;
  delay?: number;
  staggerDelay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  animation?: 'fadeUp' | 'fadeIn' | 'slideUp' | 'blur' | 'scale' | 'rotate';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

const easings = {
  smooth: [0.22, 1, 0.36, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
  expo: [0.16, 1, 0.3, 1] as const,
};

const getAnimationVariants = (animation: string, index: number): Variants => {
  const baseTransition = {
    duration: 0.6,
    ease: easings.expo,
  };

  switch (animation) {
    case 'fadeUp':
      return {
        hidden: { 
          opacity: 0, 
          y: 40,
          rotateX: -20,
        },
        visible: { 
          opacity: 1, 
          y: 0,
          rotateX: 0,
          transition: baseTransition,
        },
      };
    case 'fadeIn':
      return {
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { duration: 0.4, ease: easings.smooth },
        },
      };
    case 'slideUp':
      return {
        hidden: { 
          opacity: 0, 
          y: '100%',
        },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: baseTransition,
        },
      };
    case 'blur':
      return {
        hidden: { 
          opacity: 0, 
          filter: 'blur(10px)',
          y: 20,
        },
        visible: { 
          opacity: 1, 
          filter: 'blur(0px)',
          y: 0,
          transition: { ...baseTransition, duration: 0.8 },
        },
      };
    case 'scale':
      return {
        hidden: { 
          opacity: 0, 
          scale: 0.5,
        },
        visible: { 
          opacity: 1, 
          scale: 1,
          transition: { ...baseTransition, ease: easings.spring },
        },
      };
    case 'rotate':
      return {
        hidden: { 
          opacity: 0, 
          rotateY: 90,
          y: 20,
        },
        visible: { 
          opacity: 1, 
          rotateY: 0,
          y: 0,
          transition: baseTransition,
        },
      };
    default:
      return {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: baseTransition },
      };
  }
};

const SplitText = ({
  children,
  type = 'chars',
  className = '',
  charClassName = '',
  delay = 0,
  staggerDelay = 0.02,
  duration = 0.6,
  once = true,
  threshold = 0.3,
  animation = 'fadeUp',
  as: Component = 'div',
}: SplitTextProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const elements = useMemo(() => {
    if (type === 'chars') {
      return children.split('').map((char, i) => ({
        content: char === ' ' ? '\u00A0' : char,
        key: `char-${i}`,
      }));
    } else if (type === 'words') {
      return children.split(' ').map((word, i) => ({
        content: word,
        key: `word-${i}`,
      }));
    } else {
      // lines - split by newline or treat as single line
      return children.split('\n').filter(Boolean).map((line, i) => ({
        content: line,
        key: `line-${i}`,
      }));
    }
  }, [children, type]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const MotionComponent = motion[Component] as typeof motion.div;

  return (
    <MotionComponent
      ref={ref}
      className={`${className} ${type === 'chars' ? 'inline-flex flex-wrap' : ''}`}
      style={{ perspective: 1000 }}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {elements.map((element, index) => (
        <motion.span
          key={element.key}
          className={`inline-block ${charClassName} ${type === 'words' ? 'mr-[0.25em]' : ''}`}
          style={{ 
            transformStyle: 'preserve-3d',
            willChange: 'transform, opacity',
          }}
          variants={getAnimationVariants(animation, index)}
        >
          {element.content}
        </motion.span>
      ))}
    </MotionComponent>
  );
};

export default SplitText;
