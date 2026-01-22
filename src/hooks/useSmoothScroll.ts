/**
 * Hook to access Lenis smooth scroll instance and utilities
 */

import { useEffect, useState, useCallback } from 'react';

interface ScrollState {
  scroll: number;
  progress: number;
}

export const useSmoothScroll = () => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scroll: 0,
    progress: 0,
  });

  useEffect(() => {
    const handleLenisScroll = (event: CustomEvent<ScrollState>) => {
      setScrollState(event.detail);
    };

    window.addEventListener('lenis-scroll', handleLenisScroll as EventListener);
    
    return () => {
      window.removeEventListener('lenis-scroll', handleLenisScroll as EventListener);
    };
  }, []);

  const scrollTo = useCallback((target: string | number | HTMLElement, options?: {
    offset?: number;
    duration?: number;
    immediate?: boolean;
  }) => {
    // Dispatch scroll request to Lenis
    window.dispatchEvent(new CustomEvent('lenis-scroll-to', {
      detail: { target, options },
    }));
  }, []);

  return {
    ...scrollState,
    scrollTo,
  };
};
