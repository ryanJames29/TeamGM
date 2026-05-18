import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import {
  AI_INSIGHTS,
  FAVORITE_TEAMS,
  UPCOMING_GAME,
} from '@/mock-data/home-insights';
import { HomeTabIcon } from '@/navigation/tab-icons';

export const HOME_COPY = {
  title: 'Home',
  yourTeams: 'Your Teams',
  nextGame: 'Next Game',
  whyTonightMatters: 'Why Tonight Matters',
  fanConcernMeter: 'Fan Concern Meter',
  playerTrends: 'Player Trends',
  stockUp: 'Stock Up',
  stockDown: 'Stock Down',
  recentPerformance: 'Recent Performance',
  whatWentRight: 'What went right',
  whatWentWrong: 'What went wrong',
  briefingSuffix: 'Briefing',
} as const;

export const options = {
  title: HOME_COPY.title,
  tabBarLabel: HOME_COPY.title,
  tabBarIcon: HomeTabIcon,
};

type SectionHeaderProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
};

function SectionHeader({ icon, iconColor, title }: SectionHeaderProps) {
  return (
    <HStack className="mb-3 items-center gap-2">
      <Ionicons name={icon} size={16} color={iconColor} />
      <Text size="sm" bold className="text-teamgm-text-primary">
        {title}
      </Text>
    </HStack>
  );
}

export default function HomeScreen() {
  const concernWidthPercent = AI_INSIGHTS.concernLevel.level * 10;

  return (
    <VStack className="flex-1 bg-teamgm-app">
      <ScreenHeader title={HOME_COPY.title} />
      <ScrollView className="flex-1" contentContainerClassName="gap-3 p-3 pb-24">
        <VStack space="xs">
          <Text size="sm" bold className="text-teamgm-text-primary">
            {HOME_COPY.yourTeams}
          </Text>
          <Box className="flex-row flex-wrap gap-2">
            {FAVORITE_TEAMS.map((team) => (
              <Box
                key={`${team.league}-${team.name}`}
                className="w-[48%] rounded-xl border border-teamgm-border bg-teamgm-secondary p-3">
                <Box className="mb-2 self-start rounded bg-teamgm-surface px-2 py-1">
                  <Text size="xs" className="text-teamgm-text-primary">
                    {team.league}
                  </Text>
                </Box>
                <Text size="sm" bold className="mb-1 text-teamgm-text-primary">
                  {team.name}
                </Text>
                <Text size="xs" className="text-teamgm-text-muted">
                  {team.record}
                </Text>
                <Text size="xs" className="text-teamgm-text-muted">
                  {team.standing}
                </Text>
              </Box>
            ))}
          </Box>
        </VStack>

        <Box className="rounded-xl border border-teamgm-border bg-teamgm-secondary p-4">
          <SectionHeader icon="calendar-outline" iconColor="#669bbc" title={HOME_COPY.nextGame} />
          <Box className="rounded-lg border border-teamgm-border bg-teamgm-surface p-3">
            <Text size="sm" className="mb-1 text-teamgm-text-primary">
              {UPCOMING_GAME.team} {UPCOMING_GAME.location} {UPCOMING_GAME.opponent}
            </Text>
            <Text size="xs" className="text-teamgm-text-muted">
              {UPCOMING_GAME.time}
            </Text>
          </Box>
        </Box>

        <Box className="rounded-xl border border-teamgm-border bg-teamgm-secondary p-4">
          <SectionHeader
            icon="alert-circle-outline"
            iconColor="#fbbf24"
            title={HOME_COPY.whyTonightMatters}
          />
          <VStack space="sm">
            {AI_INSIGHTS.whyItMatters.map((reason) => (
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

        <Box className="rounded-xl border border-teamgm-border bg-teamgm-secondary p-4">
          <SectionHeader
            icon="bar-chart-outline"
            iconColor="#4ade80"
            title={`${AI_INSIGHTS.briefing.team} ${HOME_COPY.briefingSuffix}`}
          />
          <Text size="xs" className="mb-3 leading-5 text-teamgm-text-muted">
            {AI_INSIGHTS.briefing.summary}
          </Text>
          <Text size="xs" className="leading-5 text-teamgm-text-muted">
            {AI_INSIGHTS.briefing.context}
          </Text>
        </Box>

        <Box className="rounded-xl border border-teamgm-border bg-teamgm-secondary p-4">
          <SectionHeader
            icon="alert-circle-outline"
            iconColor="#fb923c"
            title={HOME_COPY.fanConcernMeter}
          />
          <HStack className="mb-3 items-center gap-3">
            <Box className="h-2 flex-1 overflow-hidden rounded-full bg-teamgm-surface">
              <Box
                className="h-full bg-teamgm-accent"
                style={{ width: `${concernWidthPercent}%` }}
              />
            </Box>
            <Text size="sm" bold className="text-teamgm-text-primary">
              {AI_INSIGHTS.concernLevel.level}/10
            </Text>
          </HStack>
          <Text size="xs" className="leading-5 text-teamgm-text-muted">
            {AI_INSIGHTS.concernLevel.description}
          </Text>
        </Box>

        <Box className="rounded-xl border border-teamgm-border bg-teamgm-secondary p-4">
          <SectionHeader icon="flame-outline" iconColor="#f87171" title={HOME_COPY.playerTrends} />
          <VStack space="md">
            <VStack space="sm">
              <Text size="xs" bold className="text-green-400">
                {HOME_COPY.stockUp}
              </Text>
              {AI_INSIGHTS.playerTrends.stockUp.map((player) => (
                <Box
                  key={player.name}
                  className="rounded-lg border border-teamgm-border bg-teamgm-surface p-2">
                  <Text size="xs" className="text-teamgm-text-primary">
                    {player.name}
                  </Text>
                  <Text size="xs" className="text-teamgm-text-muted">
                    {player.stat}
                  </Text>
                </Box>
              ))}
            </VStack>
            <VStack space="sm">
              <Text size="xs" bold className="text-red-400">
                {HOME_COPY.stockDown}
              </Text>
              {AI_INSIGHTS.playerTrends.stockDown.map((player) => (
                <Box
                  key={player.name}
                  className="rounded-lg border border-teamgm-border bg-teamgm-surface p-2">
                  <Text size="xs" className="text-teamgm-text-primary">
                    {player.name}
                  </Text>
                  <Text size="xs" className="text-teamgm-text-muted">
                    {player.stat}
                  </Text>
                </Box>
              ))}
            </VStack>
          </VStack>
        </Box>

        <Box className="rounded-xl border border-teamgm-border bg-teamgm-secondary p-4">
          <SectionHeader icon="trophy-outline" iconColor="#c084fc" title={HOME_COPY.recentPerformance} />
          <Box className="rounded-lg border border-teamgm-border bg-teamgm-surface p-3">
            <Text size="xs" bold className="mb-2 text-teamgm-text-primary">
              {AI_INSIGHTS.recentPerformance.headline}
            </Text>
            <Text size="xs" className="mb-3 leading-5 text-teamgm-text-muted">
              {AI_INSIGHTS.recentPerformance.summary}
            </Text>
            <HStack className="gap-2">
              <VStack className="flex-1" space="xs">
                <Text size="xs" className="text-green-400">
                  {HOME_COPY.whatWentRight}
                </Text>
                <Text size="xs" className="text-teamgm-text-muted">
                  {AI_INSIGHTS.recentPerformance.wentRight}
                </Text>
              </VStack>
              <VStack className="flex-1" space="xs">
                <Text size="xs" className="text-teamgm-accent">
                  {HOME_COPY.whatWentWrong}
                </Text>
                <Text size="xs" className="text-teamgm-text-muted">
                  {AI_INSIGHTS.recentPerformance.wentWrong}
                </Text>
              </VStack>
            </HStack>
          </Box>
        </Box>
      </ScrollView>
    </VStack>
  );
}
