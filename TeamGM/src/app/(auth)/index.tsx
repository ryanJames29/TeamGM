import { Redirect } from 'expo-router';

// Default auth route → login
export default function AuthIndex() {
  return <Redirect href="/login" />;
}
