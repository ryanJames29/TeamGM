import React from 'react';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { SectionHeader } from '@/screens/home/components/SectionHeader';
import type { HomeInsightsResponse } from '@/store/api';

const COPY = {
  title: 'Next Game',
  icon: 'calendar-outline',
  iconColor: '#669bbc',
} as const;

type Props = {
  teamName: string;
  nextGame: HomeInsightsResponse['nextGame'] | null | undefined;
};

// Next game card from cached insight payload
export function NextGameCard({ teamName, nextGame }: Props) {
  const locationSymbol =
    nextGame?.location === 'away' ? '@' : nextGame?.location === 'home' ? 'vs' : '';
  const opponentLabel = nextGame?.opponentAbbreviation || nextGame?.opponentName || '';

  const when = nextGame?.scheduledAt
    ? new Date(nextGame.scheduledAt).toLocaleString(undefined, {
        weekday: 'short',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

  return (
    <Box className="rounded-xl border border-teamgm-border bg-teamgm-secondary p-4">
      <SectionHeader icon={COPY.icon} iconColor={COPY.iconColor} title={COPY.title} />
      <Box className="rounded-lg border border-teamgm-border bg-teamgm-surface p-3">
        <Text size="sm" className="mb-1 text-teamgm-text-primary">
          {teamName} {locationSymbol} {opponentLabel}
        </Text>
        <Text size="xs" className="text-teamgm-text-muted">
          {when}
        </Text>
      </Box>
    </Box>
  );
}
