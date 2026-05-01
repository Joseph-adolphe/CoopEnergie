import React from 'react';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function CreateCooperative() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Créer une coopérative</ThemedText>
      <ThemedText style={styles.body}>Formulaire de création (prototype).</ThemedText>
      <Link href="/cooperative/dashboard" style={styles.next}>
        Continuer
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  body: { marginTop: 12 },
  next: { marginTop: 24, color: '#00450D' },
});
