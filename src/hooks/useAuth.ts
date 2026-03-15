import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Profile } from '@/types';

export function useAuth() {
  const [profile, setProfile]   = useState<Profile | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { if (mounted) { setProfile(null); setLoading(false); } return; }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (mounted) { setProfile(data as Profile); setLoading(false); }
    }

    getProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { if (mounted) { setProfile(null); setLoading(false); } return; }
      getProfile();
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  return { profile, loading, isPremium: profile?.plan === 'premium' || profile?.plan === 'business' };
}
