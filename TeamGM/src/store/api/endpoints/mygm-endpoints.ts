import { supabase } from '@/lib/supabase/client';

import { toSupabaseQueryError } from '../supabase-query-error';
import type { TeamgmEndpointBuilder } from '../teamgm-api';
import type {
  MyGmDashboard,
  MyGmPlayerDetail,
  MyGmPlayerQueryArgs,
} from '../types';

export const MYGM_TEAM_ID = 'nhl-20';

// Supabase-backed myGM dashboard and player detail queries
export const myGmEndpoints = (builder: TeamgmEndpointBuilder) => ({
  getMyGmDashboard: builder.query<MyGmDashboard, void>({
    async queryFn() {
      const { data: capSummary, error: capError } = await supabase
        .from('nhl_team_cap_summary')
        .select('*')
        .eq('team_id', MYGM_TEAM_ID)
        .order('start_year', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (capError) {
        return toSupabaseQueryError(capError);
      }

      if (!capSummary?.season_id) {
        return {
          data: {
            capSummary: capSummary ?? null,
            roster: [],
            staff: [],
          },
        };
      }

      const [rosterResult, staffResult] = await Promise.all([
        supabase
          .from('nhl_roster_with_contracts')
          .select('*')
          .eq('team_id', MYGM_TEAM_ID)
          .eq('season_id', capSummary.season_id)
          .order('position_group')
          .order('full_name'),
        supabase
          .from('nhl_team_staff_current')
          .select('*')
          .eq('team_id', MYGM_TEAM_ID)
          .order('staff_role')
          .order('full_name'),
      ]);

      if (rosterResult.error) {
        return toSupabaseQueryError(rosterResult.error);
      }

      if (staffResult.error) {
        return toSupabaseQueryError(staffResult.error);
      }

      return {
        data: {
          capSummary,
          roster: rosterResult.data ?? [],
          staff: staffResult.data ?? [],
        },
      };
    },
    providesTags: ['MyGm'],
  }),
  getMyGmPlayer: builder.query<MyGmPlayerDetail, MyGmPlayerQueryArgs>({
    async queryFn({ playerId, seasonId }) {
      const [playerResult, statsResult] = await Promise.all([
        supabase
          .from('nhl_roster_with_contracts')
          .select('*')
          .eq('team_id', MYGM_TEAM_ID)
          .eq('season_id', seasonId)
          .eq('player_id', playerId)
          .maybeSingle(),
        supabase
          .from('nhl_player_season_stats')
          .select('*')
          .eq('team_id', MYGM_TEAM_ID)
          .eq('season_id', seasonId)
          .eq('player_id', playerId)
          .maybeSingle(),
      ]);

      if (playerResult.error) {
        return toSupabaseQueryError(playerResult.error);
      }

      if (statsResult.error) {
        return toSupabaseQueryError(statsResult.error);
      }

      return {
        data: {
          player: playerResult.data ?? null,
          stats: statsResult.data ?? null,
        },
      };
    },
    providesTags: (_result, _error, args) => [{ type: 'MyGm', id: args.playerId }],
  }),
});
