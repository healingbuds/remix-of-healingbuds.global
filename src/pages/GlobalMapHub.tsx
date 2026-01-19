import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, ChevronRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PremiumLeafletMap from '@/components/PremiumLeafletMap';
import PremiumGlobeIcon from '@/components/PremiumGlobeIcon';
import RegionSlidePanel from '@/components/RegionSlidePanel';
import TestRegionSwitcher from '@/components/TestRegionSwitcher';
import hbLogoWhite from '@/assets/hb-logo-white-new.png';
import drGreenLogo from '@/assets/drgreen-logo-white.png';
import { countryKeyToRegionCode, RegionCode, detectRegionFromDomain } from '@/lib/domainDetection';

// Map from InteractiveMap country keys to display info
const countryDisplayInfo: Record<string, { name: string; status: 'LIVE' | 'NEXT' | 'UPCOMING' }> = {
  southAfrica: { name: 'South Africa', status: 'LIVE' },
  thailand: { name: 'Thailand', status: 'LIVE' },
  uk: { name: 'United Kingdom', status: 'NEXT' },
  portugal: { name: 'Portugal', status: 'UPCOMING' },
};

export default function GlobalMapHub() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedRegionCode, setSelectedRegionCode] = useState<RegionCode | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Auto-detect region on mount (for future domain-based routing)
  useEffect(() => {
    const detectedRegion = detectRegionFromDomain();
    if (detectedRegion !== 'global') {
      // If on a regional domain, could auto-redirect or show regional content
      console.log('Detected region:', detectedRegion);
    }
  }, []);
  
  // Handle country selection from the map
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
    // Don't clear selected country to keep map focused
  }, []);
  
  const selectedCountryInfo = selectedCountry ? countryDisplayInfo[selectedCountry] : null;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(178,48%,8%)] via-[hsl(178,48%,10%)] to-[hsl(175,35%,6%)] relative overflow-hidden">
      {/* Full-screen Premium Leaflet Map */}
      <div className="absolute inset-0">
        <PremiumLeafletMap 
          selectedCountry={selectedCountry}
          onCountrySelect={handleCountrySelect}
        />
        
        {/* Single light gradient for text readability - map tiles remain visible */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[hsl(178,48%,8%)]/80 to-transparent pointer-events-none z-10" />
      </div>
      
      {/* Floating Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute top-0 left-0 right-0 z-30"
      >
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link to="/home" className="flex items-center gap-3 group">
              <PremiumGlobeIcon size="md" animate />
              <img 
                src={hbLogoWhite} 
                alt="Healing Buds" 
                className="h-8 md:h-10 object-contain opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </Link>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              asChild
            >
              <Link to="/home">
                Enter Site
                <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
            <Button 
              size="sm"
              variant="outline"
              className="border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/60"
              asChild
            >
              <Link to="/franchise-opportunities">
                <Building2 className="mr-2 w-4 h-4" />
                Franchise
              </Link>
            </Button>
          </div>
        </div>
      </motion.header>
      
      {/* Welcome Overlay - shows on initial load */}
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center max-w-xl mx-auto px-6 pointer-events-auto"
          >
            {/* Hero content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mb-6"
            >
              <PremiumGlobeIcon size="xl" className="mx-auto mb-4" />
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Global Healthcare Network
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-md mx-auto">
              Explore our worldwide presence. Click any marker on the map to discover regional services.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                asChild
              >
                <Link to="/home">
                  Continue to Site
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                onClick={() => setShowWelcome(false)}
              >
                <Info className="mr-2 w-4 h-4" />
                Explore Map
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Bottom Info Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-0 left-0 right-0 z-20"
      >
        <div className="px-6 py-4">
          {/* Powered by Dr. Green */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-white/40 text-xs">Powered by</span>
            <img 
              src={drGreenLogo} 
              alt="Dr. Green" 
              className="h-5 w-auto object-contain opacity-60"
            />
          </div>
          
          {/* Region Quick Access */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {Object.entries(countryDisplayInfo).map(([key, info]) => {
              const regionCode = countryKeyToRegionCode[key];
              const isSelected = selectedCountry === key;
              
              return (
                <button
                  key={key}
                  onClick={() => handleCountrySelect(key)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${isSelected 
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
                    }
                    ${info.status === 'LIVE' ? '' : 'opacity-70'}
                  `}
                >
                  {info.name}
                  {info.status !== 'LIVE' && (
                    <span className="ml-2 text-xs opacity-60">Coming Soon</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
      
      {/* Region Slide Panel */}
      <RegionSlidePanel
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
        regionCode={selectedRegionCode}
        countryName={selectedCountryInfo?.name}
        countryStatus={selectedCountryInfo?.status}
      />
      
      {/* Test Region Switcher (dev only) */}
      <TestRegionSwitcher />
    </div>
  );
}
