-- Drop unused tables for corporate site cleanup
-- Keep only: dispensary_notifications, strains

-- Drop tables (CASCADE drops associated policies, triggers, etc.)
DROP TABLE IF EXISTS public.drgreen_clients CASCADE;
DROP TABLE IF EXISTS public.drgreen_cart CASCADE;
DROP TABLE IF EXISTS public.drgreen_orders CASCADE;
DROP TABLE IF EXISTS public.dosage_logs CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.prescription_documents CASCADE;

-- Drop the handle_new_user function (was for profiles)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Drop the has_role function (was for user_roles)
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;

-- Drop the app_role enum type
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Update strains table - remove admin policy, keep public read only
DROP POLICY IF EXISTS "Admins can manage strains" ON public.strains;

-- Ensure public SELECT policy exists
DROP POLICY IF EXISTS "Anyone can view strains" ON public.strains;
CREATE POLICY "Anyone can view strains" 
ON public.strains 
FOR SELECT 
USING (is_archived = false);