export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

export const API_NHL_GAMES_PATH = '/api/v1/hockey/nhl/games';
export const API_NHL_SYNC_STATUS_PATH = '/api/v1/hockey/nhl/sync-status';
export const API_MLB_GAMES_PATH = '/api/v1/baseball/mlb/games';
export const API_MLB_SYNC_STATUS_PATH = '/api/v1/baseball/mlb/sync-status';
