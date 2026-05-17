import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { AppBackground, Surface } from '@/constants/theme';
import '@/global.css';

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: AppBackground,
    card: AppBackground,
    border: Surface,
  },
};

// Root app shell with theme providers and stack navigator
export default function RootLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <ThemeProvider value={navigationTheme}>
        <StatusBar style="light" />
        <AnimatedSplashOverlay />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
