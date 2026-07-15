import { Stack } from 'expo-router';
import React from 'react';

// Headerless myGM drill-down stack
export default function MyGmLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
