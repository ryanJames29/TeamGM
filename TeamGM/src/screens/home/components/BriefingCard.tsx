import React from 'react';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { SectionHeader } from '@/screens/home/components/SectionHeader';

const COPY = {
  icon: 'bar-chart-outline',
  iconColor: '#4ade80',
  briefingSuffix: 'Briefing',
} as const;

type Props = {
  titleTeam: string;
  summary: string;
  context: string;
  footer: string;
};

// Team briefing card from AI insight
export function BriefingCard({ titleTeam, summary, context, footer }: Props) {
  return (
    <Box className="rounded-xl border border-teamgm-border bg-teamgm-secondary p-4">
      <SectionHeader
        icon={COPY.icon}
        iconColor={COPY.iconColor}
        title={`${titleTeam} ${COPY.briefingSuffix}`}
      />
      <Text size="xs" className="mb-3 leading-5 text-teamgm-text-muted">
        {summary}
      </Text>
      <Text size="xs" className="leading-5 text-teamgm-text-muted">
        {context}
      </Text>
      <Text size="xs" className="mt-2 text-teamgm-text-muted">
        {footer}
      </Text>
    </Box>
  );
}
