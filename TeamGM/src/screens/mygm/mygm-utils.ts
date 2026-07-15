import { MYGM_COPY } from '@/constants/mygm-copy';
import type { MyGmRosterPlayer, MyGmStaffMember } from '@/store/api';

export type RosterGroup = 'F' | 'D' | 'G';

export const ROSTER_GROUPS: readonly RosterGroup[] = ['F', 'D', 'G'];

const GROUP_LABELS: Record<RosterGroup, string> = {
  F: MYGM_COPY.forwards,
  D: MYGM_COPY.defence,
  G: MYGM_COPY.goalies,
};

const STAFF_ROLE_LABELS: Record<string, string> = {
  general_manager: MYGM_COPY.generalManager,
  head_coach: MYGM_COPY.headCoach,
  assistant_coach: 'Assistant Coach',
  goaltending_coach: 'Goaltending Coach',
  video_coach: 'Video Coach',
  assistant_general_manager: 'Assistant General Manager',
  president_of_hockey_ops: 'President of Hockey Operations',
};

// Formats integer cents as compact US dollars
export function formatCompactCurrency(cents: number | null | undefined): string {
  if (cents == null) {
    return '—';
  }

  const dollars = cents / 100;
  if (Math.abs(dollars) >= 1_000_000) {
    const millions = dollars / 1_000_000;
    const decimals = Number.isInteger(millions) ? 0 : 1;
    return `$${millions.toFixed(decimals)}M`;
  }

  if (Math.abs(dollars) >= 1_000) {
    return `$${Math.round(dollars / 1_000)}K`;
  }

  return `$${Math.round(dollars)}`;
}

// Formats integer cents as full US dollars
export function formatCurrency(cents: number | null | undefined): string {
  if (cents == null) {
    return '—';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

// Clamps a ratio to a display-safe percentage
export function getPercent(value: number | null | undefined, total: number | null | undefined): number {
  if (!value || !total || total <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, (value / total) * 100));
}

// Groups roster rows into forwards, defence, and goalies
export function groupRoster(roster: MyGmRosterPlayer[]): Record<RosterGroup, MyGmRosterPlayer[]> {
  return roster.reduce<Record<RosterGroup, MyGmRosterPlayer[]>>(
    (groups, player) => {
      const group = player.position_group;
      if (group === 'F' || group === 'D' || group === 'G') {
        groups[group].push(player);
      }
      return groups;
    },
    { F: [], D: [], G: [] },
  );
}

// Returns the user-facing name for a roster group
export function getRosterGroupLabel(group: RosterGroup): string {
  return GROUP_LABELS[group];
}

// Returns the user-facing label for a staff role
export function getStaffRoleLabel(role: string | null): string {
  if (!role) {
    return MYGM_COPY.staffRoleFallback;
  }

  return STAFF_ROLE_LABELS[role] ?? MYGM_COPY.staffRoleFallback;
}

// Finds the first current staff member matching a role
export function findStaffMember(staff: MyGmStaffMember[], role: string): MyGmStaffMember | null {
  return staff.find((member) => member.staff_role === role) ?? null;
}

// Builds a compact display of a player's listed positions
export function formatPositions(player: MyGmRosterPlayer): string {
  const positions = [
    player.primary_position,
    ...(player.secondary_positions ?? []),
  ].filter((position): position is string => Boolean(position));

  return positions.length > 0 ? positions.join(' / ') : '—';
}

// Builds the contract duration label
export function formatYearsRemaining(yearsRemaining: number | null): string {
  if (yearsRemaining == null) {
    return MYGM_COPY.noContract;
  }

  const unit = yearsRemaining === 1 ? MYGM_COPY.year : MYGM_COPY.years;
  return `${yearsRemaining} ${unit}`;
}
