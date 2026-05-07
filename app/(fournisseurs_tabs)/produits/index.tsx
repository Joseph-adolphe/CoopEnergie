import React, { useState } from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ProductCard } from '@/components/ui/product-card';
import { SearchBar } from '@/components/ui/search-bar';
import { Button } from '@/components/ui/button';
import { TabButtons } from '@/components/ui/tab';
import { useThemeColor } from '@/hooks/use-theme-color';

const PRODUCTS = [
  { id: 'p1', name: 'Kit Solaire Résidentiel 1kW', price: '180 000 FCFA', stock: 12, available: true, publishDate: '20 Mai 2024' },
  { id: 'p2', name: 'Kit Solaire Résidentiel 3kW', price: '450 000 FCFA', stock: 7, available: true, publishDate: '18 Mai 2024' },
  { id: 'p3', name: 'Kit Solaire Hybride 5kW', price: '850 000 FCFA', stock: 0, available: false, publishDate: '15 Mai 2024' },
  { id: 'p4', name: 'Kit Solaire Portable 300W', price: '95 000 FCFA', stock: 5, available: true, publishDate: '12 Mai 2024' },
];

const TABS = [
  { id: 'all', label: 'Tous (8)' },
  { id: 'available', label: 'Disponibles (6)' },
  { id: 'unavailable', label: 'Indisponibles (2)' },
];

export default function Produits() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const darkGreen = useThemeColor({}, 'darkGreen') as string;

  const filtered = PRODUCTS.filter((p) => {
    const matchesTab =
      activeTab === 'all' || (activeTab === 'available' && p.available) || (activeTab === 'unavailable' && !p.available);
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  function handleEdit(id: string) {
    // TODO: navigate to edit product or show modal
  }

  function handleDelete(id: string) {
    // TODO: delete product
  }

  function handleAddProduct() {
    router.push('/(fournisseurs_tabs)/produits/01_creation_produit');
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Mes produits</ThemedText>
        <Button title="+ Ajouter un produit" variant="primary" size="sm" onPress={handleAddProduct} />
      </View>

      <SearchBar placeholder="Rechercher un produit..." value={search} onChangeText={setSearch} showFilter={true} />

      <TabButtons tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} variant="underline" />

      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <ProductCard
            name={item.name}
            price={item.price}
            stock={item.stock}
            available={item.available}
            publishDate={item.publishDate}
            variant="edit"
            onEdit={() => handleEdit(item.id)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 32 },
});
