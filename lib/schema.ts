/**
 * PyroPrep User Schema Definition
 *
 * This file defines the shape of our user profile stored in Supabase.
 * The actual table should be created in your Supabase dashboard with the
 * following SQL, or the mock adapter below can be used for prototyping.
 *
 * ── SQL (run in Supabase SQL Editor) ──────────────────────────────────
 *
 *   CREATE TABLE profiles (
 *     id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 *     email       TEXT NOT NULL,
 *     full_name   TEXT NOT NULL DEFAULT '',
 *     created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
 *     is_premium  BOOLEAN NOT NULL DEFAULT false,
 *     license_track TEXT NOT NULL DEFAULT 'basic'
 *       CHECK (license_track IN ('basic', 'special-effects', 'theatrical'))
 *   );
 *
 *   -- Automatically create a profile row when a new user signs up
 *   CREATE OR REPLACE FUNCTION public.handle_new_user()
 *   RETURNS TRIGGER
 *   LANGUAGE plpgsql
 *   SECURITY DEFINER SET search_path = ''
 *   AS $$
 *   BEGIN
 *     INSERT INTO public.profiles (id, email, full_name)
 *     VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''));
 *     RETURN NEW;
 *   END;
 *   $$;
 *
 *   CREATE TRIGGER on_auth_user_created
 *     AFTER INSERT ON auth.users
 *     FOR EACH ROW
 *     EXECUTE FUNCTION public.handle_new_user();
 *
 * ──────────────────────────────────────────────────────────────────────
 */

export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  is_premium: boolean;
}

/**
 * Default profile values for a new (non-premium) user.
 */
export const DEFAULT_PROFILE: Omit<UserProfile, "id" | "email" | "created_at"> = {
  is_premium: false,
};
