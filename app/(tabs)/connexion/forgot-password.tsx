import React from 'react';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function ForgotPassword() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Mot de passe oublié</ThemedText>
      <ThemedText style={styles.body}>Instructions pour réinitialiser le mot de passe.</ThemedText>
      <Link href="/connexion/reset-password" style={styles.next}>
        Réinitialiser
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  body: { marginTop: 12 },
  next: { marginTop: 24, color: '#00450D' },
});
