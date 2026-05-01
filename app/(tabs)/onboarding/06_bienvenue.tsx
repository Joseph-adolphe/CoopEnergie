import React from 'react';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function Onboarding06() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Bienvenue</ThemedText>
      <ThemedText style={styles.body}>Bienvenue sur CoopEnergie — commençons !</ThemedText>
      <Link href="/accueil" style={styles.next}>
        Aller à l'accueil
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  body: { marginTop: 12 },
  next: { marginTop: 24, color: '#00450D' },
});
