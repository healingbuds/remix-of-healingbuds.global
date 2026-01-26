/**
 * Pull-to-Refresh Component
 * Visual indicator for pull-to-refresh gesture
 */

import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Leaf } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { ReactNode, useCallback } from 'react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh?: () => Promise<void>;
  disabled?: boolean;
}

const PullToRefresh = ({ 
  children, 
  onRefresh,
  disabled = false 
}: PullToRefreshProps) => {
  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      await onRefresh();
    } else {
      // Default: reload the page data
      window.location.reload();
    }
  }, [onRefresh]);

  const { isPulling, isRefreshing, pullDistance, pullProgress } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80,
    maxPull: 120,
    disabled,
  });

  const showIndicator = pullDistance > 10 || isRefreshing;

  return (
    <div className="relative">
      {/* Pull indicator */}
      <AnimatePresence>
        {showIndicator && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ 
              opacity: 1, 
              y: Math.min(pullDistance - 40, 40),
            }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30 
            }}
            className="fixed top-0 left-0 right-0 z-[9999] flex justify-center pointer-events-none"
            style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
          >
            <motion.div
              className="flex items-center justify-center w-12 h-12 rounded-full bg-primary shadow-xl shadow-primary/30"
              animate={{
                scale: isRefreshing ? [1, 1.1, 1] : 0.8 + pullProgress * 0.4,
                rotate: isRefreshing ? 360 : pullProgress * 180,
              }}
              transition={{
                scale: isRefreshing ? { 
                  duration: 0.6, 
                  repeat: Infinity, 
                  ease: 'easeInOut' 
                } : { duration: 0.1 },
                rotate: isRefreshing ? { 
                  duration: 1, 
                  repeat: Infinity, 
                  ease: 'linear' 
                } : { duration: 0.1 },
              }}
            >
              {isRefreshing ? (
                <RefreshCw className="w-5 h-5 text-white" />
              ) : (
                <Leaf className="w-5 h-5 text-white" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content with pull transform */}
      <motion.div
        animate={{
          y: isPulling || isRefreshing ? pullDistance * 0.3 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 40,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PullToRefresh;
