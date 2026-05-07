import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { ListItem } from '@/components/ui/list-item';
import { spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

// ===== IMPORT SUPABASE =====
import { getUser } from '@/services/supabaseService';

export default function CompteIndex() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const darkGreen = useThemeColor({}, 'darkGreen') as string;

  // ===== RÉCUPÉRER LES DONNÉES DE L'UTILISATEUR =====
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // TEMPORAIRE : Récupère le premier utilisateur
      // En production, ce serait l'utilisateur connecté via AuthContext
      const userId = 'b3c965b9-7df6-45c2-92c3-809c6c8c3741'; // ID de test

      const userData = await getUser(userId);

      console.log('✅ Utilisateur récupéré :', userData);

      // Formate les données pour l'affichage
      const formattedUser = {
        id: userData.id,
        name: userData.nom || 'Utilisateur',
        role: userData.role || 'adhérent',
        phone: userData.telephone || 'Non fourni',
        email: userData.email || 'Non fourni',
        memberSince: new Date(userData.date_creation).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
        }),
      };

      setUser(formattedUser);
    } catch (err: any) {
      console.error('❌ Erreur :', err.message);
      setError(err.message || 'Erreur lors du chargement');
      
      // Données par défaut en cas d'erreur
      setUser({
        name: 'Utilisateur',
        role: 'adhérent',
        phone: 'Non disponible',
        email: 'Non disponible',
        memberSince: 'Janvier 2026',
      });
    } finally {
      setLoading(false);
    }
  };

  // ===== LOADING STATE =====
  if (loading && !user) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={darkGreen} />
        <ThemedText style={{ marginTop: spacing.md }}>Chargement du profil...</ThemedText>
      </ThemedView>
    );
  }

  // ===== RENDER =====
  return (
    <ThemedView style={styles.container}>
      {/* Header avec infos utilisateur */}
      <View style={styles.header}>
        <Avatar name={user?.name || 'Utilisateur'} size={72} />
        <View style={styles.headerText}>
          <ThemedText type="title">{user?.name}</ThemedText>
          <ThemedText type="subtitle">{`Rôle : ${user?.role}`}</ThemedText>
          <ThemedText style={styles.contact}>{user?.phone}</ThemedText>
          <ThemedText style={styles.contact}>{user?.email}</ThemedText>
          <ThemedText style={[styles.contact, { fontSize: 12, opacity: 0.7 }]}>
            {`Membre depuis ${user?.memberSince}`}
          </ThemedText>
        </View>
      </View>

      {/* Menu options */}
      <View style={{ marginTop: spacing.rLg }}>
        <ListItem
          title="Informations personnelles"
          icon={'person.fill' as any}
          onPress={() => router.push('../compte/informations')}
        />
        <ListItem
          title="Sécurité"
          icon={'lock' as any}
          subtitle="Modifier votre mot de passe"
          onPress={() => router.push('../compte/securite')}
        />
        <ListItem
          title="Langue"
          icon={'globe' as any}
          subtitle="Français"
          onPress={() => {}}
        />
        
        {/* Bouton rafraîchir */}
        <ListItem
          title="Rafraîchir les données"
          icon={'arrow.clockwise' as any}
          onPress={fetchUserData}
        />

        <ListItem
          title="Déconnexion"
          icon={'rectangle.portrait.and.arrow.right' as any}
          onPress={() => router.push('../connexion')}
        />
      </View>

      {/* Message d'erreur si applicable */}
      {error && (
        <View style={{ marginTop: spacing.lg, padding: spacing.md, backgroundColor: '#FFE8E8', borderRadius: 8 }}>
          <ThemedText style={{ color: '#FF6B6B' }}>⚠️ {error}</ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 48 },
  headerText: { marginLeft: 16, flex: 1 },
  contact: { marginTop: 6 },
});
