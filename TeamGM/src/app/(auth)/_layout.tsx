import { Stack } from 'expo-router';
import React from 'react';

// Auth stack — login and sign-up (file-based routes)
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
