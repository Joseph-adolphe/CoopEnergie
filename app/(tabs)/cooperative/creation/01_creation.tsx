import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { z, ZodError } from 'zod';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';
import { Card } from '@/components/ui/card';
import { useThemeColor } from '@/hooks/use-theme-color';
import { spacing } from '@/constants/theme';

const schema = z.object({
  name: z.string().min(2, 'Entrez un nom valide'),
  description: z.string().max(250).optional(),
  objectif: z.preprocess((v) => {
    if (typeof v === 'string') return Number(String(v).replace(/\s+/g, '').replace(/,/g, ''));
    return v;
  }, z.number().positive('Objectif invalide')),
  duration: z.string().min(1, 'Choisissez une durée'),
});

export default function CreationStep1() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [objectif, setObjectif] = useState('');
  const [duration, setDuration] = useState('12 mois');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; status: 'success' | 'error'; title?: string; message?: string } | null>(null);

  const darkGreen = useThemeColor({}, 'darkGreen') as string;

  function handleNext() {
    try {
      schema.parse({ name, description, objectif, duration });
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // pass data via query string for the prototype
        const qs = `?name=${encodeURIComponent(name)}&objectif=${encodeURIComponent(objectif)}&duration=${encodeURIComponent(duration)}&description=${encodeURIComponent(
          description
        )}`;
        router.push(`../creation/02_invitation${qs}`);
      }, 700);
    } catch (err) {
      if (err instanceof ZodError) {
        setStatus({ visible: true, status: 'error', title: 'Erreur', message: err.issues[0]?.message });
      }
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Créer une coopérative</ThemedText>

      <View style={{ marginTop: 12 }}>
        <Card>
          <ThemedText type="defaultSemiBold">Informations de la coopérative</ThemedText>
          <ThemedText style={{ marginTop: 8 }}>Renseignez les informations principales de votre coopérative.</ThemedText>
        </Card>

        <ThemedText style={[styles.label, { color: darkGreen }]}>Nom de la coopérative</ThemedText>
        <Input placeholder="Ex: Coopérative Soleil" value={name} onChangeText={setName} />

        <ThemedText style={[styles.label, { color: darkGreen }]}>Description</ThemedText>
        <Input placeholder="Décrivez la mission, les valeurs..." value={description} onChangeText={setDescription} multiline />

        <ThemedText style={[styles.label, { color: darkGreen }]}>Objectif de collecte (FCFA)</ThemedText>
        <Input placeholder="Ex: 200000" keyboardType="numeric" value={objectif} onChangeText={setObjectif} />

        <ThemedText style={[styles.label, { color: darkGreen }]}>Durée de l'objectif</ThemedText>
        <View style={styles.durationRow}>
          {['3 mois', '6 mois', '12 mois'].map((d) => (
            <TouchableOpacity key={d} onPress={() => setDuration(d)} style={[styles.durationBtn, duration === d ? { borderColor: darkGreen, borderWidth: 1 } : null]}>
              <ThemedText>{d}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <Button title="Suivant" variant="primary" onPress={handleNext} style={{ marginTop: 18 }} />
      </View>

      <LoadingModal visible={loading} message="Validation..." />
      {status ? (
        <StatusModal visible={status.visible} status={status.status} title={status.title} message={status.message} onClose={() => setStatus((s) => (s ? { ...s, visible: false } : s))} />
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 , justifyContent: 'center'},
  label: { marginTop: 12, marginBottom: 6, fontSize: 16 },
  durationRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  durationBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#fff' },
});
