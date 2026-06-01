import { AppState, Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

import { createClient, processLock } from '@supabase/supabase-js';

import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from '@/constants/supabase';

import { supabaseAuthStorage } from './auth-storage';

// https://supabase.com/docs/guides/auth/quickstarts/react-native
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: supabaseAuthStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});

// Refresh session when app returns to foreground (Supabase RN auth guide).
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      void supabase.auth.startAutoRefresh();
    } else {
      void supabase.auth.stopAutoRefresh();
    }
  });
}
