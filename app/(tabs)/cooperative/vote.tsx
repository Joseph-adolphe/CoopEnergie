import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { PieChart } from '@/components/ui/chart-pie';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function Vote() {
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; status: 'success' | 'error'; title?: string; message?: string } | null>(null);

  // sample results
  const yes = 7;
  const no = 3;
  const accent = useThemeColor({}, 'accentGreen') as string;

  function cast(choice: 'yes' | 'no') {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVoted(true);
      setStatus({ visible: true, status: 'success', title: 'Merci', message: `Votre vote (${choice === 'yes' ? 'Oui' : 'Non'}) a été pris en compte.` });
    }, 900);
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Valider l'achat du kit solaire ?</ThemedText>

      <View style={{ marginTop: 18 }}>
        <Button title="✓  Oui, valider" variant="primary" onPress={() => cast('yes')} style={{ paddingVertical: 14, borderRadius: 12 }} />
      </View>

      <View style={{ marginTop: 12 }}>
        <Button title="✕  Non, refuser" variant="secondary" onPress={() => cast('no')} style={{ paddingVertical: 14, borderRadius: 12, backgroundColor: '#c82323' }} />
      </View>

      <View style={styles.results}> 
        <ThemedText type="defaultSemiBold">Résultats actuels</ThemedText>
        <PieChart segments={[{ value: yes, color: accent, label: 'Oui' }, { value: no, color: '#d9534f', label: 'Non' }]} style={{ marginTop: 12 }} />
      </View>

      <View style={styles.infoBox}>
        <ThemedText>Chaque membre a 1 voix. Votre vote compte !</ThemedText>
      </View>

      <LoadingModal visible={loading} />
      {status ? <StatusModal visible={status.visible} status={status.status} title={status.title} message={status.message} onClose={() => setStatus(null)} /> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  results: { marginTop: 18 },
  infoBox: { marginTop: 18, padding: 14, borderRadius: 12, backgroundColor: '#eef8f0' },
});
