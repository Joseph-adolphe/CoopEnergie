import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

type BarChartProps = {
  data: number[];
  colors?: string[];
  style?: any;
};

export function BarChart({ data, colors = [], style }: BarChartProps) {
  const max = Math.max(...data, 1);
  const accent = useThemeColor({}, 'accentGreen');

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        {data.map((d, i) => {
          const heightPercent = (d / max) * 100;
          const barColor = colors[i] ?? (accent as string);
          return (
            <View key={i} style={styles.barWrapper}>
              <View style={[styles.bar, { height: `${heightPercent}%`, backgroundColor: barColor }]} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', paddingVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 },
  barWrapper: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  bar: { width: '100%', borderRadius: 6 },
});
