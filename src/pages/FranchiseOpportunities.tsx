import { useTranslation } from "react-i18next";
import Header from "@/layout/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ScrollAnimation from "@/components/ScrollAnimation";
import BackToTop from "@/components/BackToTop";
import MobileBottomActions from "@/components/MobileBottomActions";
import SEOHead from "@/components/SEOHead";
import { Building2, Globe, Shield, TrendingUp, Loader2, CheckCircle2, AlertCircle, Phone } from "lucide-react";
import greenhouseImage from "@/assets/greenhouse-exterior-hq.jpg";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Franchise interest form validation schema
const franchiseSchema = z.object({
  firstName: z.string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z.string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: z.string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z.string()
    .trim()
    .min(8, "Phone number must be at least 8 characters")
    .max(20, "Phone number must be less than 20 characters"),
  country: z.string()
    .trim()
    .min(2, "Please select or enter your country")
    .max(100, "Country must be less than 100 characters"),
  investmentRange: z.string()
    .min(1, "Please select an investment range"),
  experience: z.string()
    .trim()
    .max(1000, "Experience description must be less than 1000 characters")
    .optional(),
  message: z.string()
    .trim()
    .max(2000, "Message must be less than 2000 characters")
    .optional(),
});

type FranchiseFormData = z.infer<typeof franchiseSchema>;

const investmentRanges = [
  { value: "50k-100k", label: "€50,000 - €100,000" },
  { value: "100k-250k", label: "€100,000 - €250,000" },
  { value: "250k-500k", label: "€250,000 - €500,000" },
  { value: "500k-1m", label: "€500,000 - €1,000,000" },
  { value: "1m+", label: "€1,000,000+" },
];

const benefits = [
  {
    icon: Globe,
    title: "Global Brand Recognition",
    description: "Join an established international medical cannabis network with presence across Europe and Africa.",
  },
  {
    icon: Shield,
    title: "Regulatory Compliance",
    description: "Benefit from our EU GMP certification, established compliance frameworks, and regulatory expertise.",
  },
  {
    icon: Building2,
    title: "Turnkey Operations",
    description: "Receive comprehensive support including training, technology platforms, and operational guidance.",
  },
  {
    icon: TrendingUp,
    title: "Growing Market",
    description: "Enter the rapidly expanding medical cannabis sector with a proven business model and established supply chain.",
  },
];

const FranchiseOpportunities = () => {
  const { t } = useTranslation('common');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FranchiseFormData>({
    resolver: zodResolver(franchiseSchema),
  });

  const onSubmit = async (data: FranchiseFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { data: response, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          subject: `Franchise Interest: ${data.country} - ${data.investmentRange}`,
          message: `
FRANCHISE OPPORTUNITY ENQUIRY

Contact Details:
- Name: ${data.firstName} ${data.lastName}
- Email: ${data.email}
- Phone: ${data.phone}
- Country: ${data.country}

Investment Range: ${investmentRanges.find(r => r.value === data.investmentRange)?.label || data.investmentRange}

Industry Experience:
${data.experience || 'Not provided'}

Additional Message:
${data.message || 'Not provided'}
          `.trim(),
        },
      });

      if (error) {
        throw error;
      }

      if (response?.success) {
        setSubmitStatus('success');
        reset();
        toast({
          title: "Enquiry submitted!",
          description: "Thank you for your interest. A franchise specialist will contact you within 48 hours.",
        });
      } else {
        throw new Error(response?.error || 'Failed to submit enquiry');
      }
    } catch (error: any) {
      console.error('Franchise form error:', error);
      setSubmitStatus('error');
      
      let errorMessage = "Something went wrong. Please try again later.";
      if (error?.message?.includes('Too many requests')) {
        errorMessage = "Too many requests. Please wait a few minutes before trying again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <SEOHead 
        title="Franchise Opportunities | Healing Buds Global"
        description="Join the Healing Buds franchise network. Partner with an established EU GMP certified medical cannabis company and enter the growing healthcare market."
      />
      <div className="min-h-screen bg-background pb-24 lg:pb-0">
        <Header onMenuStateChange={setMenuOpen} />
        
        <main className="pt-28 md:pt-32">
          {/* Hero Section */}
          <section className="bg-background py-16 md:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollAnimation>
                <div className="max-w-5xl">
                  <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase bg-primary/10 text-primary rounded-full mb-6">
                    Partner With Us
                  </span>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight leading-[1.1]">
                    Franchise Opportunities
                  </h1>
                  <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-3xl font-light">
                    Join the Healing Buds network and bring regulated medical cannabis healthcare to your region.
                  </p>
                </div>
              </ScrollAnimation>
            </div>
          </section>

          {/* Hero Image */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
            <ScrollAnimation variant="scale" duration={0.8}>
              <div className="relative h-[300px] md:h-[400px] overflow-hidden rounded-xl border border-border/30">
                <img 
                  src={greenhouseImage} 
                  alt="Healing Buds cultivation facility" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl">
                    Established operations across Portugal, United Kingdom, and South Africa
                  </p>
                </div>
              </div>
            </ScrollAnimation>
          </section>

          {/* Benefits Section */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollAnimation>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
                    Why Partner With Healing Buds
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Access proven systems, regulatory expertise, and an established brand in the medical cannabis sector.
                  </p>
                </div>
              </ScrollAnimation>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => (
                  <ScrollAnimation key={benefit.title} delay={index * 0.1}>
                    <div className="card-linear p-6 h-full">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                        <benefit.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </ScrollAnimation>
                ))}
              </div>
            </div>
          </section>

          {/* Registration Form Section */}
          <section className="py-20 md:py-32 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
                {/* Left Column - Info */}
                <ScrollAnimation>
                  <div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-8 tracking-tight">
                      Register Your Interest
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground/80 mb-8 leading-relaxed">
                      Complete the form to receive a call from one of our franchise specialists. We'll discuss your goals, answer your questions, and explore partnership opportunities.
                    </p>
                    
                    <div className="space-y-6 mb-8">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Personal Consultation</h3>
                          <p className="text-sm text-muted-foreground">
                            Speak directly with a franchise specialist who will guide you through the opportunity.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">No Obligation</h3>
                          <p className="text-sm text-muted-foreground">
                            This is an initial enquiry only. We'll provide information and answer your questions.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Response Time:</strong> A franchise specialist will contact you within 48 business hours.
                      </p>
                    </div>
                  </div>
                </ScrollAnimation>

                {/* Right Column - Form */}
                <ScrollAnimation delay={0.2}>
                  <div className="card-linear p-8">
                    <h3 className="text-2xl font-semibold text-foreground mb-6 tracking-tight">
                      Franchise Enquiry Form
                    </h3>
                    
                    {/* Success Message */}
                    {submitStatus === 'success' && (
                      <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">Enquiry submitted successfully!</p>
                          <p className="text-sm text-muted-foreground mt-1">A franchise specialist will contact you within 48 hours.</p>
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {submitStatus === 'error' && (
                      <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">Failed to submit enquiry</p>
                          <p className="text-sm text-muted-foreground mt-1">Please try again later or email us directly.</p>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            {...register('firstName')}
                            className={`w-full px-4 py-2.5 rounded-lg bg-background border ${
                              errors.firstName ? 'border-destructive' : 'border-border/40'
                            } focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200`}
                            placeholder="John"
                            disabled={isSubmitting}
                          />
                          {errors.firstName && (
                            <p className="text-destructive text-xs mt-1.5">{errors.firstName.message}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            {...register('lastName')}
                            className={`w-full px-4 py-2.5 rounded-lg bg-background border ${
                              errors.lastName ? 'border-destructive' : 'border-border/40'
                            } focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200`}
                            placeholder="Smith"
                            disabled={isSubmitting}
                          />
                          {errors.lastName && (
                            <p className="text-destructive text-xs mt-1.5">{errors.lastName.message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          {...register('email')}
                          className={`w-full px-4 py-2.5 rounded-lg bg-background border ${
                            errors.email ? 'border-destructive' : 'border-border/40'
                          } focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200`}
                          placeholder="john@example.com"
                          disabled={isSubmitting}
                        />
                        {errors.email && (
                          <p className="text-destructive text-xs mt-1.5">{errors.email.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          {...register('phone')}
                          className={`w-full px-4 py-2.5 rounded-lg bg-background border ${
                            errors.phone ? 'border-destructive' : 'border-border/40'
                          } focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200`}
                          placeholder="+351 912 345 678"
                          disabled={isSubmitting}
                        />
                        {errors.phone && (
                          <p className="text-destructive text-xs mt-1.5">{errors.phone.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-foreground mb-2">
                          Country of Interest *
                        </label>
                        <input
                          type="text"
                          id="country"
                          {...register('country')}
                          className={`w-full px-4 py-2.5 rounded-lg bg-background border ${
                            errors.country ? 'border-destructive' : 'border-border/40'
                          } focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200`}
                          placeholder="e.g. Germany, Spain, etc."
                          disabled={isSubmitting}
                        />
                        {errors.country && (
                          <p className="text-destructive text-xs mt-1.5">{errors.country.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="investmentRange" className="block text-sm font-medium text-foreground mb-2">
                          Investment Range *
                        </label>
                        <select
                          id="investmentRange"
                          {...register('investmentRange')}
                          className={`w-full px-4 py-2.5 rounded-lg bg-background border ${
                            errors.investmentRange ? 'border-destructive' : 'border-border/40'
                          } focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200`}
                          disabled={isSubmitting}
                        >
                          <option value="">Select investment range</option>
                          {investmentRanges.map((range) => (
                            <option key={range.value} value={range.value}>
                              {range.label}
                            </option>
                          ))}
                        </select>
                        {errors.investmentRange && (
                          <p className="text-destructive text-xs mt-1.5">{errors.investmentRange.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-foreground mb-2">
                          Relevant Industry Experience (Optional)
                        </label>
                        <textarea
                          id="experience"
                          rows={3}
                          {...register('experience')}
                          className={`w-full px-4 py-2.5 rounded-lg bg-background border ${
                            errors.experience ? 'border-destructive' : 'border-border/40'
                          } focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none transition-all duration-200`}
                          placeholder="Briefly describe any relevant experience in healthcare, retail, or cannabis industries..."
                          disabled={isSubmitting}
                        />
                        {errors.experience && (
                          <p className="text-destructive text-xs mt-1.5">{errors.experience.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                          Additional Questions (Optional)
                        </label>
                        <textarea
                          id="message"
                          rows={3}
                          {...register('message')}
                          className={`w-full px-4 py-2.5 rounded-lg bg-background border ${
                            errors.message ? 'border-destructive' : 'border-border/40'
                          } focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none transition-all duration-200`}
                          placeholder="Any specific questions you'd like us to address..."
                          disabled={isSubmitting}
                        />
                        {errors.message && (
                          <p className="text-destructive text-xs mt-1.5">{errors.message.message}</p>
                        )}
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Request a Call"
                        )}
                      </button>
                      
                      <p className="text-xs text-muted-foreground text-center mt-4">
                        By submitting this form, you agree to our{" "}
                        <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.
                      </p>
                    </form>
                  </div>
                </ScrollAnimation>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
        <BackToTop />
        <MobileBottomActions menuOpen={menuOpen} />
      </div>
    </PageTransition>
  );
};

export default FranchiseOpportunities;