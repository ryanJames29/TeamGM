import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { StoreProvider } from '@/store/provider';
import { AppBackground, Border } from '@/constants/theme';
import '@/global.css';
import { options as homeTabOptions } from '@/app/index';
import { options as mygmTabOptions } from '@/app/mygm';
import { options as profileTabOptions } from '@/app/profile';
import { options as scoresTabOptions } from '@/app/scores';
import { useTabScreenOptions } from '@/navigation/tab-screen-options';

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: AppBackground,
    card: AppBackground,
    border: Border,
  },
};

export default function RootLayout() {
  const screenOptions = useTabScreenOptions();

  return (
    <GluestackUIProvider mode="dark">
      <StoreProvider>
        <ThemeProvider value={navigationTheme}>
          <StatusBar style="light" />
          <AnimatedSplashOverlay />
          <Tabs screenOptions={screenOptions}>
            <Tabs.Screen name="index" options={homeTabOptions} />
            <Tabs.Screen name="scores" options={scoresTabOptions} />
            <Tabs.Screen name="mygm" options={mygmTabOptions} />
            <Tabs.Screen name="profile" options={profileTabOptions} />
          </Tabs>
        </ThemeProvider>
      </StoreProvider>
    </GluestackUIProvider>
  );
}
