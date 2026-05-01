import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

type PieChartProps = {
  segments: Array<{ value: number; color?: string; label?: string }>;
  style?: any;
};

// Lightweight pie-like representation as a horizontal stacked bar for prototype use
export function PieChart({ segments, style }: PieChartProps) {
  const total = Math.max(segments.reduce((s, it) => s + it.value, 0), 1);
  const defaultColors = [useThemeColor({}, 'accentGreen') as string, useThemeColor({}, 'cyanCard') as string, useThemeColor({}, 'grayCard') as string];

  return (
    <View style={[styles.container, style]}>
      <View style={styles.barRow}>
        {segments.map((seg, i) => {
          const widthPercent = (seg.value / total) * 100;
          return <View key={i} style={[styles.segment, { width: `${widthPercent}%`, backgroundColor: seg.color ?? defaultColors[i % defaultColors.length] }]} />;
        })}
      </View>
      <View style={styles.legend}>
        {segments.map((seg, i) => (
          <View key={i} style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: seg.color ?? defaultColors[i % defaultColors.length] }]} />
            <Text style={styles.legendLabel}>{seg.label ?? `${Math.round((seg.value / total) * 100)}%`}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  barRow: { flexDirection: 'row', height: 20, borderRadius: 10, overflow: 'hidden' },
  segment: { height: '100%' },
  legend: { flexDirection: 'row', marginTop: 8, flexWrap: 'wrap', gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  legendSwatch: { width: 12, height: 12, borderRadius: 3, marginRight: 6 },
  legendLabel: { fontSize: 12 },
});
