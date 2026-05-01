import React from 'react';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function Onboarding05() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Atteindre les objectifs</ThemedText>
      <ThemedText style={styles.body}>Suivre les étapes pour atteindre vos objectifs.</ThemedText>
      <Link href="/onboarding/06_bienvenue" style={styles.next}>
        Suivant
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  body: { marginTop: 12 },
  next: { marginTop: 24, color: '#00450D' },
});
