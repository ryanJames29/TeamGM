import { AUTH_COPY } from '@/constants/copy';

/** Map Supabase auth errors to user-facing copy. */
export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') {
    return fallback;
  }

  const message =
    'message' in error && typeof error.message === 'string' ? error.message.trim() : '';

  if (!message) {
    return fallback;
  }

  const lower = message.toLowerCase();

  if (lower.includes('invalid login credentials')) {
    return 'Incorrect email or password.';
  }

  if (lower.includes('user already registered')) {
    return 'An account with this email already exists.';
  }

  if (lower.includes('email not confirmed')) {
    return 'Confirm your email before signing in.';
  }

  if (lower.includes('password')) {
    return message;
  }

  return message || fallback;
}

export function validateAuthEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return AUTH_COPY.emailRequired;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return AUTH_COPY.emailInvalid;
  }

  return null;
}

export function validateAuthPassword(password: string): string | null {
  if (!password) {
    return AUTH_COPY.passwordRequired;
  }

  if (password.length < 6) {
    return AUTH_COPY.passwordTooShort;
  }

  return null;
}
