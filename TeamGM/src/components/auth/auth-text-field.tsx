import React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

type AuthTextFieldProps = TextInputProps & {
  label: string;
};

// Branded email/password field for auth screens
export function AuthTextField({ label, className, ...props }: AuthTextFieldProps) {
  return (
    <VStack space="xs" className="w-full">
      <Text size="sm" className="text-teamgm-text-primary">
        {label}
      </Text>
      <Box className="rounded-lg border border-teamgm-border bg-teamgm-surface px-3 py-2">
        <TextInput
          {...props}
          placeholderTextColor="#a4c1d4"
          className={`text-base text-teamgm-text-primary ${className ?? ''}`}
        />
      </Box>
    </VStack>
  );
}
