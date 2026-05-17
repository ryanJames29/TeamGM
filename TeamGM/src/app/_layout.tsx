import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { AppBackground, Surface } from '@/constants/theme';
import '@/global.css';
import { MAIN_TAB_OPTIONS } from '@/navigation/tab-options';
import { useTabScreenOptions } from '@/navigation/tab-screen-options';

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: AppBackground,
    card: AppBackground,
    border: Surface,
  },
};

// Root layout: providers + bottom tabs (Expo Router must render <Tabs> here)
export default function RootLayout() {
  const screenOptions = useTabScreenOptions();

  return (
    <GluestackUIProvider mode="dark">
      <ThemeProvider value={navigationTheme}>
        <StatusBar style="light" />
        <AnimatedSplashOverlay />
        <Tabs screenOptions={screenOptions}>
          <Tabs.Screen name="index" options={MAIN_TAB_OPTIONS.index} />
          <Tabs.Screen name="scores" options={MAIN_TAB_OPTIONS.scores} />
          <Tabs.Screen name="mygm" options={MAIN_TAB_OPTIONS.mygm} />
          <Tabs.Screen name="profile" options={MAIN_TAB_OPTIONS.profile} />
        </Tabs>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
