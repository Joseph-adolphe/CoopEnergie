import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { spacing } from '@/constants/theme';

type CardProps = {
  children?: React.ReactNode;
  style?: any;
  onPress?: () => void;
};

export function Card({ children, style }: CardProps) {
  const bg = useThemeColor({}, 'white');

  return <View style={[styles.card, { backgroundColor: bg }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: spacing.rLg,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
});
