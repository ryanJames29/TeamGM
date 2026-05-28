import { Link } from 'expo-router';
import React, { useCallback, useState } from 'react';

import { AuthScreenShell } from '@/components/auth/auth-screen-shell';
import { AuthTextField } from '@/components/auth/auth-text-field';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
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
    <AuthScreenShell title={AUTH_COPY.loginTitle} subtitle={AUTH_COPY.loginSubtitle}>
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
        className="rounded-lg bg-teamgm-accent data-[active=true]:bg-teamgm-accent-strong">
        {isSubmitting ? <ButtonSpinner color="#fdf0d5" /> : null}
        <ButtonText className="text-teamgm-text-primary">
          {isSubmitting ? AUTH_COPY.signingIn : AUTH_COPY.signIn}
        </ButtonText>
      </Button>

      <VStack space="xs" className="items-center pt-2">
        <Text size="sm" className="text-teamgm-text-muted">
          {AUTH_COPY.noAccount}
        </Text>
        <Link href="/sign-up" asChild>
          <Button variant="link" action="primary" isDisabled={isSubmitting}>
            <ButtonText className="text-teamgm-info">{AUTH_COPY.createAccount}</ButtonText>
          </Button>
        </Link>
      </VStack>
    </AuthScreenShell>
  );
}
