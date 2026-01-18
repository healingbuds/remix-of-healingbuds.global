-- Simplify security for corporate site (no auth/admin UI)
-- Remove unnecessary admin policies

-- Drop admin policies on drgreen_clients (no admin UI)
DROP POLICY IF EXISTS "Admins can update all client fields" ON public.drgreen_clients;
DROP POLICY IF EXISTS "Admins can view all drgreen clients" ON public.drgreen_clients;

-- Drop admin-only view policy on dispensary_notifications (unnecessary complexity)
DROP POLICY IF EXISTS "Only admins can view notifications" ON public.dispensary_notifications;