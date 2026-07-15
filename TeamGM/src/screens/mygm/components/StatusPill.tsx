import React from 'react';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

type StatusPillProps = {
  label: string;
  tone?: 'accent' | 'info' | 'neutral';
};

// Small semantic label for captaincy, clauses, and contract state
export function StatusPill({ label, tone = 'neutral' }: StatusPillProps) {
  const toneClassName =
    tone === 'accent'
      ? 'border-teamgm-accent/60 bg-teamgm-accent/15'
      : tone === 'info'
        ? 'border-teamgm-info/60 bg-teamgm-info/15'
        : 'border-teamgm-border bg-teamgm-surface';
  const textClassName =
    tone === 'accent'
      ? 'text-teamgm-accent'
      : tone === 'info'
        ? 'text-teamgm-info'
        : 'text-teamgm-text-muted';

  return (
    <Box className={`rounded-full border px-2 py-1 ${toneClassName}`}>
      <Text size="2xs" bold className={textClassName}>
        {label}
      </Text>
    </Box>
  );
}
