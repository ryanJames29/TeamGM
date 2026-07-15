import React from 'react';

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';

import { formatCompactCurrency, getPercent } from '../mygm-utils';

type CapAllocationRowProps = {
  label: string;
  valueCents: number | null;
  totalCents: number | null;
  fillClassName: string;
};

type CapAllocationProps = {
  rows: CapAllocationRowProps[];
};

// Position-group cap row with amount and proportional meter
function CapAllocationRow({
  label,
  valueCents,
  totalCents,
  fillClassName,
}: CapAllocationRowProps) {
  const percent = getPercent(valueCents, totalCents);

  return (
    <Box>
      <HStack className="mb-2 justify-between">
        <Text size="xs" className="text-teamgm-text-muted">
          {label}
        </Text>
        <Text size="xs" bold className="tabular-nums text-teamgm-text-primary">
          {formatCompactCurrency(valueCents)}
        </Text>
      </HStack>
      <Box className="h-1.5 overflow-hidden rounded-full bg-teamgm-app">
        <Box className={`h-full rounded-full ${fillClassName}`} style={{ width: `${percent}%` }} />
      </Box>
    </Box>
  );
}

// Stacked cap allocation meters
export function CapAllocation({ rows }: CapAllocationProps) {
  return (
    <Box className="gap-4">
      {rows.map((row) => (
        <CapAllocationRow key={row.label} {...row} />
      ))}
    </Box>
  );
}
