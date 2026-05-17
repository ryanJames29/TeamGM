import React from 'react';

import { ScreenShell } from '@/components/screen-shell';
import { Text } from '@/components/ui/text';
import { SCORES_COPY } from '@/constants/copy';

// Scores tab placeholder
export default function ScoresScreen() {
  return (
    <ScreenShell>
      <Text size="4xl" bold className="text-center text-teamgm-text-primary">
        {SCORES_COPY.title}
      </Text>
      <Text size="md" className="text-center text-teamgm-text-muted">
        {SCORES_COPY.subtitle}
      </Text>
    </ScreenShell>
  );
}
