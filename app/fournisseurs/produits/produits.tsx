import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ProductCard } from '@/components/ui/product-card';

const PRODUCTS = [
  { id: 'p1', name: 'Kit Solaire Résidentiel 1kW', price: '180 000 FCFA', stock: 12, available: true },
  { id: 'p2', name: 'Kit Solaire Résidentiel 3kW', price: '450 000 FCFA', stock: 7, available: true },
  { id: 'p3', name: 'Kit Solaire Hybride 5kW', price: '850 000 FCFA', stock: 0, available: false },
  { id: 'p4', name: 'Kit Solaire Portable 300W', price: '95 000 FCFA', stock: 5, available: true },
];

export default function Produits() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Mes produits</ThemedText>

      <FlatList
        data={PRODUCTS}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <ProductCard name={item.name} price={item.price} stock={item.stock} available={item.available} />
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1 , paddingTop: 48 , paddingHorizontal: 20 },
});
