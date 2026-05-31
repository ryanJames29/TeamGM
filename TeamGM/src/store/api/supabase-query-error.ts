import type { PostgrestError } from '@supabase/supabase-js';

type SupabaseQueryError = {
  status: 'CUSTOM_ERROR';
  error: string;
  data: PostgrestError | Error;
};

// Maps Supabase/PostgREST failures into RTK Query queryFn error shape
export function toSupabaseQueryError(error: PostgrestError | Error): { error: SupabaseQueryError } {
  return {
    error: {
      status: 'CUSTOM_ERROR',
      error: error.message,
      data: error,
    },
  };
}
