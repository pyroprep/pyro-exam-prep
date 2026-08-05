"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createSupabaseClient } from "@/lib/supabase";
import type { UserProfile } from "@/lib/schema";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
  refresh: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = await createSupabaseClient();

    // 1. Get the session user
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    setUser(currentUser);

    // 2. Fetch the profile from the `profiles` table
    if (currentUser) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      setProfile(profileData as UserProfile | null);
    } else {
      setProfile(null);
    }

    setLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    const supabase = await createSupabaseClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    // Async setup — the Supabase client is code-split and loaded on demand
    // so it does not block the main thread during initial page load.
    (async () => {
      const supabase = await createSupabaseClient();
      if (cancelled) return;

      // Initial fetch — synchronizes Supabase auth state on mount
      refresh().then(() => {
        if (cancelled) {
          setLoading(true);
        }
      });

      // Listen for auth state changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(() => {
        refresh();
      });
      unsubscribe = () => subscription.unsubscribe();
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, refresh, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}