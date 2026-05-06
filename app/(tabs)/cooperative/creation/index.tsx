import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function CreationIndex() {
  const router = useRouter();
  const accent = useThemeColor({}, 'darkGreen') as string;

  useEffect(() => {
    router.replace('/cooperative/creation/01_creation');
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator size="large" color={accent} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
