import { useCallback, useEffect, useState } from 'react';

import type { MockGame } from '@/mock-data/types/scores';
import {
  ApiClientError,
  type NhlScoresResponse,
  fetchNhlScores,
} from '@/services/api-client';

type NhlScoresState = {
  games: MockGame[];
  leagueName: string | null;
  message: string | null;
  error: string | null;
  isLoading: boolean;
};

export function useNhlScores(enabled: boolean) {
  const [state, setState] = useState<NhlScoresState>({
    games: [],
    leagueName: null,
    message: null,
    error: null,
    isLoading: false,
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data: NhlScoresResponse = await fetchNhlScores();
      setState({
        games: data.games,
        leagueName: data.league?.name ?? 'NHL',
        message: data.message,
        error: null,
        isLoading: false,
      });
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : 'Could not load NHL scores.';
      setState({
        games: [],
        leagueName: null,
        message: null,
        error: message,
        isLoading: false,
      });
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    void load();
  }, [enabled, load]);

  return { ...state, reload: load };
}
