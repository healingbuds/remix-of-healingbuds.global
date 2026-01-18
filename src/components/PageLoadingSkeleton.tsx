import { motion } from 'framer-motion';
import { Skeleton } from './ui/skeleton';

interface PageLoadingSkeletonProps {
  variant?: 'default' | 'hero' | 'cards' | 'article' | 'clinic' | 'research' | 'franchise';
}

// Shimmer animation class for premium loading effect
const shimmerClass = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";

const PageLoadingSkeleton = ({ variant = 'default' }: PageLoadingSkeletonProps) => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { 
      opacity: 1, 
      y: 0,
    },
  };

  if (variant === 'hero') {
    return (
      <motion.div
        className="min-h-screen bg-background"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Header skeleton */}
        <motion.div variants={itemVariants} className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Skeleton className={`h-10 w-32 rounded-xl ${shimmerClass}`} />
            <div className="hidden md:flex items-center gap-4">
              <Skeleton className={`h-8 w-20 rounded-lg ${shimmerClass}`} />
              <Skeleton className={`h-8 w-20 rounded-lg ${shimmerClass}`} />
              <Skeleton className={`h-8 w-20 rounded-lg ${shimmerClass}`} />
            </div>
            <Skeleton className={`h-10 w-10 rounded-xl md:hidden ${shimmerClass}`} />
          </div>
        </motion.div>

        {/* Breadcrumb skeleton */}
        <motion.div variants={itemVariants} className="pt-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <Skeleton className={`h-4 w-12 rounded ${shimmerClass}`} />
              <Skeleton className={`h-4 w-2 rounded ${shimmerClass}`} />
              <Skeleton className={`h-4 w-20 rounded ${shimmerClass}`} />
            </div>
          </div>
        </motion.div>

        {/* Hero skeleton */}
        <motion.div variants={itemVariants} className="pt-8 px-4">
          <div className="max-w-5xl mx-auto space-y-6">
            <Skeleton className={`h-14 sm:h-16 w-3/4 rounded-2xl ${shimmerClass}`} />
            <Skeleton className={`h-14 sm:h-16 w-1/2 rounded-2xl ${shimmerClass}`} />
            <Skeleton className={`h-5 w-2/3 mt-6 rounded-lg ${shimmerClass}`} />
          </div>
        </motion.div>

        {/* Content skeleton */}
        <motion.div variants={itemVariants} className="mt-24 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className={`h-56 rounded-2xl ${shimmerClass}`} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (variant === 'cards') {
    return (
      <motion.div
        className="min-h-screen bg-background pt-32 px-6"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Breadcrumb */}
        <motion.div variants={itemVariants} className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-2">
            <Skeleton className={`h-4 w-12 rounded ${shimmerClass}`} />
            <Skeleton className={`h-4 w-2 rounded ${shimmerClass}`} />
            <Skeleton className={`h-4 w-24 rounded ${shimmerClass}`} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div variants={itemVariants} className="max-w-7xl mx-auto mb-12">
          <Skeleton className={`h-12 w-64 rounded-xl ${shimmerClass}`} />
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <motion.div key={i} variants={itemVariants}>
              <div className="bg-card rounded-2xl overflow-hidden border border-border/50">
                <Skeleton className={`h-48 w-full ${shimmerClass}`} />
                <div className="p-6 space-y-3">
                  <Skeleton className={`h-6 w-3/4 rounded-lg ${shimmerClass}`} />
                  <Skeleton className={`h-4 w-full rounded-lg ${shimmerClass}`} />
                  <Skeleton className={`h-4 w-2/3 rounded-lg ${shimmerClass}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (variant === 'article') {
    return (
      <motion.div
        className="min-h-screen bg-background pt-32"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-2">
              <Skeleton className={`h-4 w-12 rounded ${shimmerClass}`} />
              <Skeleton className={`h-4 w-2 rounded ${shimmerClass}`} />
              <Skeleton className={`h-4 w-20 rounded ${shimmerClass}`} />
              <Skeleton className={`h-4 w-2 rounded ${shimmerClass}`} />
              <Skeleton className={`h-4 w-32 rounded ${shimmerClass}`} />
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div variants={itemVariants} className="flex gap-2 mb-4">
            <Skeleton className={`h-6 w-16 rounded-full ${shimmerClass}`} />
            <Skeleton className={`h-6 w-20 rounded-full ${shimmerClass}`} />
          </motion.div>

          {/* Title */}
          <motion.div variants={itemVariants}>
            <Skeleton className={`h-12 w-full rounded-xl mb-2 ${shimmerClass}`} />
            <Skeleton className={`h-12 w-3/4 rounded-xl mb-8 ${shimmerClass}`} />
          </motion.div>

          {/* Hero image */}
          <motion.div variants={itemVariants}>
            <Skeleton className={`h-80 w-full rounded-2xl mb-8 ${shimmerClass}`} />
          </motion.div>
          
          {/* Content paragraphs */}
          <motion.div variants={itemVariants} className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className={`h-4 w-full rounded-lg ${shimmerClass}`} />
            ))}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'clinic' || variant === 'research') {
    return (
      <motion.div
        className="min-h-screen bg-background"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Skeleton className={`h-10 w-32 rounded-xl ${shimmerClass}`} />
            <div className="hidden md:flex items-center gap-4">
              <Skeleton className={`h-8 w-20 rounded-lg ${shimmerClass}`} />
              <Skeleton className={`h-8 w-20 rounded-lg ${shimmerClass}`} />
            </div>
          </div>
        </motion.div>

        {/* Hero with overlay style */}
        <motion.div variants={itemVariants} className="relative h-[400px]">
          <Skeleton className={`absolute inset-0 ${shimmerClass}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <Skeleton className={`h-12 w-2/3 rounded-xl mb-4 ${shimmerClass}`} />
            <Skeleton className={`h-5 w-1/2 rounded-lg ${shimmerClass}`} />
          </div>
        </motion.div>

        {/* Content grid */}
        <motion.div variants={itemVariants} className="px-4 py-16">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <Skeleton className={`h-64 rounded-2xl ${shimmerClass}`} />
            <div className="space-y-4">
              <Skeleton className={`h-8 w-3/4 rounded-xl ${shimmerClass}`} />
              <Skeleton className={`h-4 w-full rounded-lg ${shimmerClass}`} />
              <Skeleton className={`h-4 w-full rounded-lg ${shimmerClass}`} />
              <Skeleton className={`h-4 w-2/3 rounded-lg ${shimmerClass}`} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (variant === 'franchise') {
    return (
      <motion.div
        className="min-h-screen bg-background pt-32 px-4"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-2">
              <Skeleton className={`h-4 w-12 rounded ${shimmerClass}`} />
              <Skeleton className={`h-4 w-2 rounded ${shimmerClass}`} />
              <Skeleton className={`h-4 w-32 rounded ${shimmerClass}`} />
            </div>
          </motion.div>

          {/* Hero */}
          <motion.div variants={itemVariants} className="mb-16">
            <Skeleton className={`h-6 w-24 rounded-full mb-6 ${shimmerClass}`} />
            <Skeleton className={`h-16 w-3/4 rounded-2xl mb-4 ${shimmerClass}`} />
            <Skeleton className={`h-6 w-1/2 rounded-lg ${shimmerClass}`} />
          </motion.div>

          {/* Two column layout */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-16">
            <div className="space-y-6">
              <Skeleton className={`h-10 w-3/4 rounded-xl ${shimmerClass}`} />
              <Skeleton className={`h-4 w-full rounded-lg ${shimmerClass}`} />
              <Skeleton className={`h-4 w-full rounded-lg ${shimmerClass}`} />
              <Skeleton className={`h-4 w-2/3 rounded-lg ${shimmerClass}`} />
            </div>
            <div className="bg-card rounded-2xl p-8 border border-border/50">
              <Skeleton className={`h-8 w-1/2 rounded-xl mb-6 ${shimmerClass}`} />
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className={`h-12 w-full rounded-lg ${shimmerClass}`} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Default skeleton
  return (
    <motion.div
      className="min-h-screen bg-background pt-32 px-6"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-2">
            <Skeleton className={`h-4 w-12 rounded ${shimmerClass}`} />
            <Skeleton className={`h-4 w-2 rounded ${shimmerClass}`} />
            <Skeleton className={`h-4 w-24 rounded ${shimmerClass}`} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-8">
          <Skeleton className={`h-12 w-1/3 rounded-xl ${shimmerClass}`} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className={`h-40 rounded-2xl ${shimmerClass}`} />
            <Skeleton className={`h-40 rounded-2xl ${shimmerClass}`} />
          </div>
          <Skeleton className={`h-64 rounded-2xl ${shimmerClass}`} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PageLoadingSkeleton;
