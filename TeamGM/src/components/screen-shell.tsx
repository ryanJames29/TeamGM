import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { BottomTabInset } from '@/constants/theme';

type ScreenShellProps = {
  children: React.ReactNode;
};

// Centers tab screen content with brand background and safe area padding
export function ScreenShell({ children }: ScreenShellProps) {
  const bottomPadding = BottomTabInset + 16;

  return (
    <Box className="flex-1 flex-row justify-center bg-teamgm-app">
      <SafeAreaView
        className="max-w-[800px] flex-1 items-center justify-center gap-2 px-6"
        style={{ paddingBottom: bottomPadding }}>
        {children}
      </SafeAreaView>
    </Box>
  );
}
