import { useState } from 'react';
import { ChevronUp, Globe, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTestRegion, testRegionOptions } from '@/context/TestRegionContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function TestRegionSwitcher() {
  const { selectedRegion, setRegion, clearRegion, isTestMode, currentOption } = useTestRegion();
  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <Button
          size="icon"
          variant="outline"
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 rounded-full bg-background/95 backdrop-blur-sm border-primary/30 hover:border-primary shadow-lg"
        >
          <span className="text-xl">{currentOption.flag}</span>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 z-50"
    >
      <div className="bg-background/95 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border/30">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-primary/20 text-primary px-1.5 py-0.5 rounded">
              DEV
            </span>
            <span className="text-xs font-medium text-foreground/70">Region Tester</span>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsMinimized(true)}
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-3 space-y-3">
          {/* Current Selection */}
          <AnimatePresence mode="wait">
            {isTestMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between gap-2 px-2 py-1.5 bg-primary/10 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{currentOption.flag}</span>
                  <span className="text-sm font-medium text-primary">{currentOption.label}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearRegion}
                  className="h-6 text-xs text-muted-foreground hover:text-foreground"
                >
                  Reset
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Region Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between border-border/50 hover:border-primary/50"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span>Select Region</span>
                </div>
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {testRegionOptions.map((option) => (
                <DropdownMenuItem
                  key={option.code}
                  onClick={() => setRegion(option.code)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{option.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{option.label}</span>
                      {option.status === 'coming' && (
                        <span className="text-[10px] text-muted-foreground">Coming Soon</span>
                      )}
                    </div>
                  </div>
                  {selectedRegion === option.code && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={clearRegion}
                className="text-muted-foreground cursor-pointer"
              >
                <Globe className="w-4 h-4 mr-2" />
                Reset to Global
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status */}
          <p className="text-[10px] text-muted-foreground text-center">
            Testing region landing pages
          </p>
        </div>
      </div>
    </motion.div>
  );
}
