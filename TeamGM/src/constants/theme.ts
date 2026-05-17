/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

/** Primary app background — TeamGM brand */
export const AppBackground = '#171A21';

function darkenHex(hex: string, amount: number): string {
  const value = hex.replace('#', '');
  const channels = [0, 2, 4].map((i) =>
    Math.max(0, parseInt(value.slice(i, i + 2), 16) - amount),
  );
  return `#${channels.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

/** Slightly darker than the app background */
export const TabBarBackground = darkenHex(AppBackground, 6);

export const Colors = {
  light: {
    text: '#FFFFFF',
    background: AppBackground,
    backgroundElement: '#21262E',
    backgroundSelected: '#2C333F',
    textSecondary: '#9CA3AF',
  },
  dark: {
    text: '#FFFFFF',
    background: AppBackground,
    backgroundElement: '#21262E',
    backgroundSelected: '#2C333F',
    textSecondary: '#9CA3AF',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
