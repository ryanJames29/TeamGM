/** Multi-word city prefixes — longest first for correct matching. */
const MULTI_WORD_CITY_PREFIXES = [
  'Los Angeles',
  'San Francisco',
  'St. Louis',
  'Kansas City',
  'New York',
  'Tampa Bay',
  'San Diego',
] as const;

export type TeamDisplayNameLines = {
  city: string;
  nickname: string;
};

// Splits API full name into city line + nickname line (e.g. Carolina / Hurricanes).
export function splitTeamDisplayName(fullName: string): TeamDisplayNameLines {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return { city: '', nickname: '' };
  }

  for (const prefix of MULTI_WORD_CITY_PREFIXES) {
    if (trimmed.startsWith(`${prefix} `)) {
      return {
        city: prefix,
        nickname: trimmed.slice(prefix.length + 1),
      };
    }
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length <= 1) {
    return { city: trimmed, nickname: '' };
  }

  return {
    city: parts[0],
    nickname: parts.slice(1).join(' '),
  };
}
