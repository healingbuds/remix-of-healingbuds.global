import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Mail, Check, Shield, Globe, AlertTriangle, Building2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRegionalContent, RegionalContentType } from '@/data/regionalContent';
import { globalContent } from '@/data/globalContent';
import RegionalRegistrationForm from '@/components/RegionalRegistrationForm';
import hbLogo from '@/assets/hb-logo-white-new.png';
import heroImage from '@/assets/hero-greenhouse-hq.jpg';

// Global Preview Component
const GlobalPreviewContent = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Preview Mode Banner */}
      <div className="bg-primary/90 text-primary-foreground py-2 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
              PREVIEW MODE
            </Badge>
            <span className="text-sm font-medium">
              🌍 Global Site Overview
            </span>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-primary-foreground hover:bg-primary-foreground/10">
            <Link to="/" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Region Select
            </Link>
          </Button>
        </div>
      </div>

      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={hbLogo} alt="Healing Buds" className="h-10" />
            <span className="text-2xl">🌍</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <span className="hover:text-primary-foreground/80 cursor-pointer">About</span>
            <span className="hover:text-primary-foreground/80 cursor-pointer">What We Do</span>
            <span className="hover:text-primary-foreground/80 cursor-pointer">Research</span>
            <span className="hover:text-primary-foreground/80 cursor-pointer">Contact</span>
          </nav>
          <Badge variant="secondary" className="text-xs">
            Global Network
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-primary-foreground"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {globalContent.title}
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              {globalContent.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/home">
                  {globalContent.ctaPrimary}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/franchise-opportunities">
                  <Building2 className="mr-2 h-4 w-4" />
                  {globalContent.ctaSecondary}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              {globalContent.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {globalContent.stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose Healing Buds?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A vertically integrated global platform delivering excellence at every step.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {globalContent.features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-primary/20 hover:border-primary/40 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Ready to Explore?</h2>
                <p className="text-muted-foreground mb-6">
                  Discover how Healing Buds is transforming medical cannabis access worldwide.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link to="/home">
                      Continue to Site
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/franchise-opportunities">
                      <Building2 className="mr-2 h-4 w-4" />
                      Franchise Opportunities
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Global Compliance Standards</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Healing Buds operates under the strictest regulatory frameworks in every market we serve. 
              Our commitment to compliance ensures safe, effective, and legal access to medical cannabis therapy.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={hbLogo} alt="Healing Buds" className="h-8" />
              <span className="text-xl">🌍</span>
              <span className="text-sm opacity-80">Global</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm opacity-80">
              <Globe className="h-4 w-4" />
              <span>Operating in 4+ countries worldwide</span>
            </div>

            <p className="text-sm opacity-60">
              © {new Date().getFullYear()} Healing Buds. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Regional Preview Component
const RegionalPreviewContent = ({ content, regionCode }: { content: RegionalContentType; regionCode: string }) => {
  const formatPrice = (amount: number) => {
    return `${content.currency.symbol}${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Preview Mode Banner */}
      <div className="bg-amber-500/90 text-amber-950 py-2 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-amber-950 text-amber-100">
              PREVIEW MODE
            </Badge>
            <span className="text-sm font-medium">
              {content.flag} {content.name} Regional Landing Page
            </span>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-amber-950 hover:bg-amber-600/50">
            <Link to="/" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Global
            </Link>
          </Button>
        </div>
      </div>

      {/* Regional Header */}
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={hbLogo} alt="Healing Buds" className="h-10" />
            <span className="text-2xl">{content.flag}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <span className="hover:text-primary-foreground/80 cursor-pointer">About</span>
            <span className="hover:text-primary-foreground/80 cursor-pointer">Treatments</span>
            <span className="hover:text-primary-foreground/80 cursor-pointer">Clinic</span>
            <span className="hover:text-primary-foreground/80 cursor-pointer">Contact</span>
          </nav>
          <Badge variant="secondary" className="text-xs">
            {content.regulatoryBody} Approved
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[350px] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-primary-foreground"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {content.hero.title}
            </h1>
            <p className="text-base md:text-lg opacity-90">
              {content.hero.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold mb-3">Why Choose Healing Buds {content.name}?</h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              We bring world-class medical cannabis treatments to {content.name} with full regulatory compliance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-primary/20 hover:border-primary/40 transition-colors">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="font-medium text-sm">{feature}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-16" id="register">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto"
          >
            <RegionalRegistrationForm content={content} regionCode={regionCode} />
          </motion.div>
        </div>
      </section>

      {/* Operations & Services Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold mb-3">Our Operations in {content.name}</h2>
            <p className="text-muted-foreground text-sm">{content.operations.type}</p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-primary/20 mb-6">
              <CardContent className="p-6">
                <p className="text-center text-foreground">{content.operations.description}</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              {content.services.map((service, index) => (
                <Card key={index} className="border border-primary/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{service}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto"
          >
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{content.compliance.body}</h3>
                    <p className="text-sm text-muted-foreground">Regulatory Compliance</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {content.compliance.certifications.map((cert, index) => (
                    <span key={index} className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      {cert}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="py-10 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">Legal & Regulatory Compliance</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {content.legalNote}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={hbLogo} alt="Healing Buds" className="h-8" />
              <span className="text-xl">{content.flag}</span>
              <span className="text-sm opacity-80">{content.name}</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm opacity-80">
              <Globe className="h-4 w-4" />
              <span>Part of the global Healing Buds network</span>
            </div>

            <p className="text-sm opacity-60">
              © {new Date().getFullYear()} Healing Buds. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const RegionalPreview = () => {
  const { regionCode } = useParams<{ regionCode: string }>();
  
  // Handle global preview
  if (regionCode?.toLowerCase() === 'global') {
    return <GlobalPreviewContent />;
  }

  const content = regionCode ? getRegionalContent(regionCode) : null;

  if (!content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
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

  return <RegionalPreviewContent content={content} regionCode={regionCode!} />;
};

export default RegionalPreview;
