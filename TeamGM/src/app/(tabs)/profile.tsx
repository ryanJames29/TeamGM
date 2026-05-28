import React, { useCallback, useState } from 'react';

import { ScreenHeader } from '@/components/screen-header';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { AUTH_COPY } from '@/constants/copy';
import { useAuth } from '@/contexts/auth-provider';
import { ProfileTabIcon } from '@/navigation/tab-icons';
import { getAuthErrorMessage } from '@/utils/get-auth-error-message';

export const PROFILE_COPY = {
  title: 'Profile',
  signedInAs: 'Signed in as',
  subtitle: 'Your account and settings will live here.',
} as const;

export const options = {
  title: PROFILE_COPY.title,
  tabBarLabel: PROFILE_COPY.title,
  tabBarIcon: ProfileTabIcon,
};

export default function ProfileScreen() {
  const { email, signOut } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const onSignOut = useCallback(async () => {
    setIsSigningOut(true);
    setErrorMessage(null);

    const { error } = await signOut();

    if (error) {
      setErrorMessage(getAuthErrorMessage(error, AUTH_COPY.signOutFailed));
    }

    setIsSigningOut(false);
  }, [signOut]);

  return (
    <VStack className="flex-1 bg-teamgm-app">
      <ScreenHeader title={PROFILE_COPY.title} />
      <VStack className="flex-1 gap-4 p-6">
        {email ? (
          <VStack space="xs">
            <Text size="sm" className="text-teamgm-text-muted">
              {PROFILE_COPY.signedInAs}
            </Text>
            <Text size="md" bold className="text-teamgm-text-primary">
              {email}
            </Text>
          </VStack>
        ) : (
          <Text size="md" className="text-teamgm-text-muted">
            {PROFILE_COPY.subtitle}
          </Text>
        )}

        {errorMessage ? (
          <Text size="sm" className="text-teamgm-accent">
            {errorMessage}
          </Text>
        ) : null}

        <Button
          onPress={() => void onSignOut()}
          isDisabled={isSigningOut}
          variant="outline"
          className="rounded-lg border-teamgm-border">
          {isSigningOut ? <ButtonSpinner color="#fdf0d5" /> : null}
          <ButtonText className="text-teamgm-text-primary">
            {isSigningOut ? AUTH_COPY.signingOut : AUTH_COPY.signOut}
          </ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
}
