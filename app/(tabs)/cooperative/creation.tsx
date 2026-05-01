import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { z, ZodError } from 'zod';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';
import { useThemeColor } from '@/hooks/use-theme-color';

const createSchema = z.object({
  name: z.string().min(2, 'Entrez un nom valide'),
  objectif: z.preprocess((v) => {
    if (typeof v === 'string') return Number(String(v).replace(/\s+/g, '').replace(/,/g, ''));
    return v;
  }, z.number().positive('Objectif invalide')),
  members: z.preprocess((v) => {
    if (typeof v === 'string') return Number(v);
    return v;
  }, z.number().int().positive('Nombre de membres invalide')),
});

export default function CreateCooperative() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [objectif, setObjectif] = useState('');
  const [members, setMembers] = useState('');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; status: 'success' | 'error'; title?: string; message?: string } | null>(null);

  const darkGreen = useThemeColor({}, 'darkGreen') as string;
  const cyan = useThemeColor({}, 'cyanCard') as string;

  async function onCreate() {
    try {
      createSchema.parse({ name, objectif, members });
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStatus({ visible: true, status: 'success', title: 'Coopérative créée', message: "La coopérative a été créée avec succès." });
        setTimeout(() => {
          setStatus((s) => (s ? { ...s, visible: false } : s));
          router.replace('/cooperative/dashboard');
        }, 900);
      }, 900);
    } catch (err) {
      if (err instanceof ZodError) {
        setStatus({ visible: true, status: 'error', title: 'Erreur', message: err.issues[0]?.message });
      }
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Créer une coopérative</ThemedText>

      <ThemedText type="defaultSemiBold" style={[styles.label, { color: darkGreen }]}>Nom du groupe</ThemedText>
      <Input placeholder="Ex: Alliance Énergie" value={name} onChangeText={setName} />

      <ThemedText type="defaultSemiBold" style={[styles.label, { color: darkGreen }]}>Objectif (FCFA)</ThemedText>
      <Input placeholder="Ex: 500 000" keyboardType="numeric" value={objectif} onChangeText={setObjectif} />

      <ThemedText type="defaultSemiBold" style={[styles.label, { color: darkGreen }]}>Nombre de membres</ThemedText>
      <Input placeholder="Ex: 15" keyboardType="numeric" value={members} onChangeText={setMembers} />

      <View style={{ marginTop: 20 }}>
        <Button title="Créer" variant="primary" onPress={onCreate} style={{ paddingVertical: 14, borderRadius: 12 }} />
      </View>

      <View style={[styles.note, { backgroundColor: cyan }]}> 
        <ThemedText>Les fonds sont sécurisés et protégés jusqu'à validation par le groupe via la blockchain.</ThemedText>
      </View>

      <LoadingModal visible={loading} message="Création en cours..." />
      {status ? <StatusModal visible={status.visible} status={status.status} title={status.title} message={status.message} onClose={() => setStatus((s) => (s ? { ...s, visible: false } : s))} /> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  label: { marginTop: 16, marginBottom: 6, fontSize: 18 },
  note: { marginTop: 20, padding: 14, borderRadius: 12 },
});
