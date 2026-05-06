import React from 'react';
import { StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { ThemedText as TT } from '@/components/themed-text';
import { LineChart } from 'react-native-chart-kit';
import { useThemeColor } from '@/hooks/use-theme-color';

const screenWidth = Dimensions.get('window').width - 40;

export default function FournisseursDashboard() {
  const darkGreen = useThemeColor({}, 'darkGreen') as string;
  const accent = useThemeColor({}, 'accentGreen') as string;

  const overview = [
    { id: 'o1', label: 'Commandes', value: '12' },
    { id: 'o2', label: 'Ventes (mois)', value: '2 580 000 FCFA' },
    { id: 'o3', label: 'Produits', value: '8' },
    { id: 'o4', label: 'Clients', value: '156' },
  ];

  const chartData = {
    labels: ['15', '16', '17', '18', '19', '20', '21'],
    datasets: [{ data: [200000, 300000, 250000, 420000, 380000, 560000, 300000] }],
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <ThemedText type="title">Tableau de bord</ThemedText>

        <View style={styles.grid}>
          {overview.map((o) => (
            <Card key={o.id} style={styles.smallCard}>
              <ThemedText type="defaultSemiBold">{o.label}</ThemedText>
              <ThemedText type="title" style={{ marginTop: 8 }}>{o.value}</ThemedText>
            </Card>
          ))}
        </View>

        <ThemedText type="defaultSemiBold" style={{ marginTop: 12 }}>Commandes récentes</ThemedText>
        <Card style={{ marginTop: 8 }}>
          <ThemedText>#CMD-00012 - En attente</ThemedText>
          <ThemedText style={{ marginTop: 6 }}>Jean Dupont — Kit Solaire Résidentiel 1kW — 180 000 FCFA</ThemedText>
        </Card>

        <ThemedText type="defaultSemiBold" style={{ marginTop: 12 }}>Aperçu des ventes</ThemedText>
        <Card style={{ marginTop: 8 }}>
          <LineChart
            data={chartData}
            width={screenWidth}
            height={160}
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => accent,
              labelColor: () => '#6b6b6b',
              style: { borderRadius: 8 },
              propsForDots: { r: '4', strokeWidth: '2', stroke: darkGreen },
            }}
            bezier
            style={{ borderRadius: 8 }}
          />
        </Card>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  smallCard: { width: '48%', padding: 14 },
});
