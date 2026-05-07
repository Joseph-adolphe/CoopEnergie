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

// ===== IMPORT SUPABASE =====
import { createUser, createCooperative } from '@/services/supabaseService';

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

  // ===== CRÉER LA COOPÉRATIVE DANS SUPABASE =====
  async function handleNext() {
    try {
      // Valide les données
      schema.parse({ name, description, objectif, duration });
      setLoading(true);

      // ===== CRÉER L'UTILISATEUR ADMIN (TEMPORAIRE) =====
      // En production, ce serait l'utilisateur connecté
      const adminData = await createUser(
        'Admin Coopérative',
        `admin-${Date.now()}@coop.local`,
        '+237 6XX XXX XXX',
        'admin'
      );

      const adminId = adminData[0]?.id;

      if (!adminId) {
        throw new Error('Erreur lors de la création de l\'utilisateur');
      }

      console.log('✅ Utilisateur admin créé :', adminId);

      // ===== CRÉER LA COOPÉRATIVE =====
      const coopData = await createCooperative(name, objectif, adminId);

      const cooperativeId = coopData[0]?.id;

      if (!cooperativeId) {
        throw new Error('Erreur lors de la création de la coopérative');
      }

      console.log('✅ Coopérative créée :', cooperativeId);

      setStatus({
        visible: true,
        status: 'success',
        title: 'Succès !',
        message: 'Coopérative créée avec succès',
      });

      // Attends 1 seconde puis va à l'étape suivante
      setTimeout(() => {
        const qs = `?coopId=${cooperativeId}&name=${encodeURIComponent(name)}&objectif=${encodeURIComponent(
          objectif
        )}&duration=${encodeURIComponent(duration)}&description=${encodeURIComponent(description)}`;
        router.push(`../creation/02_invitation${qs}`);
      }, 1000);
    } catch (err) {
      console.error('❌ Erreur :', err);

      let errorMessage = 'Une erreur est survenue';

      if (err instanceof ZodError) {
        errorMessage = err.issues[0]?.message || 'Données invalides';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setLoading(false);
      setStatus({
        visible: true,
        status: 'error',
        title: 'Erreur',
        message: errorMessage,
      });
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
        <Input
          placeholder="Ex: Coopérative Soleil"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />

        <ThemedText style={[styles.label, { color: darkGreen }]}>Description</ThemedText>
        <Input
          placeholder="Décrivez la mission, les valeurs..."
          value={description}
          onChangeText={setDescription}
          multiline
          editable={!loading}
        />

        <ThemedText style={[styles.label, { color: darkGreen }]}>Objectif de collecte (FCFA)</ThemedText>
        <Input
          placeholder="Ex: 200000"
          keyboardType="numeric"
          value={objectif}
          onChangeText={setObjectif}
          editable={!loading}
        />

        <ThemedText style={[styles.label, { color: darkGreen }]}>Durée de l'objectif</ThemedText>
        <View style={styles.durationRow}>
          {['3 mois', '6 mois', '12 mois'].map((d) => (
            <TouchableOpacity
              key={d}
              onPress={() => !loading && setDuration(d)}
              disabled={loading}
              style={[
                styles.durationBtn,
                duration === d ? { borderColor: darkGreen, borderWidth: 1 } : null,
              ]}
            >
              <ThemedText>{d}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title="Suivant"
          variant="primary"
          onPress={handleNext}
          style={{ marginTop: 18 }}
          disabled={loading}
        />
      </View>

      <LoadingModal visible={loading} message="Création de la coopérative..." />
      {status ? (
        <StatusModal
          visible={status.visible}
          status={status.status}
          title={status.title}
          message={status.message}
          onClose={() => setStatus((s) => (s ? { ...s, visible: false } : s))}
        />
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  label: { marginTop: 12, marginBottom: 6, fontSize: 16 },
  durationRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  durationBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#fff' },
});
