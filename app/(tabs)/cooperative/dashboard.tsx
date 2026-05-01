import React from 'react';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function CooperativeDashboard() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Dashboard coopérative</ThemedText>
      <ThemedText style={styles.body}>Vue d'ensemble de la coopérative (prototype).</ThemedText>
      <Link href="/cooperative/historique/1" style={styles.next}>
        Voir historique (exemple)
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  body: { marginTop: 12 },
  next: { marginTop: 24, color: '#00450D' },
});
