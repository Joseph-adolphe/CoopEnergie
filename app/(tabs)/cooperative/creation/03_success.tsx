import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function CreationSuccess() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const name = (params.name as string) || '—';
  const objectif = (params.objectif as string) || '—';
  const duration = (params.duration as string) || '—';
  const invited = (params.invited as string) || '';

  const darkGreen = useThemeColor({}, 'darkGreen') as string;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Coopérative créée !</ThemedText>

      <Card style={{ marginTop: 12 }}>
        <View style={styles.checkWrap}>
          <View style={[styles.checkCircle, { backgroundColor: darkGreen }]}>
            <ThemedText style={{ color: '#fff', fontSize: 24 }}>✓</ThemedText>
          </View>
          <ThemedText type="defaultSemiBold" style={{ marginTop: 8 }}>
            Félicitations !
          </ThemedText>
          <ThemedText type='text' style={{ marginTop: 8 }}>Votre coopérative a été créée avec succès.</ThemedText>
        </View>

        <View style={styles.summary}>
          <ThemedText type="text">Nom de la coopérative</ThemedText>
          <ThemedText type="defaultSemiBold">{name}</ThemedText>

          <ThemedText type="text" style={{ marginTop: 8 }}>Objectif de collecte</ThemedText>
          <ThemedText type="defaultSemiBold">{objectif} FCFA</ThemedText>

          <ThemedText type="text" style={{ marginTop: 8 }}>Durée de l'objectif</ThemedText>
          <ThemedText type="defaultSemiBold">{duration}</ThemedText>

          <ThemedText type="text" style={{ marginTop: 8 }}>Membres invités</ThemedText>
          <ThemedText type="defaultSemiBold">{invited ? invited : 'Aucun (pour le moment)'}</ThemedText>
        </View>
      </Card>

      <Button title="Accéder au tableau de bord" variant="primary" onPress={() => router.replace('../cooperative/dashboard')} style={{ marginTop: 16 }} />
      <Button title="Inviter plus de membres" variant="secondary" onPress={() => router.push(`../creation/02_invitation?name=${encodeURIComponent(
        name
      )}&objectif=${encodeURIComponent(objectif)}&duration=${encodeURIComponent(duration)}`)} style={{ marginTop: 8 }} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 , justifyContent: 'center'},
  checkWrap: { alignItems: 'center', paddingVertical: 12 },
  checkCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  summary: { marginTop: 12, gap: 6 },
});
