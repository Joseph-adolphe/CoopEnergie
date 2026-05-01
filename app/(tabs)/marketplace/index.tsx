import React from 'react';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function Catalogue() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Catalogue</ThemedText>
      <ThemedText style={styles.body}>Liste des kits disponibles.</ThemedText>
      <Link href="/marketplace/kit/kit-1" style={styles.next}>
        Voir un kit (exemple)
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  body: { marginTop: 12 },
  next: { marginTop: 24, color: '#00450D' },
});
