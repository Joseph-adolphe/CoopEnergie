import React from 'react';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function ResetPassword() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Réinitialisation</ThemedText>
      <ThemedText style={styles.body}>Choisissez un nouveau mot de passe.</ThemedText>
      <Link href="/connexion" style={styles.next}>
        Retour à la connexion
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  body: { marginTop: 12 },
  next: { marginTop: 24, color: '#00450D' },
});
