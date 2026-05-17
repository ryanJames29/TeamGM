import {
  HomeTabIcon,
  MyGMTabIcon,
  ProfileTabIcon,
  ScoresTabIcon,
} from '@/navigation/tab-icons';
import { TAB_COPY } from '@/constants/copy';

// Per-tab options for the bottom tab navigator (tabBarLabel = visible label)
export const MAIN_TAB_OPTIONS = {
  index: {
    title: TAB_COPY.home.title,
    tabBarLabel: TAB_COPY.home.title,
    tabBarIcon: HomeTabIcon,
  },
  scores: {
    title: TAB_COPY.scores.title,
    tabBarLabel: TAB_COPY.scores.title,
    tabBarIcon: ScoresTabIcon,
  },
  mygm: {
    title: TAB_COPY.mygm.title,
    tabBarLabel: TAB_COPY.mygm.title,
    tabBarIcon: MyGMTabIcon,
  },
  profile: {
    title: TAB_COPY.profile.title,
    tabBarLabel: TAB_COPY.profile.title,
    tabBarIcon: ProfileTabIcon,
  },
} as const;
