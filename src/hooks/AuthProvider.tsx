import { useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase/client";
import { Profile } from "@/types";
import { AuthContext } from "./useAuth";

const CACHE_KEY = "truvllo_profile";

function getCachedProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCachedProfile(p: Profile | null) {
  try {
    if (p) localStorage.setItem(CACHE_KEY, JSON.stringify(p));
    else localStorage.removeItem(CACHE_KEY);
  } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialise from localStorage immediately — no blank frame on refresh
  const [profile, setProfile] = useState<Profile | null>(getCachedProfile);
  const [loading, setLoading] = useState(true);

  function updateProfile(p: Profile | null) {
    setProfile(p);
    setCachedProfile(p);
  }

  useEffect(() => {
    let mounted = true;

    async function loadProfile(userId: string) {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        if (mounted) {
          updateProfile(data as Profile);
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (!session) {
        updateProfile(null);
        setLoading(false);
        return;
      }
      // If we already have cached profile for this user, skip loading state
      const cached = getCachedProfile();
      if (cached && cached.id === session.user.id) {
        setLoading(false);
        // Still refresh in background silently
        loadProfile(session.user.id);
      } else {
        loadProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!mounted) return;
      if (!session) {
        updateProfile(null);
        setLoading(false);
        return;
      }
      loadProfile(session.user.id);
    });

    // Listen for cache clear (e.g. after onboarding completes)
    function handleStorage(e: StorageEvent) {
      if (e.key === "truvllo_profile" && e.newValue === null) {
        // Cache was cleared — reload profile from Supabase
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session && mounted) loadProfile(session.user.id);
        });
      }
    }
    window.addEventListener("storage", handleStorage);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const isPremium = profile?.plan === "premium" || profile?.plan === "business";

  return (
    <AuthContext.Provider value={{ profile, loading, isPremium }}>
      {children}
    </AuthContext.Provider>
  );
}
