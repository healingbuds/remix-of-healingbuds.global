import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Loader2, AlertTriangle, User, Mail, Phone, Heart, Bell } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getRegionalContent } from '@/data/regionalContent';
import hbLogo from '@/assets/hb-logo-white-new.png';

const registrationSchema = z.object({
  firstName: z.string().min(2, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(2, 'Last name is required').max(50, 'Last name is too long'),
  email: z.string().email('Please enter a valid email').max(255, 'Email is too long'),
  phone: z.string().optional(),
  interestedConditions: z.array(z.string()).optional(),
  howHeardAboutUs: z.string().optional(),
  consentMarketing: z.boolean().default(false),
  consentTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Terms of Service and Privacy Policy',
  }),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const CONDITIONS = [
  'Chronic Pain',
  'Anxiety',
  'Insomnia',
  'Epilepsy',
  'Multiple Sclerosis',
  'PTSD',
  'Arthritis',
  'Migraines',
  'Other',
];

const HOW_HEARD_OPTIONS = [
  'Search Engine',
  'Social Media',
  'Friend or Family',
  'Healthcare Provider',
  'News Article',
  'Advertisement',
  'Other',
];

const RegionalRegistration = () => {
  const { regionCode } = useParams<{ regionCode: string }>();
  const navigate = useNavigate();
  const content = regionCode ? getRegionalContent(regionCode) : null;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      consentMarketing: false,
      consentTerms: false,
      interestedConditions: [],
    },
  });

  const consentTerms = watch('consentTerms');
  const consentMarketing = watch('consentMarketing');

  const toggleCondition = (condition: string) => {
    const updated = selectedConditions.includes(condition)
      ? selectedConditions.filter((c) => c !== condition)
      : [...selectedConditions, condition];
    setSelectedConditions(updated);
    setValue('interestedConditions', updated);
  };

  const onSubmit = async (data: RegistrationFormData) => {
    if (!content) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('regional_registrations').insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone || null,
        region_code: content.code,
        region_name: content.name,
        interested_conditions: data.interestedConditions || [],
        how_heard_about_us: data.howHeardAboutUs || null,
        consent_marketing: data.consentMarketing,
        consent_terms: data.consentTerms,
        notification_preferences: { email: true, sms: !!data.phone },
        language: navigator.language?.split('-')[0] || 'en',
        source_page: `/register/${regionCode}`,
      });

      if (error) {
        if (error.code === '23505') {
          toast.error('This email is already registered for this region.');
          return;
        }
        throw error;
      }

      setIsSuccess(true);
      toast.success('Registration successful!');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Region Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The region "{regionCode}" is not available for registration.
            </p>
            <Button asChild>
              <Link to="/">Return to Global</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6"
              >
                <Check className="h-10 w-10 text-primary" />
              </motion.div>
              
              <h1 className="text-2xl font-bold mb-2">You're on the list!</h1>
              <p className="text-4xl mb-4">{content.flag}</p>
              <p className="text-muted-foreground mb-6">
                Thank you for registering your interest in Healing Buds {content.name}. 
                We'll notify you as soon as we launch in your region.
              </p>
              
              <div className="flex flex-col gap-3">
                <Button asChild>
                  <Link to="/">Return to Global</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`/preview/${regionCode}`}>Back to {content.name} Preview</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={hbLogo} alt="Healing Buds" className="h-10" />
            <span className="text-2xl">{content.flag}</span>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-primary-foreground hover:bg-primary-foreground/10">
            <Link to={`/preview/${regionCode}`} className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Preview
            </Link>
          </Button>
        </div>
      </header>

      {/* Registration Form */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">{content.flag}</span>
            <h1 className="text-3xl font-bold mb-2">Register Your Interest</h1>
            <p className="text-muted-foreground">
              Be the first to know when Healing Buds launches in {content.name}
            </p>
          </div>

          <Card>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary mb-4">
                    <User className="h-5 w-5" />
                    <h2 className="font-semibold">Personal Information</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        {...register('firstName')}
                        placeholder="Enter your first name"
                        className={errors.firstName ? 'border-destructive' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive">{errors.firstName.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        {...register('lastName')}
                        placeholder="Enter your last name"
                        className={errors.lastName ? 'border-destructive' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="Enter your email address"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number (optional)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Health Interests */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary mb-4">
                    <Heart className="h-5 w-5" />
                    <h2 className="font-semibold">Health Interests (optional)</h2>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    Which conditions are you interested in learning more about?
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {CONDITIONS.map((condition) => (
                      <div
                        key={condition}
                        onClick={() => toggleCondition(condition)}
                        className={`
                          p-3 rounded-lg border cursor-pointer transition-all text-sm
                          ${selectedConditions.includes(condition)
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`
                            h-4 w-4 rounded border flex items-center justify-center
                            ${selectedConditions.includes(condition)
                              ? 'bg-primary border-primary'
                              : 'border-muted-foreground'
                            }
                          `}>
                            {selectedConditions.includes(condition) && (
                              <Check className="h-3 w-3 text-primary-foreground" />
                            )}
                          </div>
                          <span>{condition}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How Did You Hear About Us */}
                <div className="space-y-4">
                  <Label htmlFor="howHeard">How did you find us? (optional)</Label>
                  <Select onValueChange={(value) => setValue('howHeardAboutUs', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {HOW_HEARD_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Consent & Notifications */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary mb-4">
                    <Bell className="h-5 w-5" />
                    <h2 className="font-semibold">Consent & Notifications</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="consentMarketing"
                        checked={consentMarketing}
                        onCheckedChange={(checked) => setValue('consentMarketing', checked === true)}
                      />
                      <Label htmlFor="consentMarketing" className="text-sm leading-relaxed cursor-pointer">
                        I would like to receive updates, news, and marketing communications from Healing Buds about the {content.name} launch and other relevant information.
                      </Label>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="consentTerms"
                        checked={consentTerms}
                        onCheckedChange={(checked) => setValue('consentTerms', checked === true)}
                        className={errors.consentTerms ? 'border-destructive' : ''}
                      />
                      <div>
                        <Label htmlFor="consentTerms" className="text-sm leading-relaxed cursor-pointer">
                          I accept the{' '}
                          <Link to="/terms-of-service" className="text-primary hover:underline" target="_blank">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy-policy" className="text-primary hover:underline" target="_blank">
                            Privacy Policy
                          </Link>{' '}
                          *
                        </Label>
                        {errors.consentTerms && (
                          <p className="text-sm text-destructive mt-1">{errors.consentTerms.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    'Register My Interest'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default RegionalRegistration;