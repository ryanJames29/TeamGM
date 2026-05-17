import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { TAB_COPY } from '@/constants/copy';
import { AppBackground, Colors, TabBarBackground } from '@/constants/theme';

const TAB_BAR_CONTENT_HEIGHT = 52;

// Solid background layer for the bottom tab bar
function TabBarBackgroundView() {
  return <Box className="absolute inset-0 bg-teamgm-tab-bar" />;
}

// Root bottom tab navigator
export default function TabLayout() {
  const colors = Colors.dark;
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;
  const tabBarHeight = TAB_BAR_CONTENT_HEIGHT + bottomInset;
  const tabBarIconMarginTop = Platform.OS === 'ios' ? 2 : 0;
  const tabBarLabelMarginBottom = Platform.OS === 'ios' ? 0 : 2;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarBackground: TabBarBackgroundView,
        sceneStyle: { backgroundColor: AppBackground },
        tabBarItemStyle: {
          height: TAB_BAR_CONTENT_HEIGHT,
          justifyContent: 'center',
          paddingVertical: 0,
        },
        tabBarIconStyle: {
          marginTop: tabBarIconMarginTop,
        },
        tabBarLabelStyle: {
          marginTop: 2,
          marginBottom: tabBarLabelMarginBottom,
        },
        tabBarStyle: {
          backgroundColor: TabBarBackground,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: AppBackground,
          elevation: 0,
          shadowOpacity: 0,
          height: tabBarHeight,
          paddingTop: 6,
          paddingBottom: bottomInset,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: TAB_COPY.home.title,
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scores"
        options={{
          title: TAB_COPY.scores.title,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mygm"
        options={{
          title: TAB_COPY.mygm.title,
          tabBarIcon: ({ color, size }) => <Ionicons name="clipboard" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: TAB_COPY.profile.title,
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
