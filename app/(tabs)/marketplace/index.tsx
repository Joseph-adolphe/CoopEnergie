import React, { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Link } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/ui/product-card';
import { useThemeColor } from '@/hooks/use-theme-color';

const PRODUCTS = [
  { id: 'p1', name: 'Kit Solaire Résidentiel 1kW', price: '180 000 FCFA', stock: 12, available: true },
  { id: 'p2', name: 'Kit Solaire Résidentiel 3kW', price: '450 000 FCFA', stock: 7, available: true },
  { id: 'p3', name: 'Kit Solaire Hybride 5kW', price: '850 000 FCFA', stock: 0, available: false },
  { id: 'p4', name: 'Kit Solaire Portable 300W', price: '95 000 FCFA', stock: 5, available: true },
];

export default function MarketplaceIndex() {
  const [query, setQuery] = useState('');
  const accent = useThemeColor({}, 'accentGreen') as string;

  const filtered = PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Catalogue</ThemedText>

      <Input placeholder="Rechercher un produit..." value={query} onChangeText={setQuery} />

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingVertical: 12 }}
        renderItem={({ item }) => (
          <Link href={`/marketplace/kit/${item.id}`} asChild>
            <ProductCard name={item.name} price={item.price} stock={item.stock} available={item.available} />
          </Link>
        )}
      />

      <ThemedText style={styles.footerText}>Tous les produits affichés proviennent de fournisseurs vérifiés.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48, paddingHorizontal: 16 },
  footerText: { fontSize: 12, color: '#6b6b6b', margin: 12, textAlign: 'center' },
});
