-- Create table for dispensary launch notifications
CREATE TABLE public.dispensary_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  region TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notified_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(email, region)
);

-- Enable Row Level Security
ALTER TABLE public.dispensary_notifications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public signup)
CREATE POLICY "Anyone can sign up for notifications" 
ON public.dispensary_notifications 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated admins can view/manage notifications
CREATE POLICY "Admins can view notifications" 
ON public.dispensary_notifications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Create index for efficient queries by region
CREATE INDEX idx_dispensary_notifications_region ON public.dispensary_notifications(region);
CREATE INDEX idx_dispensary_notifications_email ON public.dispensary_notifications(email);