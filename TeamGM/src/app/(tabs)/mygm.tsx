import React from 'react';

import { ScreenShell } from '@/components/screen-shell';
import { Text } from '@/components/ui/text';
import { MYGM_COPY } from '@/constants/copy';

// myGM tab placeholder
export default function MyGMScreen() {
  return (
    <ScreenShell>
      <Text size="4xl" bold className="text-center text-teamgm-text-primary">
        {MYGM_COPY.title}
      </Text>
      <Text size="md" className="text-center text-teamgm-text-muted">
        {MYGM_COPY.subtitle}
      </Text>
    </ScreenShell>
  );
}
