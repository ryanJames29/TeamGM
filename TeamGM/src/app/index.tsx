import * as Device from 'expo-device';
import React from 'react';
import { Platform } from 'react-native';

import { AnimatedIcon } from '@/components/animated-icon';
import { ScreenHeader } from '@/components/screen-header';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { WebBadge } from '@/components/web-badge';
import { HOME_COPY, TAB_COPY } from '@/constants/copy';
import { MAIN_TAB_OPTIONS } from '@/navigation/tab-options';

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

export const options = MAIN_TAB_OPTIONS.index;

export default function HomeScreen() {
  const devMenuHint = getDevMenuHint();
  const showWebBadge = Platform.OS === 'web';
  const showDeviceDevHint = Device.isDevice && Platform.OS !== 'web';

  return (
    <VStack className="flex-1 bg-teamgm-app">
      <ScreenHeader title={TAB_COPY.home.title} centered />
      <VStack className="flex-1 p-6">
        <VStack className="flex-1 items-center justify-center" space="lg">
          <AnimatedIcon />
          <Text size="4xl" bold className="text-center text-teamgm-text-primary">
            {HOME_COPY.welcomeTitle}
          </Text>
        </VStack>

        <Text size="xs" bold className="uppercase text-teamgm-text-primary">
          {HOME_COPY.getStarted}
        </Text>

        <Box className="mt-4 w-full rounded-3xl bg-teamgm-surface px-4 py-6">
          <VStack space="md">
            <VStack space="xs">
              <Text size="sm" bold className="text-teamgm-text-primary">
                {HOME_COPY.tryEditingTitle}
              </Text>
              <Text size="xs" className="font-mono text-teamgm-text-muted">
                {HOME_COPY.tryEditingHint}
              </Text>
            </VStack>

            <VStack space="xs">
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
            </VStack>

            <VStack space="xs">
              <Text size="sm" bold className="text-teamgm-text-primary">
                {HOME_COPY.freshStartTitle}
              </Text>
              <Text size="xs" className="font-mono text-teamgm-text-muted">
                {HOME_COPY.freshStartHint}
              </Text>
            </VStack>
          </VStack>
        </Box>

        {showWebBadge && <WebBadge />}
      </VStack>
    </VStack>
  );
}
