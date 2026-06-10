-- ============================================
-- Run this in Supabase SQL Editor if you get
-- "Database error saving new user" on signup.
-- Safe to run multiple times.
-- ============================================

-- Ensure pgcrypto is enabled (needed for gen_random_bytes)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Replace the invite_token default with a UUID-based token (no pgcrypto dependency)
ALTER TABLE public.households
  ALTER COLUMN invite_token SET DEFAULT replace(gen_random_uuid()::text, '-', '');

-- Replace the trigger function with a robust version
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_household_id UUID;
BEGIN
  INSERT INTO public.households (owner_id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'My') || '''s Household'
  )
  RETURNING id INTO new_household_id;

  INSERT INTO public.profiles (id, email, full_name, avatar_url, currency, household_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'currency', 'USD'),
    new_household_id
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user failed for uid %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
