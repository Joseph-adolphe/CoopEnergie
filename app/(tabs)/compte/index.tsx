import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { ListItem } from '@/components/ui/list-item';
import { spacing } from '@/constants/theme';

export default function CompteIndex() {
  const router = useRouter();

  const user = {
    name: 'Marie Dupont',
    memberSince: 'Mai 2024',
    phone: '+237 6 12 34 56 78',
    email: 'marie@gmail.com',
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Avatar name={user.name} size={72} />
        <View style={styles.headerText}>
          <ThemedText type="title">{user.name}</ThemedText>
          <ThemedText type="subtitle">{`Membre depuis ${user.memberSince}`}</ThemedText>
          <ThemedText style={styles.contact}>{user.phone}</ThemedText>
          <ThemedText style={styles.contact}>{user.email}</ThemedText>
        </View>
      </View>

      <View style={{ marginTop: spacing.rLg }}>
        <ListItem title="Informations personnelles" icon={'person.fill' as any} onPress={() => router.push('../compte/informations')} />
        <ListItem title="Sécurité" icon={'lock' as any} subtitle="Modifier votre mot de passe" onPress={() => router.push('../compte/securite')} />
        <ListItem title="Langue" icon={'globe' as any} subtitle="Français" onPress={() => {}} />
        <ListItem  title="Déconnexion" icon={'rectangle.portrait.and.arrow.right' as any} onPress={() => router.push('../connexion')} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 , alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center' , marginTop: 48 },
  headerText: { marginLeft: 16 },
  contact: { marginTop: 6 },
});
