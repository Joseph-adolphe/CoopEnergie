import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

type TabButtonProps = {
  label?: string;
  icon?: any;
  active?: boolean;
  onPress?: () => void;
};

export function TabButton({ label, icon, active, onPress }: TabButtonProps) {
  const activeColor = useThemeColor({}, 'darkGreen');
  const inactiveColor = useThemeColor({}, 'textMuted');

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {icon ? <IconSymbol name={icon as any} size={22} color={(active ? activeColor : inactiveColor) as any} /> : null}
      {label ? <ThemedText style={[styles.label, { color: active ? (activeColor as any) : (inactiveColor as any) }]}>{label}</ThemedText> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: 8 },
  label: { fontSize: 12, marginTop: 4 },
});
