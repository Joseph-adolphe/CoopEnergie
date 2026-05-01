import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function CooperativeHistoryItem() {
  const { id } = useLocalSearchParams();

  const timeline = [
    { id: 't1', title: 'Nouvelle contribution', date: 'Mai 20, 2024 - 10:30', detail: 'Marie a contribué 10 000 FCFA', icon: '💰' },
    { id: 't2', title: 'Vote lancé', date: 'Mai 20, 2024 - 11:15', detail: 'Achat du kit solaire soumis au vote', icon: '🗳️' },
    { id: 't3', title: "Objectif atteint à 75%", date: 'Mai 20, 2024 - 14:20', detail: '150 000 FCFA collectés', icon: '🎯' },
    { id: 't4', title: 'Dépense validée', date: 'Mai 21, 2024 - 10:10', detail: 'Acompte versé au fournisseur', icon: '⚙️' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Transparence totale</ThemedText>

      <View style={styles.pills}>
        <View style={[styles.pillActive]}>
          <ThemedText>Toutes</ThemedText>
        </View>
        <View style={styles.pill}><ThemedText>Contributions</ThemedText></View>
        <View style={styles.pill}><ThemedText>Votes</ThemedText></View>
        <View style={styles.pill}><ThemedText>Dépenses</ThemedText></View>
      </View>

      <ScrollView style={styles.timeline}>
        {timeline.map((t) => (
          <View key={t.id} style={styles.event}>
            <View style={styles.iconWrap}><ThemedText>{t.icon}</ThemedText></View>
            <View style={styles.eventBody}>
              <ThemedText type="defaultSemiBold">{t.title}</ThemedText>
              <ThemedText style={styles.date}>{t.date}</ThemedText>
              <ThemedText style={styles.detail}>• {t.detail}</ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>

      <Link href="../cooperative" style={styles.link}>Retour</Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  pills: { flexDirection: 'row', gap: 8, marginTop: 12 },
  pill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f2f2f2', marginRight: 8 },
  pillActive: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#0d6b2f', marginRight: 8 },
  timeline: { marginTop: 16 },
  event: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)' },
  iconWrap: { width: 48, alignItems: 'center', justifyContent: 'center' },
  eventBody: { flex: 1 },
  date: { marginTop: 6, color: '#6b6b6b' },
  detail: { marginTop: 8 },
  link: { marginTop: 12, color: '#00450D' },
});
