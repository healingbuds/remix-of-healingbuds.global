-- Create table for regional registration interest
CREATE TABLE public.regional_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  region_code TEXT NOT NULL,
  region_name TEXT NOT NULL,
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false}'::jsonb,
  interested_conditions TEXT[] DEFAULT '{}'::text[],
  how_heard_about_us TEXT,
  consent_marketing BOOLEAN DEFAULT false,
  consent_terms BOOLEAN NOT NULL DEFAULT false,
  language TEXT DEFAULT 'en',
  source_page TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_email_region UNIQUE(email, region_code)
);

-- Enable RLS
ALTER TABLE public.regional_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (registration form)
CREATE POLICY "Allow public registration" ON public.regional_registrations
  FOR INSERT WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_regional_registrations_updated_at
  BEFORE UPDATE ON public.regional_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();