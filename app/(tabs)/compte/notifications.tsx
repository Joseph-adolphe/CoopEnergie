import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Button } from '@/components/ui/button';

const NOTIFS = [
  { id: '1', type: 'contribution', title: 'Nouvelle contribution', message: 'Votre épargne de 10 000 FCFA a été enregistrée.', date: '10:30' },
  { id: '2', type: 'vote', title: 'Vote lancé', message: "Votez pour le nouveau projet jusqu'au 31 Mai.", date: 'Hier' },
  { id: '3', type: 'payment', title: 'Paiement validé', message: "Votre paiement a été confirmé avec succès.", date: '15 Mai' },
  { id: '4', type: 'objective', title: "Objectif atteint à 75%", message: "L'objectif du projet d'eau propre est atteint à 75%.", date: '10 Mai' },
];


export default function Notifications() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Notifications</ThemedText>

      <FlatList data={NOTIFS} keyExtractor={(i) => i.id} renderItem={renderItem} style={styles.list} />

      <Button title="Voir toutes" variant="primary" style={styles.cta} onPress={() => {}} />
    </ThemedView>
  );
}


function renderItem({ item }: any) {
  const accent = useThemeColor({}, 'accentGreen') as string;
  const iconName = item.type === 'contribution' ? 'person.fill' : item.type === 'vote' ? 'person.3.fill' : item.type === 'payment' ? 'bell' : 'paperplane.fill';

  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <IconSymbol name={iconName as any} size={20} color={accent} />
      </View>
      <View style={styles.content}>
        <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
        <ThemedText type="text">{item.message}</ThemedText>
      </View>
      <ThemedText type="text">{item.date}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  list: { marginTop: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  iconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eef7ef' },
  content: { flex: 1 },
  cta: { marginTop: 16 },
});
