import { Ionicons } from '@expo/vector-icons';
import React, { type ReactNode } from 'react';

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Info } from '@/constants/theme';

type GmCardProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  trailing?: ReactNode;
  children: ReactNode;
};

// Branded card shell shared across myGM surfaces
export function GmCard({ title, icon, trailing, children }: GmCardProps) {
  return (
    <Box className="overflow-hidden rounded-2xl border border-teamgm-border bg-teamgm-secondary">
      <HStack className="items-center justify-between border-b border-teamgm-border/60 px-4 py-3">
        <HStack className="items-center gap-2">
          <Box className="h-8 w-8 items-center justify-center rounded-lg bg-teamgm-surface">
            <Ionicons name={icon} size={17} color={Info} />
          </Box>
          <Text size="sm" bold className="text-teamgm-text-primary">
            {title}
          </Text>
        </HStack>
        {trailing}
      </HStack>
      <Box className="p-4">{children}</Box>
    </Box>
  );
}
