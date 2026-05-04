import React from 'react';
import { StyleSheet, View, Image, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';

export default function Onboarding03() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Image source={require('@/assets/images/onboarding/onboarding-03.png')} style={styles.image} resizeMode="contain" />

        <ThemedText type="title">Cotiser ensemble</ThemedText>
        <ThemedText style={styles.body}>Contribuez en toute sécurité. Toutes les contributions sont visibles par tous les membres.</ThemedText>
          <View style={{flex : 1 , height: 220}}/>
        <View style={styles.actions}>
          <Button title="Suivant" variant="primary" onPress={() => router.push('/onboarding/04_voter')} />
        </View>

        <View style={styles.dotsRow}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, alignItems: 'center' },
  image: { width: '100%', height: 320, marginBottom: 12 },
  body: { marginTop: 12},
  actions: { width: '100%', marginTop: 16 },
  dotsRow: { flexDirection: 'row', marginTop: 18 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#d9d9d9', marginHorizontal: 4 },
  dotActive: { backgroundColor: '#00450D', width: 8, height: 8,  borderRadius: 4 },
});
