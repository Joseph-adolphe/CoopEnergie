import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { ListItem } from '@/components/ui/list-item';
import { Button } from '@/components/ui/button';
import { StatusModal } from '@/components/ui/status-modal';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/context/AuthContext';

export default function FournisseursCompte() {
  const { logout } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<{ visible: boolean; status: 'success' | 'error'; title?: string; message?: string }>({
    visible: false,
    status: 'success',
  });

  const darkGreen = useThemeColor({}, 'darkGreen') as string;
  const textMuted = useThemeColor({}, 'textMuted') as string;

  function handleLogout() {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnecter',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/connexion');
        },
      },
    ]);
  }

  function handleEditProfile() {
    setStatus({ visible: true, status: 'success', title: 'À bientôt', message: 'Édition de profil à venir.' });
  }

  function handleSettings() {
    setStatus({ visible: true, status: 'success', title: 'Paramètres', message: 'Paramètres en construction.' });
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Profil section */}
        <Card style={styles.profileCard}>
          <View style={styles.profileContent}>
            <Avatar size={64} name="Votre entreprise" />
            <View style={[styles.profileInfo, { marginLeft: 12 }]}>
              <ThemedText type="title">Votre entreprise</ThemedText>
              <ThemedText style={{ color: textMuted, marginTop: 4 }}>Compte fournisseur</ThemedText>
            </View>
          </View>

          <TouchableOpacity style={[styles.editBtn, { borderColor: darkGreen }]} onPress={handleEditProfile} activeOpacity={0.7}>
            <MaterialIcons name="edit" size={16} color={darkGreen} />
            <ThemedText style={{ color: darkGreen, fontWeight: '600', marginLeft: 4 }}>Modifier mon profil</ThemedText>
          </TouchableOpacity>
        </Card>

        {/* Statistics section */}
        <View style={{ marginTop: 20 }}>
          <ThemedText type="defaultSemiBold">Statistiques</ThemedText>
          <View style={styles.statsRow}>
            <Card style={[styles.statCard, { flex: 1 }]}>
              <ThemedText style={{ fontSize: 20, fontWeight: '800', color: darkGreen }}>8</ThemedText>
              <ThemedText style={{ color: textMuted, marginTop: 4 }}>Produits</ThemedText>
            </Card>
            <Card style={[styles.statCard, { flex: 1 }]}>
              <ThemedText style={{ fontSize: 20, fontWeight: '800', color: darkGreen }}>12</ThemedText>
              <ThemedText style={{ color: textMuted, marginTop: 4 }}>Commandes</ThemedText>
            </Card>
            <Card style={[styles.statCard, { flex: 1 }]}>
              <ThemedText style={{ fontSize: 20, fontWeight: '800', color: darkGreen }}>4.8 ⭐</ThemedText>
              <ThemedText style={{ color: textMuted, marginTop: 4 }}>Évaluation</ThemedText>
            </Card>
          </View>
        </View>

        {/* Account options */}
        <View style={{ marginTop: 24 }}>
          <ThemedText type="defaultSemiBold" style={{ marginBottom: 8 }}>
            Compte
          </ThemedText>
          <Card>
            <ListItem
              title="Informations du compte"
              icon={'person.fill' as any}
              onPress={handleEditProfile}
            />
            <View style={styles.divider} />
            <ListItem
              title="Paramètres"
              icon={'gearshape.fill' as any}
              onPress={handleSettings}
            />
            <View style={styles.divider} />
            <ListItem
              title="Notifications"
              icon={'bell.fill' as any}
              onPress={() => setStatus({ visible: true, status: 'success', title: 'Notifications', message: 'Préférences de notifications à venir.' })}
            />
            <View style={styles.divider} />
            <ListItem
              title="Aide et support"
              icon={'questionmark.circle.fill' as any}
              onPress={() => setStatus({ visible: true, status: 'success', title: 'Support', message: 'Centre d\'aide en construction.' })}
            />
          </Card>
        </View>

        {/* Logout section */}
        <View style={{ marginTop: 24, marginBottom: 32 }}>
          <Button title="Se déconnecter" variant="secondary" onPress={handleLogout} />
        </View>
      </ScrollView>

      <StatusModal
        visible={status.visible}
        status={status.status}
        title={status.title}
        message={status.message}
        onClose={() => setStatus((s) => ({ ...s, visible: false }))}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48 },
  profileCard: {
    padding: 16,
    gap: 16,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  statCard: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
});
