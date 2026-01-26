import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, MapPin, Globe2, Sparkles, Factory, Crown, Clock, Keyboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import PremiumLeafletMap from '@/components/PremiumLeafletMap';
import RegionSlidePanel from '@/components/RegionSlidePanel';
import MapAmbientParticles from '@/components/MapAmbientParticles';
import MapCornerDecorations from '@/components/MapCornerDecorations';
import ThemeToggle from '@/components/ThemeToggle';
import useMapKeyboardNavigation from '@/hooks/useMapKeyboardNavigation';
import hbLogoWhite from '@/assets/hb-logo-white-new.png';
import hbLogoGreen from '@/assets/hb-logo-green-full.png';
import drGreenLogo from '@/assets/drgreen-logo-white.png';
import { countryKeyToRegionCode, RegionCode, detectRegionFromDomain } from '@/lib/domainDetection';

const countryDisplayInfo: Record<string, { name: string; status: 'LIVE' | 'HQ' | 'PRODUCTION' | 'NEXT'; flag: string }> = {
  southAfrica: { name: 'South Africa', status: 'LIVE', flag: '🇿🇦' },
  portugal: { name: 'Portugal', status: 'HQ', flag: '🇵🇹' },
  thailand: { name: 'Thailand', status: 'PRODUCTION', flag: '🇹🇭' },
  uk: { name: 'United Kingdom', status: 'NEXT', flag: '🇬🇧' },
};

// Region array for keyboard navigation (ordered for arrow key traversal)
const regionKeys = ['southAfrica', 'portugal', 'thailand', 'uk'] as const;
const regionsForNav = regionKeys.map(key => ({ 
  key, 
  name: countryDisplayInfo[key].name 
}));

const statusConfig = {
  LIVE: { label: 'Live', color: 'bg-emerald-500', textColor: 'text-emerald-400', icon: 'pulse' },
  HQ: { label: 'Headquarters', color: 'bg-purple-500', textColor: 'text-purple-400', icon: 'crown' },
  PRODUCTION: { label: 'Production', color: 'bg-sky-500', textColor: 'text-sky-400', icon: 'factory' },
  NEXT: { label: 'Coming Soon', color: 'bg-amber-500', textColor: 'text-amber-400', icon: 'clock' },
};

export default function GlobalMapHub() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedRegionCode, setSelectedRegionCode] = useState<RegionCode | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [showKeyboardHint, setShowKeyboardHint] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  useEffect(() => {
    const detectedRegion = detectRegionFromDomain();
    if (detectedRegion !== 'global') {
      console.log('Detected region:', detectedRegion);
    }
    // Delay showing map for smooth entrance
    const timer = setTimeout(() => setMapReady(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  const handleCountrySelect = useCallback((countryKey: string) => {
    setSelectedCountry(countryKey);
    
    const regionCode = countryKeyToRegionCode[countryKey];
    if (regionCode) {
      setSelectedRegionCode(regionCode);
      setIsPanelOpen(true);
      setShowWelcome(false);
    }
  }, []);
  
  const handlePanelClose = useCallback(() => {
    setIsPanelOpen(false);
  }, []);
  
  const handleExploreMap = useCallback(() => {
    setShowWelcome(false);
    // Show keyboard hint briefly after welcome dismissal
    setShowKeyboardHint(true);
    setTimeout(() => setShowKeyboardHint(false), 5000);
  }, []);
  
  // Initialize keyboard navigation
  useMapKeyboardNavigation({
    regions: regionsForNav,
    selectedCountry,
    onCountrySelect: handleCountrySelect,
    isPanelOpen,
    onPanelClose: handlePanelClose,
    isEnabled: !showWelcome,
  });
  
  const selectedCountryInfo = selectedCountry ? countryDisplayInfo[selectedCountry] : null;
  
  // Theme-aware colors
  const bgColor = isDark ? 'hsl(178, 48%, 6%)' : 'hsl(155, 12%, 97%)';
  const vignetteGradient = isDark 
    ? 'radial-gradient(ellipse at center, transparent 40%, hsl(178 48% 4% / 0.6) 100%)'
    : 'radial-gradient(ellipse at center, transparent 50%, hsl(178 48% 20% / 0.08) 100%)';
  const headerBg = isDark ? 'bg-black/30' : 'bg-white/70';
  const headerBorder = isDark ? 'border-white/10' : 'border-black/10';
  const bottomGradient = isDark 
    ? `linear-gradient(to top, ${bgColor}, ${bgColor}cc, transparent)`
    : `linear-gradient(to top, ${bgColor}, ${bgColor}ee, transparent)`;
  
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: bgColor }}>
      {/* Full-screen Premium Leaflet Map */}
      <div className="absolute inset-0 z-0">
        {mapReady && (
          <PremiumLeafletMap 
            selectedCountry={selectedCountry}
            onCountrySelect={handleCountrySelect}
          />
        )}
      </div>
      
      {/* Ambient floating particles */}
      <MapAmbientParticles particleCount={35} className="z-[3]" />
      
      {/* Corner botanical decorations */}
      <MapCornerDecorations className="z-[4]" />
      
      {/* Subtle vignette for depth */}
      <div className="absolute inset-0 pointer-events-none z-[5]" 
        style={{ background: vignetteGradient }} 
      />
      
      {/* Floating Header - Glassmorphism */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute top-0 left-0 right-0 z-30"
      >
        <div className="mx-4 mt-4 md:mx-6 md:mt-6">
          <div className={`flex items-center justify-between px-4 py-3 md:px-6 md:py-4 rounded-2xl ${headerBg} backdrop-blur-xl border ${headerBorder} shadow-2xl`}>
            {/* Logo */}
            <Link to="/home" className="flex items-center group">
              <img 
                src={isDark ? hbLogoWhite : hbLogoGreen} 
                alt="Healing Buds" 
                className="h-6 md:h-8 object-contain opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            
            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              <ThemeToggle variant="icon" className="mr-1" />
              <Button 
                variant="ghost" 
                size="sm"
                className={`hidden sm:flex ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-foreground/70 hover:text-foreground hover:bg-black/5'} text-sm`}
                asChild
              >
                <Link to="/home">
                  Enter Site
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Welcome Overlay */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-20 flex items-center justify-center"
          >
            {/* Backdrop blur for welcome */}
            <div 
              className="absolute inset-0 backdrop-blur-sm" 
              style={{ backgroundColor: isDark ? 'hsla(178, 48%, 6%, 0.6)' : 'hsla(155, 12%, 97%, 0.7)' }}
            />
            
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.98 }}
              transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
              className="relative z-10 text-center max-w-lg mx-auto px-6"
            >
              {/* Animated icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5, type: 'spring', stiffness: 200 }}
                className="mb-6 relative"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/10 animate-pulse" />
                </div>
                <Globe2 className="w-16 h-16 md:w-20 md:h-20 mx-auto text-primary relative z-10" strokeWidth={1} />
              </motion.div>
              
              <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-foreground'} mb-3 tracking-tight`}>
                Global Healthcare Network
              </h1>
              <p className={`text-base md:text-lg ${isDark ? 'text-white/60' : 'text-muted-foreground'} mb-8 max-w-sm mx-auto leading-relaxed`}>
                Explore our worldwide medical cannabis services. Select a region to begin.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/25 font-medium"
                  onClick={handleExploreMap}
                >
                  <MapPin className="mr-2 w-4 h-4" />
                  Explore Map
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className={isDark ? 'border-white/20 text-white hover:bg-white/10 hover:border-white/30' : 'border-black/20 text-foreground hover:bg-black/5 hover:border-black/30'}
                  asChild
                >
                  <Link to="/home">
                    Continue to Site
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bottom Region Selector */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
      >
        {/* Gradient fade */}
        <div className="h-32" style={{ background: bottomGradient }} />
        
        <div className="px-4 pb-4 md:px-6 md:pb-6 pointer-events-auto" style={{ backgroundColor: bgColor }}>
          {/* Region Pills */}
          <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap mb-4">
            {Object.entries(countryDisplayInfo).map(([key, info]) => {
              const isSelected = selectedCountry === key;
              const status = statusConfig[info.status];
              
              return (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCountrySelect(key)}
                  className={`
                    relative px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                    flex items-center gap-2
                    ${isSelected 
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-2 ring-primary/50' 
                      : isDark 
                        ? 'bg-white/[0.08] text-white/80 hover:bg-white/[0.12] hover:text-white border border-white/10'
                        : 'bg-black/[0.06] text-foreground/80 hover:bg-black/[0.10] hover:text-foreground border border-black/10'
                    }
                  `}
                >
                  <span className="text-base">{info.flag}</span>
                  <span className="hidden sm:inline">{info.name}</span>
                  <span className="sm:hidden">{info.name.split(' ')[0]}</span>
                  
                  {info.status === 'LIVE' && (
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  )}
                  {info.status !== 'LIVE' && (
                    <span className={`text-[10px] uppercase tracking-wider ${status.textColor} opacity-80`}>
                      {status.label}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
          
          {/* Powered by Dr. Green */}
          <div className="flex items-center justify-center gap-2">
            <span className={`${isDark ? 'text-white/30' : 'text-foreground/40'} text-xs`}>Powered by</span>
            <img 
              src={drGreenLogo} 
              alt="Dr. Green" 
              className={`h-5 w-auto object-contain ${isDark ? 'opacity-50' : 'opacity-60 brightness-0'}`}
            />
          </div>
        </div>
      </motion.div>
      
      {/* Map Legend - Floating */}
      <AnimatePresence>
        {!showWelcome && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 hidden md:block"
          >
            <div className={`${isDark ? 'bg-black/40' : 'bg-white/80'} backdrop-blur-xl rounded-xl border ${isDark ? 'border-white/10' : 'border-black/10'} p-3 space-y-2.5 shadow-lg`}>
              <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-white/50' : 'text-foreground/50'} uppercase tracking-wider font-medium mb-2`}>
                <Sparkles className="w-3 h-3" />
                Legend
              </div>
              {Object.entries(statusConfig).map(([status, config]) => (
                <div key={status} className="flex items-center gap-2.5">
                  <div className="relative flex items-center justify-center w-4 h-4">
                    {config.icon === 'pulse' && (
                      <>
                        <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-75" />
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.color}`} />
                      </>
                    )}
                    {config.icon === 'crown' && <Crown className="w-3.5 h-3.5 text-purple-400" />}
                    {config.icon === 'factory' && <Factory className="w-3.5 h-3.5 text-sky-400" />}
                    {config.icon === 'clock' && <Clock className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <span className={`text-xs ${isDark ? 'text-white/70' : 'text-foreground/70'}`}>{config.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Keyboard Navigation Hint */}
      <AnimatePresence>
        {showKeyboardHint && !isPanelOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 hidden md:block"
          >
            <div className={`${isDark ? 'bg-black/60' : 'bg-white/90'} backdrop-blur-xl rounded-xl border ${isDark ? 'border-white/10' : 'border-black/10'} p-3 shadow-lg max-w-[180px]`}>
              <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-white/60' : 'text-foreground/60'} font-medium mb-2`}>
                <Keyboard className="w-3.5 h-3.5" />
                Keyboard Nav
              </div>
              <div className={`text-[11px] space-y-1.5 ${isDark ? 'text-white/50' : 'text-foreground/50'}`}>
                <div className="flex items-center gap-2">
                  <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>←</kbd>
                  <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>→</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>Enter</kbd>
                  <span>Open panel</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>Esc</kbd>
                  <span>Close panel</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Region Slide Panel */}
      <RegionSlidePanel
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
        regionCode={selectedRegionCode}
        countryName={selectedCountryInfo?.name}
        countryStatus={selectedCountryInfo?.status}
      />
    </div>
  );
}
