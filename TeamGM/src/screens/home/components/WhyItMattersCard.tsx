import React from 'react';

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { SectionHeader } from '@/screens/home/components/SectionHeader';

const COPY = {
  title: 'Why Tonight Matters',
  icon: 'alert-circle-outline',
  iconColor: '#fbbf24',
} as const;

type Props = {
  reasons: string[];
};

// Why-it-matters bullet list card
export function WhyItMattersCard({ reasons }: Props) {
  return (
    <Box className="rounded-xl border border-teamgm-border bg-teamgm-secondary p-4">
      <SectionHeader icon={COPY.icon} iconColor={COPY.iconColor} title={COPY.title} />
      <VStack space="sm">
        {reasons.map((reason) => (
          <HStack key={reason} className="items-start gap-2">
            <Text size="xs" className="text-teamgm-accent">
              •
            </Text>
            <Text size="xs" className="flex-1 text-teamgm-text-muted">
              {reason}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
