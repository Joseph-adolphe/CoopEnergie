import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { spacing } from '@/constants/theme';

type InputProps = TextInputProps & {
  label?: string;
  leftIcon?: any;
  rightIcon?: any;
};

export function Input({ label, leftIcon, rightIcon, style, ...rest }: InputProps) {
  const bg = useThemeColor({}, 'white');
  const surface = useThemeColor({}, 'cyanCard');

  return (
    <View style={styles.wrapper}>
      {label ? <ThemedText type="defaultSemiBold">{label}</ThemedText> : null}
      <View style={[styles.inputRow, { backgroundColor: bg }, style]}>
        {leftIcon ? <IconSymbol name={leftIcon as any} size={20} color={useThemeColor({}, 'darkGreen') as any} /> : null}
        <TextInput placeholderTextColor={useThemeColor({}, 'textMuted') as any} style={styles.input} {...rest} />
        {rightIcon ? <IconSymbol name={rightIcon as any} size={20} color={useThemeColor({}, 'darkGreen') as any} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', marginVertical: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: spacing.rMd,
  },
  input: { flex: 1, padding: 0, marginLeft: 8, fontSize: 16 },
});
