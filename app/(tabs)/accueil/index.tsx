import React from 'react';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function Dashboard() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Tableau de bord</ThemedText>
      <ThemedText style={styles.body}>Contenu dynamique du dashboard (prototype).</ThemedText>
      <Link href="/accueil/123" style={styles.next}>
        Voir détail (exemple)
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  body: { marginTop: 12 },
  next: { marginTop: 24, color: '#00450D' },
});
