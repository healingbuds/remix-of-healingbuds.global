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
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-28 md:bottom-24 lg:bottom-28 xl:bottom-32 right-4 md:right-6 lg:right-8 z-50",
            "w-12 h-12 md:w-14 md:h-14 rounded-full",
            "bg-gradient-to-br from-primary via-primary/90 to-primary/70",
            "text-white shadow-xl",
            "flex items-center justify-center",
            "transition-all duration-300 hover:scale-110 active:scale-95",
            "border-2 border-white/30 backdrop-blur-md",
            "hover:border-white/50"
          )}
          whileHover={{ 
            y: -4,
            boxShadow: "0 12px 40px rgba(77, 191, 161, 0.5), 0 0 20px rgba(77, 191, 161, 0.3)"
          }}
          whileTap={{ scale: 0.9 }}
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
