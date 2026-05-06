import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps , type ViewProps, KeyboardAvoidingView, Platform} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { spacing } from '@/constants/theme';

type InputProps = TextInputProps & ViewProps & {
  label?: string;
  leftIcon?: any;
  rightIcon?: any;
};

export function Input({ label, leftIcon, rightIcon, style, ...rest }: InputProps) {
  const bg = useThemeColor({}, 'white');
  const text = useThemeColor({}, 'text');

  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === 'ios' ? 'padding' : 'position'}  keyboardVerticalOffset={24}>
      {label ? <ThemedText  type="text">{label}</ThemedText> : null}
      <View style={[styles.inputRow, { backgroundColor: bg }, style]}>
        {leftIcon ? <IconSymbol name={leftIcon as any} size={20} color={useThemeColor({}, 'darkGreen') as any} /> : null}
        <TextInput placeholderTextColor={useThemeColor({}, 'textMuted') as any} style={styles.input} {...rest} />
        {rightIcon ? <IconSymbol name={rightIcon as any} size={20} color={useThemeColor({}, 'darkGreen') as any} /> : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', marginVertical: 4 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: spacing.rMd,
    marginTop: 4 
  },
  input: { flex: 1, padding: 0, marginLeft: 8, fontSize: 16  },
});
