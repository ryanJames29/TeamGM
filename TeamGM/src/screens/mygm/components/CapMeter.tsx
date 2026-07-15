import React from 'react';

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { MYGM_COPY } from '@/constants/mygm-copy';

import { formatCompactCurrency, getPercent } from '../mygm-utils';

type CapMeterProps = {
  capHitCents: number | null;
  capCeilingCents: number | null;
  capSpaceCents: number | null;
};

// Visualizes committed cap against the league ceiling
export function CapMeter({ capHitCents, capCeilingCents, capSpaceCents }: CapMeterProps) {
  const committedPercent =
    capHitCents != null && capCeilingCents != null && capCeilingCents > 0
      ? (capHitCents / capCeilingCents) * 100
      : 0;
  const meterWidthPercent = getPercent(capHitCents, capCeilingCents);
  const isOverCap = (capSpaceCents ?? 0) < 0;
  const isTight = committedPercent >= 95;
  const statusLabel = isOverCap
    ? MYGM_COPY.capStatusOver
    : isTight
      ? MYGM_COPY.capStatusTight
      : MYGM_COPY.capStatusHealthy;
  const fillClassName = isOverCap ? 'bg-teamgm-accent' : 'bg-teamgm-info';
  const statusClassName = isOverCap ? 'text-teamgm-accent' : 'text-teamgm-info';

  return (
    <Box>
      <HStack className="mb-2 items-end justify-between">
        <Box>
          <Text size="xs" className="text-teamgm-text-muted">
            {MYGM_COPY.capCommitted}
          </Text>
          <Text size="2xl" bold className="tabular-nums text-teamgm-text-primary">
            {formatCompactCurrency(capHitCents)}
          </Text>
        </Box>
        <Box className="items-end">
          <Text size="xs" bold className={statusClassName}>
            {statusLabel}
          </Text>
          <Text size="xs" className="tabular-nums text-teamgm-text-muted">
            {committedPercent.toFixed(1)}%
          </Text>
        </Box>
      </HStack>
      <Box className="h-3 overflow-hidden rounded-full border border-teamgm-border/70 bg-teamgm-app">
        <Box
          className={`h-full rounded-full ${fillClassName}`}
          style={{ width: `${meterWidthPercent}%` }}
        />
      </Box>
      <HStack className="mt-2 justify-between">
        <Text size="xs" className="text-teamgm-text-muted">
          {MYGM_COPY.capSpace}
        </Text>
        <Text
          size="xs"
          bold
          className={`tabular-nums ${isOverCap ? 'text-teamgm-accent' : 'text-teamgm-text-primary'}`}>
          {formatCompactCurrency(capSpaceCents)}
        </Text>
      </HStack>
    </Box>
  );
}
