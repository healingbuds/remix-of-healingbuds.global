import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Eye, MapPin, Building2, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import PremiumFlagIcon from './PremiumFlagIcon';
import RegionalRegistrationForm from './RegionalRegistrationForm';
import { getRegionalContent, RegionalContentType } from '@/data/regionalContent';
import { isRegionLive, getRegionExternalUrl, RegionCode } from '@/lib/domainDetection';
import { formatCurrency } from '@/lib/currency';

interface RegionSlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  regionCode: RegionCode | null;
  countryName?: string;
  countryStatus?: 'LIVE' | 'NEXT' | 'UPCOMING';
}

const RegionSlidePanel = ({ 
  isOpen, 
  onClose, 
  regionCode,
  countryName,
  countryStatus = 'UPCOMING',
}: RegionSlidePanelProps) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [content, setContent] = useState<RegionalContentType | null>(null);
  
  useEffect(() => {
    if (regionCode && regionCode !== 'global') {
      const regionalContent = getRegionalContent(regionCode);
      setContent(regionalContent);
      
      // Check registration status
      const registered = localStorage.getItem(`healingbuds_registered_${regionCode}`);
      setIsRegistered(registered === 'true');
    }
  }, [regionCode]);
  
  const handleRegistrationSuccess = () => {
    if (regionCode) {
      localStorage.setItem(`healingbuds_registered_${regionCode}`, 'true');
      setIsRegistered(true);
    }
  };
  
  const isLive = regionCode ? isRegionLive(regionCode) : false;
  const externalUrl = regionCode ? getRegionExternalUrl(regionCode) : null;
  
  if (!regionCode || regionCode === 'global') return null;
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-lg overflow-y-auto bg-gradient-to-b from-card via-card to-background border-l border-primary/20"
      >
        <SheetHeader className="pb-6 border-b border-border/50">
          <div className="flex items-center gap-4">
            <PremiumFlagIcon 
              regionCode={regionCode} 
              regionName={content?.name || countryName || ''} 
              size="lg"
            />
            <div>
              <SheetTitle className="text-2xl font-bold text-foreground">
                {content?.name || countryName}
              </SheetTitle>
              <div className="flex items-center gap-2 mt-2">
                {isLive ? (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    Coming Soon
                  </Badge>
                )}
                {content?.regulatoryBody && (
                  <Badge variant="outline" className="text-muted-foreground">
                    <Shield className="w-3 h-3 mr-1" />
                    {content.regulatoryBody}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Quick Stats */}
          {content && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Building2 className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Clinic</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{content.clinic.name}</p>
                <p className="text-xs text-muted-foreground">{content.clinic.city}</p>
              </div>
              
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Consultation</span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  From {formatCurrency(content.pricing.consultation, content.currency.code)}
                </p>
              </div>
            </div>
          )}
          
          {/* Features */}
          {content?.features && content.features.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Key Features</h4>
              <div className="grid gap-2">
                {content.features.map((feature, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Buttons or Registration Form */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            {isLive && externalUrl ? (
              // Live region - show visit and preview buttons
              <>
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                  onClick={() => window.open(externalUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit {content?.name || countryName} Site
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full border-primary/30 hover:bg-primary/10"
                  asChild
                >
                  <Link to={`/preview/${regionCode}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Site
                  </Link>
                </Button>
              </>
            ) : isRegistered ? (
              // Coming soon but registered - show preview button
              <>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-emerald-400">You're registered!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll notify you when we launch in {content?.name || countryName}
                  </p>
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90"
                  asChild
                >
                  <Link to={`/preview/${regionCode}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Site
                  </Link>
                </Button>
              </>
            ) : content ? (
              // Coming soon and not registered - show registration form
              <div className="bg-background/50 rounded-2xl border border-border/50 p-6">
                <RegionalRegistrationForm 
                  content={content}
                  regionCode={regionCode}
                  onSuccess={handleRegistrationSuccess}
                />
              </div>
            ) : (
              // Fallback loading state
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading regional information...</p>
              </div>
            )}
          </div>
          
          {/* Legal Note */}
          {content?.legalNote && (
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {content.legalNote}
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RegionSlidePanel;
