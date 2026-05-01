import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

type ListItemProps = {
  title: string;
  subtitle?: string;
  icon?: any;
  onPress?: () => void;
};

export function ListItem({ title, subtitle, icon, onPress }: ListItemProps) {
  const border = useThemeColor({}, 'border');

  return (
    <TouchableOpacity onPress={onPress} style={[styles.row, { borderBottomColor: border }]}>
      {icon ? <IconSymbol name={icon as any} size={24} color={useThemeColor({}, 'darkGreen') as any} /> : null}
      <View style={styles.content}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        {subtitle ? <ThemedText type="subtitle">{subtitle}</ThemedText> : null}
      </View>
      <IconSymbol name={'chevron.right' as any} size={20} color={useThemeColor({}, 'textMuted') as any} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
  },
  content: { flex: 1 },
});
