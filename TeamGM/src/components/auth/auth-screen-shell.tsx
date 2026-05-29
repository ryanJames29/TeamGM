import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { AUTH_COPY } from '@/constants/copy';

type AuthScreenShellProps = {
  heading?: string;
  children: React.ReactNode;
};

const TOP_PADDING = 24;
const HEADER_BLOCK_HEIGHT = 36;

// Shared layout wrapper for login and sign-up screens
export function AuthScreenShell({ heading, children }: AuthScreenShellProps) {
  const { top, bottom } = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  // Start heading + fields ~25% down the screen (TeamGM stays pinned at top)
  const formTopPadding = Math.max(
    windowHeight * 0.25 - top - TOP_PADDING - HEADER_BLOCK_HEIGHT,
    16,
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-teamgm-app"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ paddingTop: top, paddingBottom: bottom }}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow px-6 pb-8 pt-6"
        keyboardShouldPersistTaps="handled">
        <VStack className="mx-auto w-full max-w-md">
          <VStack className="items-center">
            <Text size="2xl" bold className="text-center text-teamgm-text-primary">
              {AUTH_COPY.appName}
            </Text>
          </VStack>

          <VStack space="md" style={{ paddingTop: formTopPadding }}>
            {heading ? (
              <Text size="lg" bold className="text-center text-teamgm-text-primary">
                {heading}
              </Text>
            ) : null}
            {children}
          </VStack>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
