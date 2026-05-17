import React from 'react';

import { ScreenShell } from '@/components/screen-shell';
import { Text } from '@/components/ui/text';
import { PROFILE_COPY } from '@/constants/copy';

// Profile tab placeholder
export default function ProfileScreen() {
  return (
    <ScreenShell>
      <Text size="4xl" bold className="text-center text-teamgm-text-primary">
        {PROFILE_COPY.title}
      </Text>
      <Text size="md" className="text-center text-teamgm-text-muted">
        {PROFILE_COPY.subtitle}
      </Text>
    </ScreenShell>
  );
}
