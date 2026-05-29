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

export default function SignUpScreen() {
  const { signUp, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(async () => {
    const emailError = validateAuthEmail(email);
    const passwordError = validateAuthPassword(password);
    const passwordsMatch = password === confirmPassword;

    if (emailError || passwordError || !passwordsMatch) {
      setSuccessMessage(null);
      setErrorMessage(
        emailError ?? passwordError ?? (passwordsMatch ? null : AUTH_COPY.passwordsMismatch),
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const { error, needsEmailConfirmation } = await signUp(email, password);

    if (error) {
      setErrorMessage(getAuthErrorMessage(error, AUTH_COPY.signUpFailed));
    } else if (needsEmailConfirmation) {
      setSuccessMessage(AUTH_COPY.checkEmail);
    }

    setIsSubmitting(false);
  }, [confirmPassword, email, password, signUp]);

  const configError = !isConfigured ? AUTH_COPY.supabaseMissing : null;
  const displayError = configError ?? errorMessage;
  const isDisabled = isSubmitting || !isConfigured;

  return (
    <AuthScreenShell title={AUTH_COPY.signUpTitle} subtitle={AUTH_COPY.signUpSubtitle}>
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
        autoComplete="new-password"
        textContentType="newPassword"
        editable={!isSubmitting}
      />

      <AuthTextField
        label={AUTH_COPY.confirmPasswordLabel}
        placeholder={AUTH_COPY.confirmPasswordPlaceholder}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        editable={!isSubmitting}
      />

      {displayError ? (
        <Text size="sm" className="text-teamgm-accent">
          {displayError}
        </Text>
      ) : null}

      {successMessage ? (
        <Text size="sm" className="text-teamgm-info">
          {successMessage}
        </Text>
      ) : null}

      <Button
        onPress={() => void onSubmit()}
        isDisabled={isDisabled}
        className="rounded-lg bg-teamgm-accent data-[active=true]:bg-teamgm-accent-strong">
        {isSubmitting ? <ButtonSpinner color="#fdf0d5" /> : null}
        <ButtonText className="text-teamgm-text-primary">
          {isSubmitting ? AUTH_COPY.signingUp : AUTH_COPY.signUp}
        </ButtonText>
      </Button>

      <VStack space="xs" className="items-center pt-2">
        <Text size="sm" className="text-teamgm-text-muted">
          {AUTH_COPY.alreadyHaveAccount}
        </Text>
        <Link href="/login" asChild>
          <Button variant="link" action="primary" isDisabled={isSubmitting}>
            <ButtonText className="text-teamgm-info">{AUTH_COPY.signIn}</ButtonText>
          </Button>
        </Link>
      </VStack>
    </AuthScreenShell>
  );
}
