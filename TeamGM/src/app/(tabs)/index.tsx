import * as Device from 'expo-device';
import React from 'react';
import { Platform } from 'react-native';

import { AnimatedIcon } from '@/components/animated-icon';
import { ScreenShell } from '@/components/screen-shell';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { WebBadge } from '@/components/web-badge';
import { HOME_COPY } from '@/constants/copy';

// Resolves the dev menu hint for the current platform
function getDevMenuHint() {
  const isWeb = Platform.OS === 'web';
  const isPhysicalDevice = Device.isDevice;
  const isAndroid = Platform.OS === 'android';

  if (isWeb) {
    return HOME_COPY.devMenuWeb;
  }

  if (isPhysicalDevice) {
    return null;
  }

  return isAndroid ? HOME_COPY.devMenuAndroidShortcut : HOME_COPY.devMenuIosShortcut;
}

// Home tab with starter hints
export default function HomeScreen() {
  const devMenuHint = getDevMenuHint();
  const showWebBadge = Platform.OS === 'web';
  const showDeviceDevHint = Device.isDevice && Platform.OS !== 'web';

  return (
    <ScreenShell>
      <Box className="flex-1 items-center justify-center gap-4 px-4">
        <AnimatedIcon />
        <Text size="4xl" bold className="text-center text-teamgm-text-primary">
          {HOME_COPY.welcomeTitle}
        </Text>
      </Box>

      <Text size="xs" bold className="uppercase text-teamgm-text-primary">
        {HOME_COPY.getStarted}
      </Text>

      <Box className="w-full gap-3 rounded-3xl bg-teamgm-surface px-4 py-6">
        <Box className="gap-1">
          <Text size="sm" bold className="text-teamgm-text-primary">
            {HOME_COPY.tryEditingTitle}
          </Text>
          <Text size="xs" className="font-mono text-teamgm-text-muted">
            {HOME_COPY.tryEditingHint}
          </Text>
        </Box>

        <Box className="gap-1">
          <Text size="sm" bold className="text-teamgm-text-primary">
            {HOME_COPY.devToolsTitle}
          </Text>
          {devMenuHint !== null && (
            <Text size="xs" className="text-teamgm-text-muted">
              {HOME_COPY.devMenuSimulatorPrefix}{' '}
              <Text size="xs" className="font-mono text-teamgm-text-muted">
                {devMenuHint}
              </Text>
            </Text>
          )}
          {showDeviceDevHint && (
            <Text size="xs" className="text-teamgm-text-muted">
              {HOME_COPY.devMenuDeviceShake}{' '}
              <Text size="xs" className="font-mono text-teamgm-text-muted">
                {HOME_COPY.devMenuDeviceKey}
              </Text>{' '}
              {HOME_COPY.devMenuDeviceSuffix}
            </Text>
          )}
        </Box>

        <Box className="gap-1">
          <Text size="sm" bold className="text-teamgm-text-primary">
            {HOME_COPY.freshStartTitle}
          </Text>
          <Text size="xs" className="font-mono text-teamgm-text-muted">
            {HOME_COPY.freshStartHint}
          </Text>
        </Box>
      </Box>

      {showWebBadge && <WebBadge />}
    </ScreenShell>
  );
}
