import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Mail, Check, Shield, Globe, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRegionalContent, RegionalContentType } from '@/data/regionalContent';
import hbLogo from '@/assets/hb-logo-white-new.png';
import heroImage from '@/assets/hero-greenhouse-hq.jpg';

const RegionalPreview = () => {
  const { regionCode } = useParams<{ regionCode: string }>();
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
              {content.hero.title}
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              {content.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link to={`/register/${regionCode}`}>
                  {content.hero.cta}
                </Link>
              </Button>
            </div>
          </motion.div>
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
            <h2 className="text-3xl font-bold mb-4">Why Choose Healing Buds {content.name}?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We bring world-class medical cannabis treatments to {content.name} with full regulatory compliance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-primary/20 hover:border-primary/40 transition-colors">
                  <CardContent className="p-6 flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Pricing in {content.currency.code}</h2>
            <p className="text-muted-foreground">Transparent pricing for medical cannabis treatment</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">Initial Consultation</h3>
                  <p className="text-4xl font-bold text-primary mb-4">
                    {formatPrice(content.pricing.consultation)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    One-time consultation with a specialist to assess your eligibility for medical cannabis treatment.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">Monthly Treatment</h3>
                  <p className="text-4xl font-bold text-primary mb-4">
                    {formatPrice(content.pricing.treatmentMin)} - {formatPrice(content.pricing.treatmentMax)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Depending on your prescribed treatment plan and product requirements.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Clinic Location */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{content.clinic.name}</h3>
                    <p className="text-muted-foreground">Our {content.name} Clinic</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{content.clinic.address}</p>
                      <p className="text-muted-foreground">{content.clinic.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <a href={`tel:${content.clinic.phone}`} className="hover:text-primary transition-colors">
                      {content.clinic.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <a href={`mailto:${content.clinic.email}`} className="hover:text-primary transition-colors">
                      {content.clinic.email}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Legal & Regulatory Compliance</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {content.legalNote}
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

export default RegionalPreview;
