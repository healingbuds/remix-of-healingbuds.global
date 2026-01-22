import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { useCursor } from '@/context/CursorContext';

interface CursorFollowerProps {
  children?: React.ReactNode;
}

const CursorFollower = ({ children }: CursorFollowerProps) => {
  const { cursorEnabled } = useCursor();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMagnetic, setIsMagnetic] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isClicking, setIsClicking] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Smoother spring config for premium feel
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  // Faster follower ring
  const ringSpringConfig = { damping: 25, stiffness: 200, mass: 0.8 };
  const ringXSpring = useSpring(cursorX, ringSpringConfig);
  const ringYSpring = useSpring(cursorY, ringSpringConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  }, [cursorX, cursorY]);
  
  const handleMouseDown = useCallback(() => setIsClicking(true), []);
  const handleMouseUp = useCallback(() => setIsClicking(false), []);

  useEffect(() => {
    // Only show on desktop (no touch support)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;
    
    setIsVisible(true);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Track hover states on interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest('button, a, [data-magnetic], input, textarea, select, [role="button"]');
      const magneticEl = target.closest('[data-magnetic]');
      const linkEl = target.closest('a');
      const buttonEl = target.closest('button');
      
      setIsHovering(!!interactiveEl);
      setIsMagnetic(!!magneticEl);
      
      // Set cursor text based on element type
      if (linkEl && !buttonEl) {
        const href = linkEl.getAttribute('href');
        if (href?.startsWith('http') || href?.startsWith('//')) {
          setCursorText('Visit');
        } else {
          setCursorText('View');
        }
      } else if (buttonEl) {
        const buttonText = buttonEl.textContent?.trim();
        if (buttonText && buttonText.length < 10) {
          setCursorText(null); // Don't show text for short button labels
        } else {
          setCursorText('Click');
        }
      } else {
        setCursorText(null);
      }
    };
    
    const handleMouseOut = () => {
      setIsHovering(false);
      setIsMagnetic(false);
      setCursorText(null);
    };
    
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp]);

  if (!isVisible || !cursorEnabled) return <>{children}</>;

  return (
    <>
      {children}
      
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2 rounded-full bg-white flex items-center justify-center"
          animate={{
            width: isHovering ? (cursorText ? 80 : 56) : 8,
            height: isHovering ? (cursorText ? 80 : 56) : 8,
            opacity: isMagnetic ? 0.8 : 1,
            scale: isClicking ? 0.85 : 1,
          }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            {cursorText && isHovering && (
              <motion.span
                key={cursorText}
                className="text-black text-xs font-medium tracking-wide"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                {cursorText}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      
      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: ringXSpring,
          y: ringYSpring,
        }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/40"
          animate={{
            width: isHovering ? 80 : 40,
            height: isHovering ? 80 : 40,
            opacity: isHovering ? 0.5 : 0.25,
            borderWidth: isClicking ? 3 : 2,
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
    </>
  );
};

export default CursorFollower;
