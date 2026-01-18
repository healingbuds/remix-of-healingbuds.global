import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ExternalLink, Clock, Users, CheckCircle, Bell, X, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import Header from "@/layout/Header";
import Footer from "@/components/Footer";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import PageHero from "@/components/PageHero";
import PageTransition from "@/components/PageTransition";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Import clinic images for regions
import clinicSouthAfrica from "@/assets/clinic-south-africa.jpg";
import clinicThailand from "@/assets/clinic-thailand.jpg";
import clinicUK from "@/assets/clinic-uk.jpg";
import clinicPortugal from "@/assets/clinic-portugal.jpg";

const emailSchema = z.string().trim().email({ message: "Please enter a valid email address" }).max(255);

interface RegionCard {
  id: string;
  name: string;
  flag: string;
  status: "live" | "partner-only" | "coming-soon";
  statusLabel: string;
  description: string;
  image: string;
  externalUrl?: string;
}

const regions: RegionCard[] = [
  {
    id: "south-africa",
    name: "South Africa",
    flag: "🇿🇦",
    status: "live",
    statusLabel: "Live",
    description: "Operational dispensaries serving patients across South Africa with pharmaceutical-grade medical cannabis.",
    image: clinicSouthAfrica,
    externalUrl: "https://healingbuds.co.za",
  },
  {
    id: "thailand",
    name: "Thailand",
    flag: "🇹🇭",
    status: "partner-only",
    statusLabel: "Partner Operations Only",
    description: "Licensed partner facilities serving the Thai medical cannabis market through established healthcare networks.",
    image: clinicThailand,
  },
  {
    id: "united-kingdom",
    name: "United Kingdom",
    flag: "🇬🇧",
    status: "coming-soon",
    statusLabel: "Launching Soon",
    description: "UK dispensary network pending MHRA regulatory approval. Full launch expected in 2026.",
    image: clinicUK,
  },
  {
    id: "portugal",
    name: "Portugal",
    flag: "🇵🇹",
    status: "coming-soon",
    statusLabel: "Coming After UK",
    description: "Portuguese operations to launch following UK market entry. EU GMP facility already operational.",
    image: clinicPortugal,
  },
];

const getStatusStyles = (status: RegionCard["status"]) => {
  switch (status) {
    case "live":
      return {
        badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        dot: "bg-emerald-400",
        card: "hover:border-emerald-500/50 cursor-pointer group",
      };
    case "partner-only":
      return {
        badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        dot: "bg-amber-400",
        card: "border-border/50 hover:border-amber-500/30 cursor-pointer group",
      };
    case "coming-soon":
      return {
        badge: "bg-muted/50 text-muted-foreground border-border/50",
        dot: "bg-muted-foreground",
        card: "border-border/50 hover:border-primary/30 cursor-pointer group",
      };
  }
};

interface NotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  region: RegionCard;
}

const NotifyModal = ({ isOpen, onClose, region }: NotifyModalProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: dbError } = await supabase
        .from("dispensary_notifications")
        .insert({
          email: result.data,
          region: region.id,
        });

      if (dbError) {
        // Handle duplicate entry
        if (dbError.code === "23505") {
          setError("You're already signed up for notifications for this region.");
        } else {
          throw dbError;
        }
      } else {
        setIsSuccess(true);
        toast({
          title: "You're on the list!",
          description: `We'll notify you when ${region.name} launches.`,
        });
      }
    } catch (err) {
      console.error("Error signing up for notifications:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl mx-4">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">{region.flag}</div>
                <div>
                  <h3 className="font-jakarta text-xl font-semibold text-foreground">
                    {region.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{region.statusLabel}</p>
                </div>
              </div>

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-primary" size={32} />
                  </div>
                  <h4 className="font-jakarta text-lg font-semibold text-foreground mb-2">
                    You're on the list!
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    We'll send you an email when {region.name} dispensaries are ready.
                  </p>
                  <Button onClick={handleClose} variant="outline" className="w-full">
                    Close
                  </Button>
                </motion.div>
              ) : (
                <>
                  <p className="font-body text-muted-foreground text-sm mb-6">
                    Be the first to know when our {region.name} dispensaries launch. 
                    Enter your email and we'll notify you as soon as we're ready.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={error ? "border-destructive" : ""}
                        disabled={isSubmitting}
                      />
                      {error && (
                        <p className="text-sm text-destructive mt-1">{error}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting || !email}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin mr-2" />
                          Signing up...
                        </>
                      ) : (
                        <>
                          <Bell size={16} className="mr-2" />
                          Notify Me
                        </>
                      )}
                    </Button>
                  </form>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    We respect your privacy. Unsubscribe anytime.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface RegionCardComponentProps {
  region: RegionCard;
  index: number;
  onNotifyClick: (region: RegionCard) => void;
}

const RegionCardComponent = ({ region, index, onNotifyClick }: RegionCardComponentProps) => {
  const styles = getStatusStyles(region.status);
  const isLive = region.status === "live" && region.externalUrl;
  const canNotify = region.status === "coming-soon" || region.status === "partner-only";

  const handleClick = () => {
    if (canNotify) {
      onNotifyClick(region);
    }
  };

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={canNotify ? handleClick : undefined}
      className={`relative overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm ${styles.card} transition-all duration-300`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={region.image}
          alt={`${region.name} dispensary`}
          className={`w-full h-full object-cover transition-transform duration-500 ${isLive || canNotify ? "group-hover:scale-105" : ""}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${styles.badge}`}>
            <span className={`w-2 h-2 rounded-full ${styles.dot} ${region.status === "live" ? "animate-pulse" : ""}`} />
            {region.statusLabel}
          </div>
        </div>
        
        {/* Flag */}
        <div className="absolute bottom-4 left-4 text-4xl drop-shadow-lg">
          {region.flag}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-jakarta text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
          {region.name}
          {isLive && (
            <ExternalLink size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </h3>
        <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
          {region.description}
        </p>
        
        {/* Action */}
        {isLive ? (
          <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
            <MapPin size={16} />
            <span>Visit Dispensary</span>
            <ExternalLink size={14} />
          </div>
        ) : region.status === "partner-only" ? (
          <div className="flex items-center gap-2 text-amber-400 text-sm font-medium group-hover:gap-3 transition-all">
            <Bell size={16} />
            <span>Notify Me When Available</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
            <Bell size={16} />
            <span>Notify Me When Available</span>
          </div>
        )}
      </div>

      {/* Hover overlay for notify cards */}
      {canNotify && (
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      )}
    </motion.div>
  );

  if (isLive && region.externalUrl) {
    return (
      <a
        href={region.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
};

const Dispensaries = () => {
  const { t } = useTranslation("common");
  const [notifyModal, setNotifyModal] = useState<{ isOpen: boolean; region: RegionCard | null }>({
    isOpen: false,
    region: null,
  });

  const handleNotifyClick = (region: RegionCard) => {
    setNotifyModal({ isOpen: true, region });
  };

  const handleCloseModal = () => {
    setNotifyModal({ isOpen: false, region: null });
  };

  return (
    <PageTransition>
      <SEOHead
        title="Dispensaries | Healing Buds Global"
        description="Access medical cannabis dispensaries across our global network. Currently live in South Africa, with UK, Portugal, and Thailand locations coming soon."
        keywords="medical cannabis dispensary, cannabis pharmacy, South Africa dispensary, UK dispensary, medical marijuana"
      />
      
      <Header />
      
      <PageHero
        title="Our Dispensaries"
        subtitle="Access pharmaceutical-grade medical cannabis through our growing global network of licensed dispensaries and partner facilities."
        image={clinicSouthAfrica}
        imageAlt="Medical cannabis dispensary"
        variant="overlay"
        imageHeight="md"
      />
      
      <main className="bg-background">
        <PageBreadcrumb />
        
        {/* Introduction Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <CheckCircle size={16} />
                <span>Regulated Medical Access</span>
              </div>
              <h2 className="font-jakarta text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Global Dispensary Network
              </h2>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                From South Africa to Europe, we're building a trusted network of medical cannabis dispensaries. 
                Each location operates under strict regulatory oversight, ensuring patients receive safe, 
                consistent, and effective treatments.
              </p>
            </motion.div>

            {/* Region Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {regions.map((region, index) => (
                <RegionCardComponent 
                  key={region.id} 
                  region={region} 
                  index={index} 
                  onNotifyClick={handleNotifyClick}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 lg:p-12"
              >
                <h3 className="font-jakarta text-2xl font-semibold text-foreground mb-4">
                  Patient Access Requirements
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-6">
                  Access to our dispensaries requires a valid medical cannabis prescription from a licensed healthcare provider. 
                  Each region has specific eligibility requirements based on local regulations.
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-body text-sm text-foreground">Valid prescription required</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-body text-sm text-foreground">KYC verification completed</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-body text-sm text-foreground">Medical approval verified</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />

      {/* Notify Modal */}
      {notifyModal.region && (
        <NotifyModal
          isOpen={notifyModal.isOpen}
          onClose={handleCloseModal}
          region={notifyModal.region}
        />
      )}
    </PageTransition>
  );
};

export default Dispensaries;
