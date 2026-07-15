import React from 'react';

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MYGM_COPY } from '@/constants/mygm-copy';
import type { MyGmStaffMember } from '@/store/api';

import { getStaffRoleLabel } from '../mygm-utils';

type StaffListProps = {
  staff: MyGmStaffMember[];
};

// Formats a staff start date as a short year label
function formatStartYear(startedOn: string | null): string {
  if (!startedOn) {
    return MYGM_COPY.notAvailable;
  }

  return new Date(`${startedOn}T00:00:00`).getFullYear().toString();
}

// Current front-office and coaching staff list
export function StaffList({ staff }: StaffListProps) {
  return (
    <VStack className="gap-2">
      {staff.map((member) => (
        <HStack
          key={member.staff_id ?? `${member.full_name}-${member.staff_role}`}
          className="items-center justify-between rounded-xl border border-teamgm-border/70 bg-teamgm-surface p-3">
          <VStack className="flex-1">
            <Text size="sm" bold className="text-teamgm-text-primary">
              {member.full_name ?? MYGM_COPY.notAvailable}
            </Text>
            <Text size="xs" className="mt-1 text-teamgm-text-muted">
              {getStaffRoleLabel(member.staff_role)}
              {member.role_detail ? ` · ${member.role_detail}` : null}
            </Text>
          </VStack>
          <Box className="items-end">
            <Text size="2xs" className="text-teamgm-text-muted">
              {MYGM_COPY.since}
            </Text>
            <Text size="xs" bold className="tabular-nums text-teamgm-info">
              {formatStartYear(member.started_on)}
            </Text>
          </Box>
        </HStack>
      ))}
    </VStack>
  );
}
