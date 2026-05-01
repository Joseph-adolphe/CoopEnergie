import React from 'react';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function Onboarding01() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Comment ça marche</ThemedText>
      <ThemedText style={styles.body}>Un aperçu rapide du fonctionnement de l'application.</ThemedText>
      <Link href="/onboarding/02_create_cooperative" style={styles.next}>
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
