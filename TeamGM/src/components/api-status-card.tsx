import React from 'react';

import { Button, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { API_BASE_URL } from '@/constants/api';
import { useApiHealth } from '@/hooks/use-api-health';

const API_STATUS_COPY = {
  title: 'API connection',
  baseUrl: 'Base URL',
  status: 'Status',
  notChecked: 'Not checked yet',
  checking: 'Checking…',
  connected: 'Connected',
  failed: 'Failed',
  checkButton: 'Check API health',
  missingEnv:
    'Set EXPO_PUBLIC_API_URL in .env (e.g. http://127.0.0.1:8000) and restart Expo.',
} as const;

type StatusRowProps = {
  label: string;
  value: string;
};

// Single label/value row in the API status card
function StatusRow({ label, value }: StatusRowProps) {
  return (
    <HStack className="justify-between gap-4">
      <Text size="xs" className="text-teamgm-text-muted">
        {label}
      </Text>
      <Text size="xs" className="flex-1 text-right text-teamgm-text-primary">
        {value}
      </Text>
    </HStack>
  );
}

// Profile card with a button to ping the LLM API health endpoint
export function ApiStatusCard() {
  const { data, error, isLoading, hasChecked, check } = useApiHealth();

  const hasBaseUrl = Boolean(API_BASE_URL);

  const statusLabel = !hasChecked
    ? API_STATUS_COPY.notChecked
    : isLoading
      ? API_STATUS_COPY.checking
      : error
        ? API_STATUS_COPY.failed
        : API_STATUS_COPY.connected;

  return (
    <Box className="rounded-xl border border-teamgm-border bg-teamgm-secondary p-4">
      <Text size="sm" bold className="mb-3 text-teamgm-text-primary">
        {API_STATUS_COPY.title}
      </Text>
      <VStack space="sm" className="mb-4">
        <StatusRow
          label={API_STATUS_COPY.baseUrl}
          value={hasBaseUrl ? API_BASE_URL : API_STATUS_COPY.missingEnv}
        />
        <StatusRow label={API_STATUS_COPY.status} value={statusLabel} />
        {data?.message ? (
          <Text size="xs" className="text-green-400">
            {data.message}
          </Text>
        ) : null}
        {error ? (
          <Text size="xs" className="text-teamgm-accent">
            {error}
          </Text>
        ) : null}
      </VStack>
      <Button size="sm" onPress={() => void check()} isDisabled={isLoading || !hasBaseUrl}>
        <ButtonText>{API_STATUS_COPY.checkButton}</ButtonText>
      </Button>
    </Box>
  );
}
