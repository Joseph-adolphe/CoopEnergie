import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function CotiserScreen() {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Mobile Money');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; status: 'success' | 'error'; title?: string; message?: string } | null>(null);
  const cyan = useThemeColor({}, 'cyanCard') as string;
  const darkGreen = useThemeColor({}, 'darkGreen') as string;

  function quickSet(val: number) {
    setAmount(String(val));
  }

  function contribute() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatus({ visible: true, status: 'success', title: 'Merci', message: "Votre contribution a été enregistrée." });
      setAmount('');
    }, 1000);
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Cotiser</ThemedText>

      <ThemedText style={styles.label}>Montant (FCFA)</ThemedText>
      <Input placeholder="0" keyboardType="numeric" value={amount} onChangeText={setAmount} />

      <View style={styles.quickRow}>
        <TouchableOpacity style={styles.quickBox} onPress={() => quickSet(2000)}>
          <ThemedText type="defaultSemiBold" style={[styles.quickText, { color: darkGreen }]}>2000 FCFA</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBox} onPress={() => quickSet(5000)}>
          <ThemedText type="defaultSemiBold" style={[styles.quickText, { color: darkGreen }]}>5000 FCFA</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBox} onPress={() => quickSet(10000)}>
          <ThemedText type="defaultSemiBold" style={[styles.quickText, { color: darkGreen }]}>10000 FCFA</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBox} onPress={() => quickSet(20000)}>
          <ThemedText type="defaultSemiBold" style={[styles.quickText, { color: darkGreen }]}>20000 FCFA</ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedText style={[styles.label, { marginTop: 12 }]}>Mode de paiement</ThemedText>
      <TouchableOpacity style={styles.methodRow} onPress={() => setMethod(method === 'Mobile Money' ? 'Carte' : 'Mobile Money')}>
        <ThemedText>{method}</ThemedText>
        <ThemedText>{'\u25BC'}</ThemedText>
      </TouchableOpacity>

      <View style={{ marginTop: 20 }}>
        <Button title="Contribuer" variant="primary" onPress={contribute} />
      </View>

      <View style={[styles.note, { backgroundColor: cyan }]}> 
        <ThemedText>Transaction sécurisée et enregistrée sur la blockchain</ThemedText>
      </View>

      <LoadingModal visible={loading} />
      {status ? <StatusModal visible={status.visible} status={status.status} title={status.title} message={status.message} onClose={() => setStatus(null)} /> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { marginTop: 12, marginBottom: 8 },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginTop: 8 },
  quickBox: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#f5f5f5', alignItems: 'center', marginHorizontal: 4 },
  quickText: {},
  methodRow: { padding: 12, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e7e7e7', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  note: { marginTop: 20, padding: 14, borderRadius: 12 },
});
