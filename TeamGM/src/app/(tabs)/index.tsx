import React from 'react';

import { HomeTabIcon } from '@/navigation/tab-icons';
import HomeScreen, { HOME_COPY } from '@/screens/home/HomeScreen';

export const options = {
  title: HOME_COPY.title,
  tabBarLabel: HOME_COPY.title,
  tabBarIcon: HomeTabIcon,
};

// Expo Router tab route — delegates to screen module
export default function HomeRoute() {
  return <HomeScreen />;
}
