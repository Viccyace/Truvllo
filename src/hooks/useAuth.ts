import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Profile } from "@/types";

interface AuthCtx {
  profile: Profile | null;
  loading: boolean;
  isPremium: boolean;
}

export const AuthContext = createContext<AuthCtx>({
  profile: null,
  loading: true,
  isPremium: false,
});

export function useAuth() {
  return useContext(AuthContext);
}
