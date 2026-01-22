/**
 * TextReveal Component
 * Premium text reveal with mask/clip animation for headings
 */

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

const easings = {
  expo: [0.16, 1, 0.3, 1] as const,
  smooth: [0.22, 1, 0.36, 1] as const,
};

const TextReveal = ({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  once = true,
  direction = 'up',
  as: Component = 'div',
}: TextRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  const getTransform = () => {
    switch (direction) {
      case 'up': return { y: '100%' };
      case 'down': return { y: '-100%' };
      case 'left': return { x: '100%' };
      case 'right': return { x: '-100%' };
    }
  };

  const wrapperVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05, delayChildren: delay },
    },
  };

  const lineVariants: Variants = {
    hidden: { 
      ...getTransform(),
      opacity: 0,
    },
    visible: { 
      y: 0, 
      x: 0,
      opacity: 1,
      transition: {
        duration,
        ease: easings.expo,
      },
    },
  };

  const MotionComponent = motion[Component] as typeof motion.div;

  return (
    <MotionComponent
      ref={ref}
      className={`overflow-hidden ${className}`}
      variants={wrapperVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <motion.span
        className="block"
        variants={lineVariants}
        style={{ willChange: 'transform, opacity' }}
      >
        {children}
      </motion.span>
    </MotionComponent>
  );
};

export default TextReveal;
