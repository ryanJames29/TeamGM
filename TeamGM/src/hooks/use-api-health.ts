import { useCallback, useState } from 'react';

import {
  ApiClientError,
  type ApiHealthResponse,
  fetchApiHealth,
} from '@/services/api-client';

type ApiHealthState = {
  data: ApiHealthResponse | null;
  error: string | null;
  isLoading: boolean;
  hasChecked: boolean;
};

// Manual health check against GET /api/v1/health (triggered from Profile button)
export function useApiHealth() {
  const [state, setState] = useState<ApiHealthState>({
    data: null,
    error: null,
    isLoading: false,
    hasChecked: false,
  });

  const check = useCallback(async () => {
    setState({ data: null, error: null, isLoading: true, hasChecked: true });

    try {
      const data = await fetchApiHealth();
      setState({ data, error: null, isLoading: false, hasChecked: true });
    } catch (err) {
      const message =
        err instanceof ApiClientError ? err.message : 'Unknown error while contacting the API.';
      setState({ data: null, error: message, isLoading: false, hasChecked: true });
    }
  }, []);

  return { ...state, check };
}
