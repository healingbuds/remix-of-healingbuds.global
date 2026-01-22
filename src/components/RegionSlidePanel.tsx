import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Eye, MapPin, Building2, Shield, CheckCircle2, Check, Factory, Rocket, Crown } from 'lucide-react';
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
  countryStatus?: 'LIVE' | 'HQ' | 'PRODUCTION' | 'NEXT';
}

const RegionSlidePanel = ({ 
  isOpen, 
  onClose, 
  regionCode,
  countryName,
  countryStatus = 'NEXT',
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
                {/* Status Badge based on region status */}
                {content?.status === 'LIVE' && (
                  <Badge className="bg-success/20 text-success border-success/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                )}
                {content?.status === 'HQ' && (
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    <Crown className="w-3 h-3 mr-1" />
                    Global HQ
                  </Badge>
                )}
                {content?.status === 'PRODUCTION' && (
                  <Badge className="bg-info/20 text-info border-info/30">
                    <Factory className="w-3 h-3 mr-1" />
                    Manufacturing
                  </Badge>
                )}
                {content?.status === 'NEXT' && (
                  <Badge className="bg-warning/20 text-warning border-warning/30">
                    <Rocket className="w-3 h-3 mr-1" />
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
          {/* Operations Overview */}
          {content && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Building2 className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">{content.operations.type}</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{content.operations.description}</p>
            </div>
          )}

          {/* Services Available */}
          {content?.services && content.services.length > 0 && regionCode !== 'pt' && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">What's Available</h4>
              <div className="grid gap-2">
                {content.services.map((service, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compliance */}
          {content?.compliance && regionCode !== 'pt' && (
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Compliance</span>
              </div>
              <p className="text-sm font-semibold text-foreground mb-2">{content.compliance.body} Regulated</p>
              <div className="flex flex-wrap gap-2">
                {content.compliance.certifications.map((cert, index) => (
                  <span key={index} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Portugal HQ - About Our Operations Section */}
          {regionCode === 'pt' && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">About Our Operations</h4>
              
              {/* Cultivation Facility */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-1">EU GMP Cultivation Facility</h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Our state-of-the-art facility spans over 18,000m² in Portugal, featuring climate-controlled greenhouses and pharmaceutical-grade processing capabilities.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Research Partnerships */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-1">Research Partnerships</h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Collaborating with <span className="text-foreground font-medium">Imperial College London</span> and the <span className="text-foreground font-medium">University of Pennsylvania</span> to advance medical cannabis science and develop innovative therapeutic applications.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Global Distribution */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-1">Global Distribution Network</h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      From our Portuguese headquarters, we coordinate EU GMP-certified product distribution to licensed partners across South Africa, Thailand, and the United Kingdom.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features - Show for non-HQ regions */}
          {content?.features && content.features.length > 0 && regionCode !== 'pt' && (
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
            {isLive && externalUrl && regionCode === 'za' ? (
              // South Africa specific - eligibility focused
              <>
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                  onClick={() => window.open('https://healingbuds.co.za/eligibility', '_blank')}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Check Eligibility
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full border-primary/30 hover:bg-primary/10"
                  onClick={() => window.open(externalUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit South Africa Site
                </Button>
              </>
            ) : isLive && externalUrl ? (
              // Other live regions - show visit and preview buttons
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
