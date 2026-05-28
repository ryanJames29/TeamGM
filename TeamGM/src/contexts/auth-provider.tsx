import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { JwtPayload } from '@supabase/supabase-js';

import { isSupabaseConfigured } from '@/constants/supabase';
import { supabase } from '@/lib/supabase/client';

type AuthContextValue = {
  isSignedIn: boolean;
  userId: string | null;
  email: string | null;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null; needsEmailConfirmation: boolean }>;
  signOut: () => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Validates local JWT via getClaims — Supabase React Native auth guide pattern
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [claims, setClaims] = useState<JwtPayload | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    const { data: claimsData } = await supabase.auth.getClaims();
    const nextClaims = claimsData?.claims ?? null;
    setClaims(nextClaims);

    if (nextClaims) {
      const { data: sessionData } = await supabase.auth.getSession();
      setEmail(sessionData.session?.user.email ?? null);
    } else {
      setEmail(null);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    void refreshAuth().finally(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      void refreshAuth();
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [refreshAuth]);

  const signIn = useCallback(async (emailAddress: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: emailAddress.trim(),
      password,
    });

    return { error: error ?? null };
  }, []);

  const signUp = useCallback(async (emailAddress: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: emailAddress.trim(),
      password,
    });

    const needsEmailConfirmation = Boolean(data.user && !data.session);

    return { error: error ?? null, needsEmailConfirmation };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    return { error: error ?? null };
  }, []);

  const userId = typeof claims?.sub === 'string' ? claims.sub : null;
  const isSignedIn = claims !== null;

  const value = useMemo<AuthContextValue>(
    () => ({
      isSignedIn,
      userId,
      email,
      isLoading,
      isConfigured: isSupabaseConfigured,
      signIn,
      signUp,
      signOut,
    }),
    [isSignedIn, userId, email, isLoading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Reads the current auth session and actions from AuthProvider
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
