import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { VStack } from '@/components/ui/vstack';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { Accent, AppBackground, Border } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/contexts/auth-provider';
import { StoreProvider } from '@/store/provider';
import '@/global.css';

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: AppBackground,
    card: AppBackground,
    border: Border,
  },
};

// Gates (tabs) vs (auth) based on Supabase JWT claims
function RootNavigator() {
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <VStack className="flex-1 items-center justify-center bg-teamgm-app">
        <ActivityIndicator color={Accent} size="large" />
      </VStack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="game" />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <StoreProvider>
        <AuthProvider>
          <ThemeProvider value={navigationTheme}>
            <StatusBar style="light" />
            <AnimatedSplashOverlay />
            <RootNavigator />
          </ThemeProvider>
        </AuthProvider>
      </StoreProvider>
    </GluestackUIProvider>
  );
}
