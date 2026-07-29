import { createContext, createElement, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, supabaseEnabled } from "@/lib/supabaseClient";
import { syncXpFromCloud, syncNodeProgressFromCloud } from "@/lib/medStore";

export type Profile = {
  id: string;
  display_name: string;
  avatar_emoji: string;
  avatar_url: string | null;
  xp: number;
  weekly_xp: number;
};

type AuthContextValue = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_emoji, avatar_url, xp, weekly_xp, node_progress")
    .eq("id", userId)
    .single();
  if (data) {
    syncXpFromCloud(data.xp ?? 0, data.weekly_xp ?? 0);
    if (data.node_progress && typeof data.node_progress === "object") {
      syncNodeProgressFromCloud(data.node_progress as Record<string, { completedLevels: string[]; correctIds: string[] }>);
    }
  }
  return data ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(supabaseEnabled);

  useEffect(() => {
    if (!supabase) return;

    // reqId garantisce che solo l'ultimo evento auth aggiorna il profilo,
    // evitando race condition tra SIGNED_IN e SIGNED_OUT ravvicinati.
    let reqId = 0;

    supabase.auth.getSession().then(async ({ data }) => {
      try {
        const id = ++reqId;
        setSession(data.session);
        const p = data.session ? await fetchProfile(data.session.user.id) : null;
        if (id === reqId) setProfile(p);
      } finally {
        setLoading(false);
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, next) => {
      const id = ++reqId;
      setSession(next);
      const p = next ? await fetchProfile(next.user.id) : null;
      if (id === reqId) setProfile(p);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session) return;
    setProfile(await fetchProfile(session.user.id));
  }, [session]);

  return createElement(AuthContext.Provider, {
    value: { session, profile, loading, signInWithGoogle, signOut, refreshProfile },
    children,
  });
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
