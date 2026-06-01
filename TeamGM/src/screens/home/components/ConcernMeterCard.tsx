import React from 'react';

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { SectionHeader } from '@/screens/home/components/SectionHeader';

const COPY = {
  title: 'Fan Concern Meter',
  icon: 'alert-circle-outline',
  iconColor: '#fb923c',
} as const;

type Props = {
  level: number;
  description: string;
};

// Fan concern meter card from AI insight
export function ConcernMeterCard({ level, description }: Props) {
  const widthPercent = Math.max(0, Math.min(100, level * 10));

  return (
    <Box className="rounded-xl border border-teamgm-border bg-teamgm-secondary p-4">
      <SectionHeader icon={COPY.icon} iconColor={COPY.iconColor} title={COPY.title} />
      <HStack className="mb-3 items-center gap-3">
        <Box className="h-2 flex-1 overflow-hidden rounded-full bg-teamgm-surface">
          <Box className="h-full bg-teamgm-accent" style={{ width: `${widthPercent}%` }} />
        </Box>
        <Text size="sm" bold className="text-teamgm-text-primary">
          {level}/10
        </Text>
      </HStack>
      <Text size="xs" className="leading-5 text-teamgm-text-muted">
        {description}
      </Text>
    </Box>
  );
}
