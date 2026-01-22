import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, Check, Shield, Globe, AlertTriangle, 
  Building2, Sparkles, Zap, Lock, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRegionalContent, RegionalContentType } from '@/data/regionalContent';
import { globalContent } from '@/data/globalContent';
import RegionalRegistrationForm from '@/components/RegionalRegistrationForm';
import LeadGateOverlay from '@/components/LeadGateOverlay';
import hbLogo from '@/assets/hb-logo-white-new.png';

// Animated background orbs component
const AnimatedOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
    <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
  </div>
);

// Glassmorphism card with gradient border
const GlassCard = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className={`relative group ${className}`}
  >
    {/* Gradient border effect */}
    <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/50 via-secondary/30 to-accent/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
    <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/30 via-secondary/20 to-accent/30 rounded-2xl" />
    
    <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6 md:p-8">
      {children}
    </div>
  </motion.div>
);

// Step indicator component
const StepIndicator = ({ number, label, active = false }: { number: number; label: string; active?: boolean }) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`
      w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
      transition-all duration-300
      ${active 
        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
        : 'bg-muted/50 text-muted-foreground border border-border/50'
      }
    `}>
      {number}
    </div>
    <span className={`text-xs font-medium ${active ? 'text-primary' : 'text-muted-foreground'}`}>
      {label}
    </span>
  </div>
);

// Connection line between steps
const StepConnection = () => (
  <div className="flex-1 h-[2px] bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 mx-2" />
);

// Global Preview Component - Modern Dark Tech
const GlobalPreviewContent = () => {
  return (
    <div className="min-h-screen bg-background theme-dark-tech">
      {/* Ambient background */}
      <AnimatedOrbs />
      
      {/* Preview Banner */}
      <div className="relative z-50 bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20 backdrop-blur-sm border-b border-border/30 py-2 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
              PREVIEW
            </Badge>
            <span className="text-sm font-medium text-foreground/80">
              🌍 Global Experience
            </span>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-foreground/70 hover:text-foreground hover:bg-white/5">
            <Link to="/" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Regions
            </Link>
          </Button>
        </div>
      </div>

      {/* Floating Header */}
      <header className="sticky top-0 z-40 bg-background/60 backdrop-blur-xl border-b border-border/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={hbLogo} alt="Healing Buds" className="h-10" />
            <div className="hidden md:flex items-center gap-1 text-2xl">
              <span>🌍</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {['Platform', 'Research', 'Clinics', 'Partners'].map((item) => (
              <span key={item} className="text-foreground/60 hover:text-foreground transition-colors cursor-pointer">
                {item}
              </span>
            ))}
          </nav>
          <Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
            <Sparkles className="h-4 w-4 mr-2" />
            Global Network
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center py-20">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">The Future of Medical Cannabis</span>
            </motion.div>
            
            {/* Title with gradient */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
                {globalContent.title}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              {globalContent.subtitle}
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <Link to="/home">
                  Continue to Platform
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-border/50 hover:bg-white/5 hover:border-primary/50">
                <Link to="/franchise-opportunities">
                  <Building2 className="mr-2 h-5 w-5" />
                  Partner With Us
                </Link>
              </Button>
            </div>
            
            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-16"
            >
              <ChevronDown className="h-6 w-6 mx-auto text-foreground/40 animate-bounce" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {globalContent.stats.map((stat, index) => (
              <GlassCard key={stat.label} delay={index * 0.1} className="text-center">
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Stepped Flow */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A streamlined journey from consultation to treatment
            </p>
          </motion.div>
          
          {/* Step indicators */}
          <div className="flex items-center justify-center max-w-2xl mx-auto mb-12">
            <StepIndicator number={1} label="Consult" active />
            <StepConnection />
            <StepIndicator number={2} label="Verify" />
            <StepConnection />
            <StepIndicator number={3} label="Treat" />
          </div>
          
          {/* Features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {globalContent.features.map((feature, index) => (
              <GlassCard key={feature.title} delay={index * 0.1}>
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <GlassCard className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 mb-6">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Transform Healthcare?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Join the global movement towards evidence-based medical cannabis therapy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                  <Link to="/home">
                    Enter Platform
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-border/50 hover:bg-white/5">
                  <Link to="/franchise-opportunities">
                    Franchise Opportunities
                  </Link>
                </Button>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 border-t border-border/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">EU GMP Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <span className="text-sm">Blockchain Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              <span className="text-sm">Regulatory Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/30 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src={hbLogo} alt="Healing Buds" className="h-8 opacity-80" />
              <span className="text-2xl">🌍</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Healing Buds Global. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const RegionalPreviewContent = ({ content, regionCode, isRegistered, onRegister }: { 
  content: RegionalContentType; 
  regionCode: string;
  isRegistered: boolean;
  onRegister: () => void;
}) => {
  const formatPrice = (amount: number) => `${content.currency.symbol}${amount.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-background theme-dark-tech">
      {/* Ambient background */}
      <AnimatedOrbs />
      
      {/* Preview Banner */}
      <div className="relative z-50 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 backdrop-blur-sm border-b border-amber-500/30 py-2 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              PREVIEW
            </Badge>
            <span className="text-sm font-medium text-foreground/80">
              {content.flag} {content.name}
            </span>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-foreground/70 hover:text-foreground hover:bg-white/5">
            <Link to="/" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              All Regions
            </Link>
          </Button>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/60 backdrop-blur-xl border-b border-border/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={hbLogo} alt="Healing Buds" className="h-10" />
            <span className="text-2xl">{content.flag}</span>
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/30">
            {content.regulatoryBody} Approved
          </Badge>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center py-20">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="text-lg">{content.flag}</span>
              <span className="text-sm font-medium text-primary">Coming Soon</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                {content.hero.title}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/60 max-w-2xl leading-relaxed">
              {content.hero.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Why Healing Buds {content.name}?
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.features.map((feature, index) => (
              <GlassCard key={feature} delay={index * 0.1}>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-sm">{feature}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-20 relative" id="register">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <GlassCard>
              <RegionalRegistrationForm content={content} regionCode={regionCode} />
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {content.operations.type}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{content.operations.description}</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {content.services.map((service, index) => (
              <GlassCard key={index} delay={index * 0.05}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{service}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Legal */}
      <section className="py-12 border-t border-border/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">Regulatory Compliance</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {content.legalNote}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border/30 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={hbLogo} alt="Healing Buds" className="h-8 opacity-80" />
              <span className="text-xl">{content.flag}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>Part of the Healing Buds network</span>
            </div>
            <p className="text-sm text-muted-foreground/60">
              © {new Date().getFullYear()} Healing Buds
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const RegionalPreviewModern = () => {
  const { regionCode } = useParams<{ regionCode: string }>();
  const [isRegistered, setIsRegistered] = useState(false);
  
  // Check localStorage for registration status on mount
  useEffect(() => {
    if (regionCode) {
      const storageKey = `healingbuds_registered_${regionCode.toLowerCase()}`;
      const registered = localStorage.getItem(storageKey) === 'true';
      setIsRegistered(registered);
    }
  }, [regionCode]);
  
  const handleRegistrationSuccess = () => {
    if (regionCode) {
      const storageKey = `healingbuds_registered_${regionCode.toLowerCase()}`;
      localStorage.setItem(storageKey, 'true');
      setIsRegistered(true);
    }
  };
  
  if (regionCode?.toLowerCase() === 'global') {
    return <GlobalPreviewContent />;
  }

  const content = regionCode ? getRegionalContent(regionCode) : null;

  if (!content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center theme-dark-tech">
        <AnimatedOrbs />
        <Card className="max-w-md bg-card/80 backdrop-blur-xl border-border/50">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Region Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The region "{regionCode}" is not available for preview.
            </p>
            <Button asChild>
              <Link to="/">Return to Global</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Lead Gate Overlay - shows registration form with blurred background */}
      <LeadGateOverlay
        content={content}
        regionCode={regionCode!}
        onSuccess={handleRegistrationSuccess}
        isVisible={!isRegistered}
      />
      
      {/* Main Preview Content - visible but blurred when not registered */}
      <div className={!isRegistered ? 'blur-sm pointer-events-none select-none' : ''}>
        <RegionalPreviewContent 
          content={content} 
          regionCode={regionCode!}
          isRegistered={isRegistered}
          onRegister={handleRegistrationSuccess}
        />
      </div>
    </>
  );
};

export default RegionalPreviewModern;
