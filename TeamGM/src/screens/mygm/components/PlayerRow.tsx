import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MYGM_COPY } from '@/constants/mygm-copy';
import { Info } from '@/constants/theme';
import type { MyGmRosterPlayer } from '@/store/api';

import { formatCompactCurrency, formatPositions, formatYearsRemaining } from '../mygm-utils';
import { StatusPill } from './StatusPill';

type PlayerRowProps = {
  player: MyGmRosterPlayer;
  onPress: () => void;
  compact?: boolean;
};

// Tappable roster row with contract and position context
export function PlayerRow({ player, onPress, compact = false }: PlayerRowProps) {
  const playerName = player.full_name ?? MYGM_COPY.unknownPlayer;
  const capHit = player.cap_hit_cents == null
    ? MYGM_COPY.noContract
    : formatCompactCurrency(player.cap_hit_cents);
  const contractLabel = formatYearsRemaining(player.years_remaining);
  const showCaptaincy = Boolean(player.captaincy);
  const showLtir = Boolean(player.is_ltir);

  return (
    <Button
      action="default"
      variant="link"
      onPress={onPress}
      accessibilityLabel={playerName}
      className="h-auto w-full justify-start rounded-xl border border-teamgm-border/70 bg-teamgm-surface px-3 py-3">
      <HStack className="w-full items-center gap-3">
        <VStack className="flex-1">
          <HStack className="mb-1 flex-wrap items-center gap-2">
            <Text size="sm" bold className="text-teamgm-text-primary">
              {playerName}
            </Text>
            {showCaptaincy ? <StatusPill label={player.captaincy!} tone="accent" /> : null}
            {showLtir ? <StatusPill label={MYGM_COPY.ltir} tone="info" /> : null}
          </HStack>
          <Text size="xs" className="text-teamgm-text-muted">
            {formatPositions(player)}
            {compact ? null : ` · ${contractLabel}`}
          </Text>
        </VStack>
        <VStack className="items-end">
          <Text size="sm" bold className="tabular-nums text-teamgm-text-primary">
            {capHit}
          </Text>
          <Text size="2xs" className="text-teamgm-text-muted">
            {MYGM_COPY.capHit}
          </Text>
        </VStack>
        <Ionicons name="chevron-forward" size={16} color={Info} />
      </HStack>
    </Button>
  );
}
