import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import RegionalRegistrationForm from '@/components/RegionalRegistrationForm';
import { RegionalContentType } from '@/data/regionalContent';

interface LeadGateOverlayProps {
  content: RegionalContentType;
  regionCode: string;
  onSuccess: () => void;
  isVisible: boolean;
}

const LeadGateOverlay = ({ content, regionCode, onSuccess, isVisible }: LeadGateOverlayProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        >
          {/* Backdrop - solid dark with slight transparency */}
          <div className="absolute inset-0 bg-[hsl(178,48%,8%)]/95 backdrop-blur-md" />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Card with solid background for contrast */}
            <div className="relative bg-card border border-border/60 rounded-2xl shadow-2xl shadow-black/50">
              {/* Gradient accent border */}
              <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/40 via-transparent to-secondary/40 rounded-2xl -z-10" />
              
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-border/40">
                <div className="flex items-center justify-between mb-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild 
                    className="text-muted-foreground hover:text-foreground -ml-2"
                  >
                    <Link to="/">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Regions
                    </Link>
                  </Button>
                  
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30">
                    <Lock className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium text-primary">Preview Locked</span>
                  </div>
                </div>
                
                {/* Teaser message */}
                <p className="text-sm text-muted-foreground text-center">
                  Register your interest to unlock the full preview of Healing Buds {content.name}
                </p>
              </div>
              
              {/* Form Content */}
              <div className="p-6">
                <RegionalRegistrationForm 
                  content={content} 
                  regionCode={regionCode}
                  onSuccess={onSuccess}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadGateOverlay;
