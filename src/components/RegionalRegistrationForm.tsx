import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Loader2, User, Mail, Phone, Heart, Bell } from 'lucide-react';
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
import { RegionalContentType } from '@/data/regionalContent';

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

interface RegionalRegistrationFormProps {
  content: RegionalContentType;
  regionCode: string;
}

const RegionalRegistrationForm = ({ content, regionCode }: RegionalRegistrationFormProps) => {
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
        source_page: `/preview/${regionCode}`,
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

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-primary/20">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6"
            >
              <Check className="h-10 w-10 text-primary" />
            </motion.div>
            
            <h3 className="text-2xl font-bold mb-2">You're on the list!</h3>
            <p className="text-4xl mb-4">{content.flag}</p>
            <p className="text-muted-foreground mb-6">
              Thank you for registering your interest in Healing Buds {content.name}. 
              We'll notify you as soon as we launch in your region.
            </p>
            
            <Button variant="outline" asChild>
              <Link to="/">Return to Global</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardContent className="p-6 md:p-8">
        <div className="text-center mb-6">
          <span className="text-4xl mb-3 block">{content.flag}</span>
          <h2 className="text-2xl font-bold mb-2">Register Your Interest</h2>
          <p className="text-muted-foreground text-sm">
            Be the first to know when Healing Buds launches in {content.name}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary mb-3">
              <User className="h-4 w-4" />
              <h3 className="font-semibold text-sm">Personal Information</h3>
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
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Heart className="h-4 w-4" />
              <h3 className="font-semibold text-sm">Health Interests (optional)</h3>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Which conditions are you interested in learning more about?
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {CONDITIONS.map((condition) => (
                <div
                  key={condition}
                  onClick={() => toggleCondition(condition)}
                  className={`
                    p-2.5 rounded-lg border cursor-pointer transition-all text-xs
                    ${selectedConditions.includes(condition)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <div className={`
                      h-3.5 w-3.5 rounded border flex items-center justify-center flex-shrink-0
                      ${selectedConditions.includes(condition)
                        ? 'bg-primary border-primary'
                        : 'border-muted-foreground'
                      }
                    `}>
                      {selectedConditions.includes(condition) && (
                        <Check className="h-2.5 w-2.5 text-primary-foreground" />
                      )}
                    </div>
                    <span>{condition}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How Did You Hear About Us */}
          <div className="space-y-2">
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
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Bell className="h-4 w-4" />
              <h3 className="font-semibold text-sm">Consent & Notifications</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="consentMarketing"
                  checked={consentMarketing}
                  onCheckedChange={(checked) => setValue('consentMarketing', checked === true)}
                />
                <Label htmlFor="consentMarketing" className="text-xs leading-relaxed cursor-pointer">
                  I would like to receive updates and marketing communications from Healing Buds about the {content.name} launch.
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
                  <Label htmlFor="consentTerms" className="text-xs leading-relaxed cursor-pointer">
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
                    <p className="text-xs text-destructive mt-1">{errors.consentTerms.message}</p>
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
  );
};

export default RegionalRegistrationForm;
