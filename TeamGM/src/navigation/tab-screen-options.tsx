import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { TAB_BAR_CONTENT_HEIGHT } from '@/constants/tabs';
import { AppBackground, Border, Colors } from '@/constants/theme';

// Tab bar background layer (React Navigation tabBarBackground slot)
function TabBarBackgroundLayer() {
  return <Box className="absolute inset-0 bg-teamgm-app" />;
}

// Screen options shared by every bottom tab (like tab navigator screenOptions)
export function useTabScreenOptions() {
  const colors = Colors.dark;
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;
  const tabBarHeight = TAB_BAR_CONTENT_HEIGHT + bottomInset;
  const tabBarIconMarginTop = Platform.OS === 'ios' ? 2 : 0;
  const tabBarLabelMarginBottom = Platform.OS === 'ios' ? 0 : 2;

  return {
    headerShown: false,
    tabBarActiveTintColor: colors.text,
    tabBarInactiveTintColor: colors.textSecondary,
    tabBarBackground: TabBarBackgroundLayer,
    sceneStyle: { backgroundColor: AppBackground },
    tabBarItemStyle: {
      height: TAB_BAR_CONTENT_HEIGHT,
      justifyContent: 'center' as const,
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
      backgroundColor: AppBackground,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Border,
      elevation: 0,
      shadowOpacity: 0,
      height: tabBarHeight,
      paddingTop: 6,
      paddingBottom: bottomInset,
    },
  };
}
