import React from 'react';

import { MYGM_COPY } from '@/constants/mygm-copy';
import { MyGMTabIcon } from '@/navigation/tab-icons';
import MyGMScreen from '@/screens/mygm/MyGMScreen';

export const options = {
  title: MYGM_COPY.title,
  tabBarLabel: MYGM_COPY.title,
  tabBarIcon: MyGMTabIcon,
};

// Thin myGM tab route
export default function MyGMRoute() {
  return <MyGMScreen />;
}
