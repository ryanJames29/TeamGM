import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground, Colors, TabBarBackground } from '@/constants/theme';

const TAB_BAR_CONTENT_HEIGHT = 52;

function TabBarBackgroundView() {
  return <View style={[StyleSheet.absoluteFill, styles.tabBarBackground]} />;
}

export default function TabLayout() {
  const colors = Colors.dark;
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;

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
          marginTop: Platform.OS === 'ios' ? 2 : 0,
        },
        tabBarLabelStyle: {
          marginTop: 2,
          marginBottom: Platform.OS === 'ios' ? 0 : 2,
        },
        tabBarStyle: {
          backgroundColor: TabBarBackground,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: AppBackground,
          elevation: 0,
          shadowOpacity: 0,
          height: TAB_BAR_CONTENT_HEIGHT + bottomInset,
          paddingTop: 6,
          paddingBottom: bottomInset,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scores"
        options={{
          title: 'Scores',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mygm"
        options={{
          title: 'myGM',
          tabBarIcon: ({ color, size }) => <Ionicons name="clipboard" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarBackground: {
    backgroundColor: TabBarBackground,
  },
});
