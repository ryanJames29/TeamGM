import { Link } from 'expo-router';
import React, { useCallback, useState } from 'react';

import { AuthScreenShell } from '@/components/auth/auth-screen-shell';
import { AuthTextField } from '@/components/auth/auth-text-field';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { AUTH_COPY } from '@/constants/copy';
import { useAuth } from '@/contexts/auth-provider';
import {
  getAuthErrorMessage,
  validateAuthEmail,
  validateAuthPassword,
} from '@/utils/get-auth-error-message';

export default function LoginScreen() {
  const { signIn, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(async () => {
    const emailError = validateAuthEmail(email);
    const passwordError = validateAuthPassword(password);

    if (emailError || passwordError) {
      setErrorMessage(emailError ?? passwordError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const { error } = await signIn(email, password);

    if (error) {
      setErrorMessage(getAuthErrorMessage(error, AUTH_COPY.signInFailed));
    }

    setIsSubmitting(false);
  }, [email, password, signIn]);

  const configError = !isConfigured ? AUTH_COPY.supabaseMissing : null;
  const displayError = configError ?? errorMessage;
  const isDisabled = isSubmitting || !isConfigured;

  return (
    <AuthScreenShell heading={AUTH_COPY.signInHeading}>
      <AuthTextField
        label={AUTH_COPY.emailLabel}
        placeholder={AUTH_COPY.emailPlaceholder}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        editable={!isSubmitting}
      />

      <AuthTextField
        label={AUTH_COPY.passwordLabel}
        placeholder={AUTH_COPY.passwordPlaceholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
        textContentType="password"
        editable={!isSubmitting}
      />

      {displayError ? (
        <Text size="sm" className="text-teamgm-accent">
          {displayError}
        </Text>
      ) : null}

      <Button
        onPress={() => void onSubmit()}
        isDisabled={isDisabled}
        action="default"
        className="mt-6 h-14 w-full rounded-full bg-teamgm-info data-[active=true]:opacity-90">
        {isSubmitting ? <ButtonSpinner color="#000000" /> : null}
        <ButtonText className="font-semibold" style={{ color: '#000000' }}>
          {isSubmitting ? AUTH_COPY.signingIn : AUTH_COPY.signIn}
        </ButtonText>
      </Button>

      <HStack space="xs" className="flex-wrap items-center justify-center pt-2">
        <Text size="sm" className="text-teamgm-text-primary">
          {AUTH_COPY.noAccount}
        </Text>
        <Link href="/sign-up" asChild>
          <Button
            variant="link"
            action="default"
            size="sm"
            isDisabled={isSubmitting}
            className="px-0">
            <ButtonText className="text-sm font-normal text-teamgm-info">
              {AUTH_COPY.createAccount}
            </ButtonText>
          </Button>
        </Link>
      </HStack>
    </AuthScreenShell>
  );
}
