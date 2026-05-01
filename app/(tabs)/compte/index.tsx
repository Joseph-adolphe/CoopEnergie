import React from 'react';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function CompteIndex() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Mon compte</ThemedText>
      <ThemedText style={styles.body}>Profil, notifications, historique et paramètres.</ThemedText>
      <Link href="/compte/profil/uid-123" style={styles.next}>
        Voir mon profil (exemple)
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  body: { marginTop: 12 },
  next: { marginTop: 24, color: '#00450D' },
});
