import React from 'react';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';


import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function Parametres() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Paramètres</ThemedText>
      <ThemedText style={styles.body}>Réglages de l'application et du compte.</ThemedText>
      <Link href="../compte" style={styles.next}>
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
