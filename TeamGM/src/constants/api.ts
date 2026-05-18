// Base URL for TeamGM LLM API (set EXPO_PUBLIC_API_URL in .env)
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

export const API_HEALTH_PATH = '/api/v1/health';
export const API_NHL_GAMES_PATH = '/api/v1/hockey/nhl/games';
