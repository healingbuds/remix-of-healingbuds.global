import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Building2, ChevronRight, MapPin, Globe2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PremiumLeafletMap from '@/components/PremiumLeafletMap';
import PremiumGlobeIcon from '@/components/PremiumGlobeIcon';
import RegionSlidePanel from '@/components/RegionSlidePanel';
import MapAmbientParticles from '@/components/MapAmbientParticles';
import MapCornerDecorations from '@/components/MapCornerDecorations';
import hbLogoWhite from '@/assets/hb-logo-white-new.png';
import drGreenLogo from '@/assets/drgreen-logo-white.png';
import { countryKeyToRegionCode, RegionCode, detectRegionFromDomain } from '@/lib/domainDetection';

const countryDisplayInfo: Record<string, { name: string; status: 'LIVE' | 'NEXT' | 'UPCOMING'; flag: string }> = {
  southAfrica: { name: 'South Africa', status: 'LIVE', flag: '🇿🇦' },
  thailand: { name: 'Thailand', status: 'LIVE', flag: '🇹🇭' },
  uk: { name: 'United Kingdom', status: 'NEXT', flag: '🇬🇧' },
  portugal: { name: 'Portugal', status: 'UPCOMING', flag: '🇵🇹' },
};

const statusConfig = {
  LIVE: { label: 'Live', color: 'bg-emerald-500', textColor: 'text-emerald-400' },
  NEXT: { label: 'Coming Soon', color: 'bg-amber-500', textColor: 'text-amber-400' },
  UPCOMING: { label: 'Upcoming', color: 'bg-slate-500', textColor: 'text-slate-400' },
};

export default function GlobalMapHub() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedRegionCode, setSelectedRegionCode] = useState<RegionCode | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  
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
  }, []);
  
  const selectedCountryInfo = selectedCountry ? countryDisplayInfo[selectedCountry] : null;
  
  return (
    <div className="fixed inset-0 bg-[hsl(178,48%,6%)] overflow-hidden">
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
        style={{ 
          background: 'radial-gradient(ellipse at center, transparent 40%, hsl(178 48% 4% / 0.6) 100%)' 
        }} 
      />
      
      {/* Floating Header - Glassmorphism */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute top-0 left-0 right-0 z-30"
      >
        <div className="mx-4 mt-4 md:mx-6 md:mt-6">
          <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl">
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-2 md:gap-3 group">
              <PremiumGlobeIcon size="sm" animate />
              <img 
                src={hbLogoWhite} 
                alt="Healing Buds" 
                className="h-6 md:h-8 object-contain opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            
            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                className="hidden sm:flex text-white/70 hover:text-white hover:bg-white/10 text-sm"
                asChild
              >
                <Link to="/home">
                  Enter Site
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </Button>
              <Button 
                size="sm"
                className="bg-primary/90 text-primary-foreground hover:bg-primary shadow-lg shadow-primary/20"
                asChild
              >
                <Link to="/franchise-opportunities">
                  <Building2 className="mr-1.5 w-4 h-4" />
                  <span className="hidden sm:inline">Franchise</span>
                  <span className="sm:hidden">Partner</span>
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
            <div className="absolute inset-0 bg-[hsl(178,48%,6%)]/60 backdrop-blur-sm" />
            
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
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                Global Healthcare Network
              </h1>
              <p className="text-base md:text-lg text-white/60 mb-8 max-w-sm mx-auto leading-relaxed">
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
                  className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
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
        <div className="h-32 bg-gradient-to-t from-[hsl(178,48%,6%)] via-[hsl(178,48%,6%)]/80 to-transparent" />
        
        <div className="bg-[hsl(178,48%,6%)] px-4 pb-4 md:px-6 md:pb-6 pointer-events-auto">
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
                      : 'bg-white/[0.08] text-white/80 hover:bg-white/[0.12] hover:text-white border border-white/10'
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
            <span className="text-white/30 text-xs">Powered by</span>
            <img 
              src={drGreenLogo} 
              alt="Dr. Green" 
              className="h-5 w-auto object-contain opacity-50"
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
            <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 p-3 space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-white/50 uppercase tracking-wider font-medium mb-2">
                <Sparkles className="w-3 h-3" />
                Legend
              </div>
              {Object.entries(statusConfig).map(([status, config]) => (
                <div key={status} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
                  <span className="text-xs text-white/70">{config.label}</span>
                </div>
              ))}
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
