import { motion, TargetAndTransition } from "framer-motion";
import { ReactNode, useMemo } from "react";

interface ScrollAnimationProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scale" | "fade" | "slideUp" | "slideIn" | "reveal" | "blur" | "stagger";
  duration?: number;
  distance?: number;
  once?: boolean;
  threshold?: number;
}

interface AnimationVariant {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
}

// Premium easing curves
const easings = {
  smooth: [0.4, 0, 0.2, 1] as const,
  spring: [0.22, 1, 0.36, 1] as const,
  gentle: [0.25, 0.4, 0.25, 1] as const,
  snappy: [0.16, 1, 0.3, 1] as const,
};

const createVariants = (distance: number): Record<string, AnimationVariant> => ({
  fadeUp: {
    initial: { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 }
  },
  fadeDown: {
    initial: { opacity: 0, y: -distance },
    animate: { opacity: 1, y: 0 }
  },
  fadeLeft: {
    initial: { opacity: 0, x: -distance },
    animate: { opacity: 1, x: 0 }
  },
  fadeRight: {
    initial: { opacity: 0, x: distance },
    animate: { opacity: 1, x: 0 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  },
  slideUp: {
    initial: { opacity: 0, y: distance * 1.2, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 }
  },
  slideIn: {
    initial: { opacity: 0, x: distance, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1 }
  },
  reveal: {
    initial: { opacity: 0, y: distance * 0.8 },
    animate: { opacity: 1, y: 0 }
  },
  blur: {
    initial: { opacity: 0, y: distance * 0.5, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" }
  },
  stagger: {
    initial: { opacity: 0, y: distance * 0.6 },
    animate: { opacity: 1, y: 0 }
  }
});

const ScrollAnimation = ({ 
  children, 
  delay = 0, 
  className = "", 
  variant = "fadeUp",
  duration = 0.7,
  distance = 40,
  once = true,
  threshold = 0.15
}: ScrollAnimationProps) => {
  const variants = useMemo(() => createVariants(distance), [distance]);
  const selectedVariant = variants[variant];

  // Select appropriate easing based on variant
  const getEasing = (): readonly [number, number, number, number] => {
    switch (variant) {
      case 'slideUp':
      case 'slideIn':
        return easings.spring;
      case 'reveal':
        return easings.snappy;
      case 'blur':
        return easings.gentle;
      case 'scale':
        return easings.spring;
      default:
        return easings.smooth;
    }
  };
  
  return (
    <motion.div
      initial={selectedVariant.initial}
      whileInView={selectedVariant.animate}
      viewport={{ once, amount: threshold }}
      transition={{ 
        duration, 
        delay, 
        ease: getEasing(),
        opacity: { duration: duration * 0.7, ease: easings.gentle },
        scale: { duration: duration * 1.1, ease: easings.spring },
        filter: { duration: duration * 0.8 }
      }}
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation;
