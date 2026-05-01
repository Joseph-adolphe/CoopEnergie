import React from 'react';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function Historique() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Historique</ThemedText>
      <ThemedText style={styles.body}>Historique des opérations (prototype).</ThemedText>
      <Link href="/compte" style={styles.next}>
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
