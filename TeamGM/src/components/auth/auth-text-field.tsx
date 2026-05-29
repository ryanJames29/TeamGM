import React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { AppBackground, TextPrimary } from '@/constants/colors';

type AuthTextFieldProps = TextInputProps & {
  label: string;
};

const INPUT_HEIGHT = 44;
const INPUT_FONT_SIZE = 16;

// Branded email/password field for auth screens
export function AuthTextField({ label, style, ...props }: AuthTextFieldProps) {
  return (
    <VStack space="xs" className="w-full">
      <Text size="sm" className="text-teamgm-text-primary">
        {label}
      </Text>
      <View style={styles.field}>
        <TextInput
          {...props}
          placeholderTextColor="#000000"
          style={[styles.input, style]}
        />
      </View>
    </VStack>
  );
}

const styles = StyleSheet.create({
  field: {
    backgroundColor: TextPrimary,
    borderRadius: 8,
    height: INPUT_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  input: {
    color: AppBackground,
    fontSize: INPUT_FONT_SIZE,
    lineHeight: INPUT_FONT_SIZE + 4,
    margin: 0,
    padding: 0,
    width: '100%',
    ...(Platform.OS === 'android'
      ? {
          includeFontPadding: false,
          textAlignVertical: 'center',
          height: INPUT_HEIGHT,
        }
      : {
          height: INPUT_FONT_SIZE + 4,
        }),
  },
});
