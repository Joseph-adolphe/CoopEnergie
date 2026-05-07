import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { PieChart } from '@/components/ui/chart-pie';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';
import { useThemeColor } from '@/hooks/use-theme-color';

const VOTES = [
  { id: '1', name: 'Marie', choice: 'yes' },
  { id: '2', name: 'Paul', choice: 'yes' },
  { id: '3', name: 'Amina', choice: 'yes' },
  { id: '4', name: 'Jean', choice: 'no' },
  { id: '5', name: 'Fatou', choice: 'yes' },
];

export default function VoteAdmin() {
  const params = useLocalSearchParams();
  const isAdmin = (params?.admin === '1' || params?.admin === 'true');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; status: 'success' | 'error'; title?: string; message?: string } | null>(null);

  const accent = useThemeColor({}, 'accentGreen') as string;
  const gray = useThemeColor({}, 'grayCard') as string;

  const yesCount = VOTES.filter((v) => v.choice === 'yes').length;
  const noCount = VOTES.filter((v) => v.choice === 'no').length;

  function applyDecision() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatus({ visible: true, status: 'success', title: 'Décision appliquée', message: "La décision a été enregistrée." });
    }, 900);
  }

  if (!isAdmin) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Accès réservé</ThemedText>
        <ThemedText style={styles.body}>Cette page est réservée aux administrateurs de la coopérative.</ThemedText>
        <Link href="../cooperative" style={styles.link}>Retour</Link>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Résultats du vote</ThemedText>

      <View style={[styles.card, { backgroundColor: gray }]}> 
        <ThemedText type="defaultSemiBold">Achat du kit solaire 200W</ThemedText>
        <ThemedText>Fournisseur : SolarPlus Cameroun · Montant : 180 000 FCFA</ThemedText>
      </View>

      <View style={styles.chartRow}>
        <PieChart segments={[{ value: yesCount, color: accent, label: 'Oui' }, { value: noCount, color: '#d9534f', label: 'Non' }]} style={{ flex: 1 }} />
      </View>

      <ThemedText style={{marginTop: 48}} type="subtitle">Détail des votes</ThemedText>
      <FlatList
        data={VOTES}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.voteRow}>
            <Avatar name={item.name} size={40} />
            <ThemedText style={styles.voteName}>{item.name}</ThemedText>
            <ThemedText style={{ color: item.choice === 'yes' ? accent : '#d9534f' }}>{item.choice === 'yes' ? '✓' : '✕'}</ThemedText>
          </View>
        )}
      />

      <View style={{ marginTop: 12 }}>
        <Button title="Appliquer la décision" variant="primary" onPress={applyDecision} />
      </View>

      <LoadingModal visible={loading} />
      {status ? <StatusModal visible={status.visible} status={status.status} title={status.title} message={status.message} onClose={() => setStatus(null)} /> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20  , paddingTop: 48},
  body: { marginTop: 12 },
  link: { marginTop: 12, color: '#00450D' },
  card: { padding: 12, borderRadius: 10, marginTop: 12 },
  chartRow: { marginVertical: 16 },
  voteRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  voteName: { flex: 1, marginLeft: 12 },
});
