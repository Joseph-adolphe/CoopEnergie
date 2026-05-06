import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Button } from '@/components/ui/button';

const DATA = [
  { id: '1', type: 'contribution', title: 'Nouvelle contribution', subtitle: 'Marie Dupont a contribué 10 000 FCFA', date: '25 Mai 2024 à 10:30' },
  { id: '2', type: 'vote', title: 'Vote lancé', subtitle: 'Projet d\'eau propre', date: '24 Mai 2024 à 14:20' },
  { id: '3', type: 'payment', title: 'Paiement validé', subtitle: 'Facture fournisseur confirmée', date: '23 Mai 2024 à 09:15' },
  { id: '4', type: 'objective', title: 'Objectif atteint à 75%', subtitle: 'Projet d\'eau propre', date: '22 Mai 2024 à 16:45' },
  { id: '5', type: 'expense', title: 'Dépense validée', subtitle: 'Achat de matériaux solaires', date: '21 Mai 2024 à 11:10' },
];

function renderItem({ item }: any) {
  const accent = useThemeColor({}, 'accentGreen') as string;
  const iconName = item.type === 'contribution' ? 'person.fill' : item.type === 'vote' ? 'person.3.fill' : item.type === 'payment' ? 'bell' : 'paperplane.fill';

  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: '#eef7ef' }]}>
        <IconSymbol name={iconName as any} size={20} color={accent} />
      </View>
      <View style={styles.content}>
        <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
        <ThemedText type="text">{item.subtitle}</ThemedText>
      </View>
      <ThemedText type="text">{item.date}</ThemedText>
    </View>
  );
}

export default function Historique() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Transparence totale</ThemedText>

      <View style={styles.filters}>
        <Button title="Tous" variant="secondary" style={{ marginRight: 8 }} />
        <Button title="Mai 2024" variant="ghost" />
      </View>

      <FlatList data={DATA} keyExtractor={(i) => i.id} renderItem={renderItem} style={styles.list} />

      <Button title="Exporter le rapport" variant="primary" style={styles.cta} onPress={() => {}} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  filters: { flexDirection: 'row', marginTop: 12, marginBottom: 8 },
  list: { marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  iconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1 },
  cta: { marginTop: 16 },
});
