import React from 'react';
import { StyleSheet } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function CooperativeHistoryItem() {
  const { id } = useLocalSearchParams();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Historique de la coopérative</ThemedText>
      <ThemedText style={styles.body}>Élément historique — ID: {id}</ThemedText>
      <Link href="/cooperative" style={styles.next}>
        Retour
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  body: { marginTop: 12 },
  next: { marginTop: 24, color: '#00450D' },
});
