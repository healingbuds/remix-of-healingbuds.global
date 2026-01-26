import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ 
            duration: 0.25,
            ease: [0.4, 0, 0.2, 1]
          }}
          onClick={scrollToTop}
          className={cn(
            "fixed z-50 touch-manipulation",
            // Mobile: FAB style positioning with safe area
            "bottom-6 right-4 sm:bottom-8 sm:right-6 md:bottom-28 md:right-8 lg:bottom-32 lg:right-8 xl:bottom-36",
            // Size: larger on mobile for easier tapping
            "w-14 h-14 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full",
            // Styling
            "bg-gradient-to-br from-primary via-primary/90 to-primary/70",
            "text-white",
            "flex items-center justify-center",
            "transition-all duration-200 hover:scale-110 active:scale-90",
            "border-2 border-white/30 backdrop-blur-md",
            "hover:border-white/50",
            // Enhanced shadow for FAB look
            "shadow-lg shadow-primary/30"
          )}
          style={{
            paddingBottom: 'env(safe-area-inset-bottom, 0)',
            boxShadow: '0 4px 14px rgba(77, 191, 161, 0.4), 0 8px 24px rgba(0, 0, 0, 0.15)'
          }}
          whileHover={{ 
            y: -4,
            boxShadow: "0 12px 40px rgba(77, 191, 161, 0.5), 0 0 20px rgba(77, 191, 161, 0.3)"
          }}
          whileTap={{ scale: 0.85 }}
          aria-label="Back to top"
        >
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowUp className="w-6 h-6" strokeWidth={2.5} />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
