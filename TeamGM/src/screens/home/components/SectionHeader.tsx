import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';

export type SectionHeaderProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
};

// Shared section title row for Home insight cards
export function SectionHeader({ icon, iconColor, title }: SectionHeaderProps) {
  return (
    <HStack className="mb-3 items-center gap-2">
      <Ionicons name={icon} size={16} color={iconColor} />
      <Text size="sm" bold className="text-teamgm-text-primary">
        {title}
      </Text>
    </HStack>
  );
}
