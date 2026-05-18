import React from 'react';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { MAJOR_LEAGUES, type MajorLeague } from '@/mock-data/types/scores';

const LEAGUE_LABELS: Record<MajorLeague, string> = {
  nfl: 'NFL',
  nba: 'NBA',
  mlb: 'MLB',
  nhl: 'NHL',
};

type LeagueSelectorProps = {
  selectedLeague: MajorLeague;
  onSelect: (league: MajorLeague) => void;
};

// Horizontal league filter for the scores screen
export function LeagueSelector({ selectedLeague, onSelect }: LeagueSelectorProps) {
  return (
    <Box className="flex-row flex-wrap gap-2">
      {MAJOR_LEAGUES.map((league) => {
        const isSelected = league === selectedLeague;

        return (
          <Button
            key={league}
            size="sm"
            action="secondary"
            variant="solid"
            onPress={() => onSelect(league)}
            className={
              isSelected
                ? 'rounded-full border border-teamgm-accent bg-teamgm-surface-selected'
                : 'rounded-full border border-teamgm-border bg-teamgm-surface'
            }>
            <ButtonText
              size="sm"
              className={
                isSelected ? 'text-teamgm-text-primary' : 'text-teamgm-text-muted'
              }>
              {LEAGUE_LABELS[league]}
            </ButtonText>
          </Button>
        );
      })}
    </Box>
  );
}
