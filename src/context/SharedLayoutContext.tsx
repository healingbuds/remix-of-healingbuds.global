/**
 * Shared Layout Context
 * Manages shared element transitions between pages
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface TransitionElement {
  id: string;
  rect: DOMRect;
  src?: string;
  alt?: string;
}

interface SharedLayoutContextType {
  activeTransition: TransitionElement | null;
  setActiveTransition: (element: TransitionElement | null) => void;
  isTransitioning: boolean;
  startTransition: (element: TransitionElement) => void;
  endTransition: () => void;
}

const SharedLayoutContext = createContext<SharedLayoutContextType | null>(null);

export function SharedLayoutProvider({ children }: { children: ReactNode }) {
  const [activeTransition, setActiveTransition] = useState<TransitionElement | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = useCallback((element: TransitionElement) => {
    setActiveTransition(element);
    setIsTransitioning(true);
  }, []);

  const endTransition = useCallback(() => {
    setIsTransitioning(false);
    // Delay clearing to allow animation to complete
    setTimeout(() => {
      setActiveTransition(null);
    }, 600);
  }, []);

  return (
    <SharedLayoutContext.Provider
      value={{
        activeTransition,
        setActiveTransition,
        isTransitioning,
        startTransition,
        endTransition,
      }}
    >
      {children}
    </SharedLayoutContext.Provider>
  );
}

export function useSharedLayout() {
  const context = useContext(SharedLayoutContext);
  if (!context) {
    throw new Error('useSharedLayout must be used within a SharedLayoutProvider');
  }
  return context;
}
