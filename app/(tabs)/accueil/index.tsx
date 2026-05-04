import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { useThemeColor } from '@/hooks/use-theme-color';
import { spacing } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme.web';
import { Colors } from '@/constants/theme';

type Contribution = { id: string; name: string; amount: number; date: string };

const contributions: Contribution[] = [
  { id: '1', name: 'Marie', amount: 10000, date: '20 Mai 2024 - 10:30' },
  { id: '2', name: 'Paul', amount: 5000, date: '20 Mai 2024 - 09:15' },
  { id: '3', name: 'Amina', amount: 20000, date: '19 Mai 2024 - 18:40' },
];

export default function Dashboard() {
  const darkGreen = useThemeColor({}, 'darkGreen');
  const accent = useThemeColor({}, 'accentGreen');
  const white = useThemeColor({}, 'white');
    const theme = useColorScheme() ?? 'light';

  const goal = 200000;
  const current = 75000;
  const percent = Math.round((current / goal) * 100);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText style={[styles.brand, { color: darkGreen }]}>COOPENERGIE</ThemedText>
          <TouchableOpacity style={styles.bell}>
                   <IconSymbol
                     name="bell"
                     size={24}
                     weight="bold"
                     color={theme === 'light' ? Colors.light.accentGreen : Colors.dark.accentGreen}
                   />
          </TouchableOpacity>
        </View>

        <ThemedText type="title" style={styles.greeting}>
          Bonjour Alliance 
        </ThemedText>

        <View style={[styles.objectiveCard, { backgroundColor: darkGreen }] }>
          <ThemedText style={[styles.objectiveLabel, { color: white }]}>Objectif de la coopérative</ThemedText>
          <ThemedText style={[styles.objectiveAmount, { color: white }]}>{`${current.toLocaleString('fr-FR')} / ${goal.toLocaleString('fr-FR')} FCFA`}</ThemedText>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${Math.min(percent, 100)}%`, backgroundColor: accent }]} />
          </View>
          <View style={styles.objectiveFooter}>
            <ThemedText style={[styles.small, { color: white }]}>{`${percent}% atteint`}</ThemedText>
            <ThemedText style={[styles.small, { color: white }]}>Objectif en 12 jours</ThemedText>
          </View>
        </View>

        <Card style={styles.infoCard}>
          <ThemedText style={styles.infoTitle}>🔒  Coffre sécurisé</ThemedText>
          <ThemedText style={styles.infoBody}>Les fonds sont sécurisés et le retrait est bloqué jusqu'à validation du vote.</ThemedText>
        </Card>

        <View style={styles.listHeader}> 
          <ThemedText style={styles.sectionTitle}>Contributions récentes</ThemedText>
          <Link href="../cooperative/historique/[1]" style={styles.seeAllLink}>
            <ThemedText style={styles.seeAllText}>Voir tout</ThemedText>
          </Link>
        </View>

        {contributions.map((c) => (
          <View key={c.id} style={styles.contributionRow}>
            <View style={styles.leftRow}>
              <Avatar name={c.name} size={48} />
              <View style={styles.meta}>
                <ThemedText style={styles.name}>{c.name}</ThemedText>
                <ThemedText style={styles.date}>{c.date}</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.amount}>{c.amount.toLocaleString('fr-FR')} FCFA</ThemedText>
          </View>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 , marginTop: 12 },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontWeight: '800', fontSize: 16 },
  bell: { padding: 6 },
  bellEmoji: { fontSize: 20 },
  greeting: { marginTop: 8, marginBottom: 16 },
  objectiveCard: {
    borderRadius: spacing.rLg,
    padding: 18,
    marginBottom: 16,
  },
  objectiveLabel: { fontSize: 14, marginBottom: 6 },
  objectiveAmount: { fontSize: 32, fontWeight: '700', marginBottom: 10 },
  progressTrack: { backgroundColor: 'rgba(255,255,255,0.12)', height: 12, borderRadius: 8, overflow: 'hidden', marginBottom: 12 },
  progressBar: { height: '100%' },
  objectiveFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  small: { fontSize: 14 },
  infoCard: { marginBottom: 20 },
  infoTitle: { fontWeight: '700', fontSize: 16, marginBottom: 6 },
  infoBody: { color: '#333' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  seeAllLink: { padding: 6 },
  seeAllText: { color: '#0f8a4b' },
  contributionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  leftRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  meta: { marginLeft: 12 },
  name: { fontSize: 16, fontWeight: '700' },
  date: { fontSize: 13, color: '#6b6b6b' },
  amount: { fontSize: 18, fontWeight: '700' },
  fab: { position: 'absolute', right: 20, bottom: 28, width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
  fabPlus: { color: '#fff', fontSize: 34, lineHeight: 36 },
});
