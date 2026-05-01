import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { useThemeColor } from '@/hooks/use-theme-color';

const SUPPLIERS = [
  { id: 's1', name: 'SolarPlus Cameroun', price: '180 000 FCFA', available: true, rating: 4.8 },
  { id: 's2', name: 'Green Energy', price: '195 000 FCFA', available: true, rating: 4.6 },
  { id: 's3', name: 'SunPower Solutions', price: '185 000 FCFA', available: true, rating: 4.5 },
  { id: 's4', name: 'EcoSolar', price: '190 000 FCFA', available: true, rating: 4.3 },
];

export default function Catalogue() {
  const [query, setQuery] = useState('');
  const bgNote = useThemeColor({}, 'accentGreen') as string;

  const filtered = SUPPLIERS.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Fournisseurs</ThemedText>

      <Input placeholder="Rechercher un fournisseur..." value={query} onChangeText={setQuery} />

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingVertical: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardLeft}>
              <Avatar name={item.name} size={56} />
            </View>
            <View style={styles.cardBody}>
              <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
              <ThemedText style={styles.small}>{item.rating} ⭐ (25 avis)</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.price}>{item.price}</ThemedText>
            </View>
            <View style={styles.cardRight}>
              <ThemedText style={styles.available}>{item.available ? 'Disponible' : 'Indisponible'}</ThemedText>
              <Link href={`/marketplace/kit/${item.id}`} style={styles.link}>
                Voir
              </Link>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={[styles.footerNote, { backgroundColor: bgNote }]}> 
        <ThemedText style={styles.footerText}>Tous les fournisseurs sont vérifiés et évalués par la communauté.</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 12 },
  cardLeft: { marginRight: 12 },
  cardBody: { flex: 1 },
  cardRight: { alignItems: 'flex-end' },
  small: { fontSize: 12, color: '#6b6b6b', marginTop: 4 },
  price: { marginTop: 6, fontSize: 18 },
  available: { color: '#138a2d', fontWeight: '600' },
  link: { marginTop: 8, color: '#00450D' },
  footerNote: { padding: 14, borderRadius: 10, marginTop: 12 },
  footerText: { color: '#fff' },
});
