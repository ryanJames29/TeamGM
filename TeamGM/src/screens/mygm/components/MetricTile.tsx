import React from 'react';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

type MetricTileProps = {
  label: string;
  value: string;
  accent?: boolean;
  className?: string;
};

// Compact label/value tile for cap and roster metrics
export function MetricTile({ label, value, accent = false, className = '' }: MetricTileProps) {
  const valueClassName = accent ? 'text-teamgm-accent' : 'text-teamgm-text-primary';

  return (
    <Box className={`rounded-xl border border-teamgm-border/70 bg-teamgm-surface p-3 ${className}`}>
      <Text size="xs" className="mb-1 text-teamgm-text-muted">
        {label}
      </Text>
      <Text size="lg" bold className={`tabular-nums ${valueClassName}`}>
        {value}
      </Text>
    </Box>
  );
}
