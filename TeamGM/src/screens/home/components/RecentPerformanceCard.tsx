import React from 'react';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { SectionHeader } from '@/screens/home/components/SectionHeader';

const COPY = {
  title: 'Recent Performance',
  icon: 'trophy-outline',
  iconColor: '#c084fc',
} as const;

type Props = {
  headline: string;
  lastGameSummary: string;
};

// Last-game recap card from AI insight
export function RecentPerformanceCard({ headline, lastGameSummary }: Props) {
  return (
    <Box className="rounded-xl border border-teamgm-border bg-teamgm-secondary p-4">
      <SectionHeader icon={COPY.icon} iconColor={COPY.iconColor} title={COPY.title} />
      <Box className="rounded-lg border border-teamgm-border bg-teamgm-surface p-3">
        <Text size="xs" bold className="mb-2 text-teamgm-text-primary">
          {headline}
        </Text>
        <Text size="xs" className="leading-5 text-teamgm-text-muted">
          {lastGameSummary}
        </Text>
      </Box>
    </Box>
  );
}
