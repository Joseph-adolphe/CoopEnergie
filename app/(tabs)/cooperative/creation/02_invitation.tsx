import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function InvitationStep() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const name = (params.name as string) || '';
  const objectif = (params.objectif as string) || '';
  const duration = (params.duration as string) || '';

  const [phones, setPhones] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; kind?: 'success' | 'error'; title?: string; message?: string }>({ visible: false });

  const inviteLink = `https://coopenergie.app/invite/${Math.random().toString(36).slice(2, 9).toUpperCase()}`;
  const accent = useThemeColor({}, 'accentGreen') as string;

  async function copyLink() {
    await Clipboard.setStringAsync(inviteLink);
    setStatus({ visible: true, kind: 'success', title: 'Copié', message: 'Le lien d\'invitation a été copié.' });
  }

  function handleNext() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const qs = `?name=${encodeURIComponent(name)}&objectif=${encodeURIComponent(objectif)}&duration=${encodeURIComponent(duration)}&invited=${encodeURIComponent(
        phones
      )}`;
      router.push(`../creation/03_success${qs}`);
    }, 700);
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Inviter des membres</ThemedText>

      <Card style={{ marginTop: 12 }}>
        <ThemedText type="defaultSemiBold">Ajoutez des membres par numéro de téléphone</ThemedText>
        <ThemedText style={{ marginTop: 8 }}>Entrez plusieurs numéros séparés par une virgule.</ThemedText>
      </Card>

      <ThemedText style={styles.label}>Numéros (séparés par des virgules)</ThemedText>
      <Input placeholder="Ex: 2250701020304,2250506070809" value={phones} onChangeText={setPhones} multiline />

      <ThemedText style={[styles.label, { marginTop: 12 }]}>Ou partagez le lien d'invitation</ThemedText>
      <View style={styles.linkRow}>
        <View style={styles.linkBox}>
          <ThemedText type="text">{inviteLink}</ThemedText>
        </View>
        <Button title="Copier le lien" variant="secondary" onPress={copyLink} />
      </View>

      <Button title="Suivant" variant="primary" onPress={handleNext} style={{ marginTop: 18 }} />

      <LoadingModal visible={loading} message="Envoi des invitations..." />
      <StatusModal visible={status.visible} status={status.kind === 'success' ? 'success' : 'error'} title={status.title} message={status.message} onClose={() => setStatus({ visible: false })} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 , justifyContent: 'center' },
  label: { marginTop: 12, marginBottom: 6 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  linkBox: { flex: 1, padding: 10, borderRadius: 8, backgroundColor: '#f4f7f4' },
});
