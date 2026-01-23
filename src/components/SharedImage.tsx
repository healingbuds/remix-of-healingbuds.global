/**
 * Shared Image Component
 * Enables seamless image transitions between list and detail views
 */

import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSharedLayout } from '@/context/SharedLayoutContext';

interface SharedImageProps {
  src: string;
  alt: string;
  layoutId: string;
  to?: string;
  className?: string;
  containerClassName?: string;
  onClick?: () => void;
}

const SharedImage = ({
  src,
  alt,
  layoutId,
  to,
  className = '',
  containerClassName = '',
  onClick,
}: SharedImageProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const navigate = useNavigate();
  const { startTransition } = useSharedLayout();

  const handleClick = useCallback(() => {
    if (imageRef.current && to) {
      const rect = imageRef.current.getBoundingClientRect();
      startTransition({
        id: layoutId,
        rect,
        src,
        alt,
      });
      
      // Small delay for animation to start
      setTimeout(() => {
        navigate(to);
      }, 50);
    }
    onClick?.();
  }, [layoutId, to, src, alt, startTransition, navigate, onClick]);

  return (
    <motion.div
      className={containerClassName}
      layoutId={layoutId}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 1,
      }}
    >
      <motion.img
        ref={imageRef}
        src={src}
        alt={alt}
        className={className}
        onClick={to ? handleClick : onClick}
        style={{ cursor: to ? 'pointer' : 'default' }}
        whileHover={{ scale: to ? 1.02 : 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default SharedImage;
