import React from 'react';

import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MYGM_COPY } from '@/constants/copy';

// myGM tab placeholder
export default function MyGMScreen() {
  return (
    <VStack className="flex-1 bg-teamgm-app p-6">
      <Text size="4xl" bold className="text-center text-teamgm-text-primary">
        {MYGM_COPY.title}
      </Text>
      <Text size="md" className="text-center text-teamgm-text-muted">
        {MYGM_COPY.subtitle}
      </Text>
    </VStack>
  );
}
