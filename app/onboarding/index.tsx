import React from 'react';
import { StyleSheet, View, Image, ScrollView, SafeAreaView } from 'react-native';
import { useRouter, Link } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function Onboarding01() {
  const router = useRouter();
  const primary = useThemeColor({}, 'darkGreen') as string;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Image
          source={require('@/assets/images/onboarding/onboarding-01.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <ThemedText type="title">Comment ça marche ?</ThemedText>

        <View style={styles.list}>
          <View style={styles.listItem}>
            <View style={[styles.bullet, { backgroundColor: primary,  }]} >
              <ThemedText style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' , paddingHorizontal: 8 , paddingVertical: 2 }}>1</ThemedText>
            </View>
            <View style={styles.listText}>
              <ThemedText type="defaultSemiBold">Créer votre coopérative</ThemedText>
              <ThemedText>Construisez un objectif commun et lancez votre projet.</ThemedText>
            </View>
          </View>

          <View style={styles.listItem}>
            <View style={[styles.bullet, { backgroundColor: primary,  }]} >
              <ThemedText style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' , paddingHorizontal: 8 , paddingVertical: 2 }}>2</ThemedText>
            </View>
            <View style={styles.listText}>
              <ThemedText type="defaultSemiBold">Cotiser ensemble</ThemedText>
              <ThemedText>Chaque cotisable est enregistré et sécurisé.</ThemedText>
            </View>
          </View>

          <View style={styles.listItem}>
            <View style={[styles.bullet, { backgroundColor: primary,  }]} >
              <ThemedText style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' , paddingHorizontal: 8 , paddingVertical: 2 }}>3</ThemedText>
            </View>
            <View style={styles.listText}>
              <ThemedText type="defaultSemiBold">Voter en transparence</ThemedText>
              <ThemedText>Chaque décision est prise démocratiquement.</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Button title="Commencer maintenant" variant="primary" onPress={() => router.push('/onboarding/02_create_cooperative')} />
           <Button title="Rejoindre une coopérative" variant="secondary" onPress={() => router.push('/connexion')} />
        </View>

        <View style={styles.dotsRow}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 , justifyContent:'center' , alignItems:'center' },
  content: { paddingHorizontal: 24, alignItems: 'center' },
  image: { width: '100%', height: 240  },
  list: { width: '100%', marginTop: 24 },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  bullet: { width: 28, height: 28, borderRadius: 14, marginRight: 12 },
  listText: { flex: 1 },
  actions: { width: '100%', marginTop: 24 , flexDirection: 'column' , gap: 12},
  joinLink: { marginTop: 12, paddingVertical: 12, borderRadius: 12, borderWidth: 2, borderColor: '#00450D', alignItems: 'center' },
  joinLinkText: { color: '#00450D', paddingVertical: 6 , flex: 1  , alignContent: 'center' },
  dotsRow: { flexDirection: 'row', marginTop: 18, gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#d9d9d9', marginHorizontal: 4 },
  dotActive: { backgroundColor: '#00450D', width: 8, height: 8, borderRadius: 4 },
});
