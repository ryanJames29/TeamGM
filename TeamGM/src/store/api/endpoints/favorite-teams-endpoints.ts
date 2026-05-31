import { supabase } from '@/lib/supabase/client';
import type { MajorLeague, MockTeamScore } from '@/mock-data/types/scores';

import { toSupabaseQueryError } from '../supabase-query-error';
import type { FavoriteTeamRow } from '../types';
import type { TeamgmEndpointBuilder } from '../teamgm-api';

export type ToggleFavoriteTeamArgs = {
  userId: string;
  league: MajorLeague;
  team: Pick<MockTeamScore, 'id' | 'name' | 'abbreviation' | 'record' | 'standing'>;
  isFavorite: boolean;
};

type FavoriteTeamsJoinRow = {
  id: string;
  user_id: string;
  team_id: string;
  sort_order: number;
  created_at: string;
  teams: {
    league: MajorLeague;
    api_sports_team_id: number;
    name: string;
    abbreviation: string;
  } | null;
};

const FAVORITE_TEAMS_SELECT =
  'id, user_id, team_id, sort_order, created_at, teams (league, api_sports_team_id, name, abbreviation)';

// Required by DB check teams_id_format: ^(nfl|nba|mlb|nhl)-[0-9]+$
function teamCatalogId(league: MajorLeague, apiSportsTeamId: number): string {
  return `${league}-${apiSportsTeamId}`;
}

// Resolves teams.id — uses existing catalog row or inserts with the required id format
async function resolveTeamId(
  league: MajorLeague,
  team: Pick<MockTeamScore, 'id' | 'name' | 'abbreviation'>,
): Promise<{ teamId: string } | { error: Error }> {
  const { data: existing, error: lookupError } = await supabase
    .from('teams')
    .select('id')
    .eq('league', league)
    .eq('api_sports_team_id', team.id!)
    .maybeSingle();

  if (lookupError) {
    return { error: lookupError };
  }

  if (existing?.id) {
    return { teamId: existing.id as string };
  }

  const id = teamCatalogId(league, team.id!);

  const { data, error } = await supabase
    .from('teams')
    .insert({
      id,
      league,
      api_sports_team_id: team.id!,
      name: team.name,
      abbreviation: team.abbreviation,
    })
    .select('id')
    .single();

  if (error) {
    return { error };
  }

  return { teamId: data.id as string };
}

// Maps joined user_favorite_teams + teams row into app-facing favorite shape
function mapFavoriteRow(row: FavoriteTeamsJoinRow): FavoriteTeamRow | null {
  if (!row.teams) {
    return null;
  }

  return {
    id: row.id,
    user_id: row.user_id,
    league: row.teams.league,
    api_sports_team_id: row.teams.api_sports_team_id,
    team_name: row.teams.name,
    team_abbreviation: row.teams.abbreviation,
    created_at: row.created_at,
  };
}

// Supabase-backed favorite team read/write (normalized teams + user_favorite_teams)
export function favoriteTeamsEndpoints(builder: TeamgmEndpointBuilder) {
  return {
    getFavoriteTeams: builder.query<FavoriteTeamRow[], string>({
      async queryFn(userId) {
        const { data, error } = await supabase
          .from('user_favorite_teams')
          .select(FAVORITE_TEAMS_SELECT)
          .eq('user_id', userId);

        if (error) {
          return toSupabaseQueryError(error);
        }

        const rows = ((data ?? []) as unknown as FavoriteTeamsJoinRow[])
          .map(mapFavoriteRow)
          .filter((row): row is FavoriteTeamRow => row != null);

        return { data: rows };
      },
      providesTags: (_result, _error, userId) => [{ type: 'FavoriteTeams' as const, id: userId }],
    }),
    toggleFavoriteTeam: builder.mutation<null, ToggleFavoriteTeamArgs>({
      async queryFn({ userId, league, team, isFavorite }) {
        if (team.id == null) {
          return toSupabaseQueryError(new Error('Team id is required to save a favorite.'));
        }

        const teamResult = await resolveTeamId(league, team);

        if ('error' in teamResult) {
          return toSupabaseQueryError(teamResult.error);
        }

        const { teamId } = teamResult;

        if (isFavorite) {
          const { error } = await supabase
            .from('user_favorite_teams')
            .delete()
            .eq('user_id', userId)
            .eq('team_id', teamId);

          if (error) {
            return toSupabaseQueryError(error);
          }

          return { data: null };
        }

        const { data: leagueTeams, error: leagueTeamsError } = await supabase
          .from('teams')
          .select('id')
          .eq('league', league);

        if (leagueTeamsError) {
          return toSupabaseQueryError(leagueTeamsError);
        }

        const leagueTeamIds = (leagueTeams ?? []).map((row) => row.id as string);

        if (leagueTeamIds.length > 0) {
          const { error: clearError } = await supabase
            .from('user_favorite_teams')
            .delete()
            .eq('user_id', userId)
            .in('team_id', leagueTeamIds);

          if (clearError) {
            return toSupabaseQueryError(clearError);
          }
        }

        const { error: insertError } = await supabase.from('user_favorite_teams').insert({
          user_id: userId,
          team_id: teamId,
        });

        if (insertError) {
          return toSupabaseQueryError(insertError);
        }

        return { data: null };
      },
      invalidatesTags: (_result, _error, { userId }) => [{ type: 'FavoriteTeams' as const, id: userId }],
    }),
  };
}
