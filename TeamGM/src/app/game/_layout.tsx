import { Stack } from 'expo-router';
import React from 'react';

// Stack for game detail screens pushed from the scores tab
export default function GameLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
