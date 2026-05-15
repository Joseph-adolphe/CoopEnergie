import React from 'react';
import { StyleSheet, View, Image,  ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function Onboarding01() {
  const router = useRouter();
  const primary = useThemeColor({}, 'darkGreen') as string;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.safe}>
      <View style={styles.top} />
          <View style={styles.center}>
            <Image source={require('@/assets/images/logo.jpg')} style={styles.logo} resizeMode="contain" />
            <ThemedText type="title" style={styles.title}>
              L'energie ensemble
              {'\n'}en toute transparence
            </ThemedText>
          </View>

          <View style={styles.actions}>
            <Button title="commencer maintenant" variant="primary" size="lg" onPress={() => router.push('/02_create_cooperative')} style={styles.primary} />
            <Button title="rejoindre une Cooperative" variant="ghost" size="lg" onPress={() => router.push('/connexion')} style={[styles.secondary, { borderColor: primary, borderWidth: 2 }]} />
          </View>
      </View>
      <ImageBackground source={require('@/assets/images/onboarding/background.png')} style={styles.background} resizeMode='contain'/>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { height : 107 , width: '100%' },
  safe: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24 , gap: 30  },
  top: { height: 40 },
  center: { alignItems: 'center', marginTop: 12 },
  logo: { width: 160, height: 160, marginBottom: 12 },
  title: { textAlign: 'center', marginTop: 8 },
  actions: { width: '100%', paddingBottom: 36 },
  primary: { width: '100%', borderRadius: 14 },
  secondary: { width: '100%', borderRadius: 14, marginTop: 12, backgroundColor: 'transparent' },
});
