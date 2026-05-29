import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { AUTH_COPY } from '@/constants/copy';

type AuthScreenShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

// Shared layout wrapper for login and sign-up screens
export function AuthScreenShell({ title, subtitle, children }: AuthScreenShellProps) {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-teamgm-app"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ paddingTop: top, paddingBottom: bottom }}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-center px-6 py-8"
        keyboardShouldPersistTaps="handled">
        <VStack space="lg" className="mx-auto w-full max-w-md">
          <VStack space="xs" className="items-center">
            <Text size="2xl" bold className="text-teamgm-text-primary">
              {AUTH_COPY.appName}
            </Text>
            <Text size="lg" bold className="text-teamgm-text-primary">
              {title}
            </Text>
            <Text size="sm" className="text-center text-teamgm-text-muted">
              {subtitle}
            </Text>
          </VStack>

          <Box className="rounded-xl border border-teamgm-border bg-teamgm-secondary p-5">
            <VStack space="md">{children}</VStack>
          </Box>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
