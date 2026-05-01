import React from 'react';
import { TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { spacing } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';

type ButtonProps = {
  variant?: ButtonVariant;
  title?: string;
  onPress?: () => void;
  icon?: any;
  size?: 'sm' | 'md' | 'lg';
  style?: any;
  disabled?: boolean;
  loading?: boolean;
};

export function Button({
  variant = 'primary',
  title,
  onPress,
  icon,
  size = 'md',
  style,
  disabled = false,
  loading = false,
}: ButtonProps) {
  const bgPrimary = useThemeColor({}, 'darkGreen');
  const bgSecondary = useThemeColor({}, 'grayCard');
  const accent = useThemeColor({}, 'accentGreen');
  const bg = useThemeColor({}, 'bg');

  const height = size === 'sm' ? 36 : size === 'lg' ? 56 : 44;

  const resolvedStyle = [
    styles.button,
    { height, borderRadius: spacing.rMd },
    variant === 'primary' && { backgroundColor: bgPrimary },
    variant === 'secondary' && { backgroundColor: bgSecondary },
    variant === 'ghost' && { backgroundColor: 'transparent' },
    variant === 'icon' && { paddingHorizontal: 12, width: height, borderRadius: height / 2, backgroundColor: 'transparent' },
    disabled && { opacity: 0.5 },
    style,
  ];

  const textColor = variant === 'primary' ? '#fff' : variant === 'secondary' ? useThemeColor({}, 'textPrimary') : useThemeColor({}, 'darkGreen');

  return (
    <TouchableOpacity accessibilityRole="button" onPress={onPress} style={resolvedStyle} disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {icon ? <IconSymbol name={icon as any} size={20} color={textColor as any} /> : null}
          {variant !== 'icon' && title ? (
            <ThemedText style={[styles.title, { color: textColor }]}>{title}</ThemedText>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { marginLeft: 8, fontSize: 16 },
});
