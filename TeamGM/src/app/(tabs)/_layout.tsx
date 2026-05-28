import { Tabs } from 'expo-router';
import React from 'react';

import { options as homeTabOptions } from '@/app/(tabs)/index';
import { options as mygmTabOptions } from '@/app/(tabs)/mygm';
import { options as profileTabOptions } from '@/app/(tabs)/profile';
import { options as scoresTabOptions } from '@/app/(tabs)/scores';
import { useTabScreenOptions } from '@/navigation/tab-screen-options';

// Main app tabs — shown only when authenticated
export default function TabsLayout() {
  const screenOptions = useTabScreenOptions();

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="index" options={homeTabOptions} />
      <Tabs.Screen name="scores" options={scoresTabOptions} />
      <Tabs.Screen name="mygm" options={mygmTabOptions} />
      <Tabs.Screen name="profile" options={profileTabOptions} />
    </Tabs>
  );
}
