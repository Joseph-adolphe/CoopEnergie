import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { useThemeColor } from '@/hooks/use-theme-color';
import { spacing } from '@/constants/theme';

export default function CooperativeDashboard() {
  const router = useRouter();
  const [hasCoop] = useState(true); // toggle to false to show empty state
  const [showMenu, setShowMenu] = useState(false);

  const accent = useThemeColor({}, 'accentGreen') as string;
  const dark = useThemeColor({}, 'darkGreen') as string;

  const contributions = [
    { id: '1', name: 'Marie', date: '20 Mai 2024 - 10:30', amount: '10 000 FCFA' },
    { id: '2', name: 'Paul', date: '20 Mai 2024 - 09:15', amount: '5 000 FCFA' },
    { id: '3', name: 'Amina', date: '19 Mai 2024 - 18:40', amount: '20 000 FCFA' },
  ];

  if (!hasCoop) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={{ marginTop: 48}} type="title">Bonjour Alliance </ThemedText>

        <Card style={styles.emptyCard}>
          <View style={styles.emptyInner}>
            <Avatar size={64} name={""} />
            <ThemedText type="defaultSemiBold" style={{ marginTop: 12 ,textAlign: 'center'}}>
              Vous n'êtes affilié à aucune coopérative.
            </ThemedText>
            <ThemedText style={{ marginTop: 8, textAlign: 'center' }}>
              Créez votre première coopérative et commencez à collaborer avec d'autres membres.
            </ThemedText>

            <TouchableOpacity style={[styles.createBtn, { backgroundColor: dark }]} onPress={() => router.push('/cooperative/creation')}>
              <ThemedText style={{ color: '#fff', fontWeight: '700' }}>+  Créer une coopérative</ThemedText>
            </TouchableOpacity>
          </View>
        </Card>
      </ThemedView>
    );
  }

  // Active dashboard
  const progress = 37; // percent

  function renderContribution({ item }: any) {
    return (
      <View style={styles.row} key={item.id}>
        <Avatar name={item.name} size={44} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
          <ThemedText type="text">{item.date}</ThemedText>
        </View>
        <ThemedText type="defaultSemiBold">{item.amount}</ThemedText>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container} >
       <View style={styles.headerRow}>
        <ThemedText style={styles.brand}>COOPENERGIE</ThemedText>
        <TouchableOpacity onPress={() => setShowMenu((s) => !s)} style={styles.menuBtn}>
          <ThemedText style={styles.menuTxt}>⋯</ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedText type="title">Bonjour Alliance</ThemedText>

      <Card style={styles.progressCard}>
        <ThemedText type="defaultSemiBold">Objectif de la coopérative</ThemedText>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 8 }}>
          <ThemedText type="title">75 000 <ThemedText type="text">/ 200 000 FCFA</ThemedText></ThemedText>
        </View>

        <View style={styles.progressWrap}>
          <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: accent }]} />
        </View>

        <View style={styles.progressFooter}>
          <ThemedText type="text">{progress}% atteint</ThemedText>
          <ThemedText type="text">Objectif en 12 jours</ThemedText>
        </View>
      </Card>

      <View style={styles.voteCard}>
        <View style={{ flex: 1 }}>
          <ThemedText type="defaultSemiBold">Vote en cours</ThemedText>
          <ThemedText type="text">Vote sur l'achat d'équipements solaires</ThemedText>
        </View>
        <TouchableOpacity onPress={() => router.push('/cooperative/vote')} style={styles.voteAction}>
          <ThemedText style={{ color: dark }}>Voir le vote</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: spacing.rLg }}>
        <View style={styles.rowHeader}>
          <ThemedText type="defaultSemiBold">Contributions récentes</ThemedText>
          <TouchableOpacity onPress={() => router.push('/cooperative/historique/1')}>
            <ThemedText style={{ color: dark }}>Voir tout</ThemedText>
          </TouchableOpacity>
        </View>
         {/* {
          contributions.map((item)=> {
           return renderContribution(item)
          })
         } */}
        <FlatList data={contributions} keyExtractor={(i) => i.id} renderItem={renderContribution}  />
      </View>
      <TouchableOpacity style={[styles.fab, { backgroundColor: dark }]} onPress={() => router.push('/cooperative/cotiser')}>
        <ThemedText style={{ color: '#fff', fontSize: 28, lineHeight: 28 }}>+</ThemedText>
      </TouchableOpacity>

      {showMenu ? (
        <View style={styles.menuOverlay} >
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/cooperative/vote-admin')}>
            <ThemedText>Votes</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/cooperative/cotiser')}>
            <ThemedText>Cotisations</ThemedText>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/cooperative/historique/1')}>
            <ThemedText>Historiques</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/cooperative/membres')}>
            <ThemedText>Membres</ThemedText>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/cooperative/creation')}>
            <ThemedText>Créer une nouvelle coopérative</ThemedText>
          </TouchableOpacity>
        </View>
      ) : null}

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  brand: { color: '#0b7a2a', fontWeight: '700' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' , marginTop: 24 },
  menuBtn: { padding: 8 },
  menuTxt: { fontSize: 22 },
  emptyCard: { marginTop: 24, paddingVertical: 40, alignItems: 'center' },
  emptyInner: { alignItems: 'center' },
  createBtn: { marginTop: 18, paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 },
  progressCard: { marginTop: 12, padding: 18 },
  progressWrap: { width: '100%', height: 12, backgroundColor: '#e6f3ea', borderRadius: 8, marginTop: 12, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 8 },
  progressFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  voteCard: { marginTop: 12, padding: 14, borderRadius: 12, backgroundColor: '#fff6ef', borderWidth: 1, borderColor: '#f5d6b0', flexDirection: 'row', alignItems: 'center' },
  voteAction: { paddingHorizontal: 12, paddingVertical: 6 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fab: { position: 'absolute', right: 20, bottom: 30, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  menuOverlay: { position: 'absolute', top: 80, right: 20, backgroundColor: '#fff', padding: 8, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 4 },
  menuItem: { paddingVertical: 8, paddingHorizontal: 12 },
});
