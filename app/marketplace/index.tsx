import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/ui/product-card';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Button } from '@/components/ui/button';

// ===== IMPORT SUPABASE =====
import { supabase } from '@/config/supabase';

export default function MarketplaceIndex() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accent = useThemeColor({}, 'accentGreen') as string;
  const darkGreen = useThemeColor({}, 'darkGreen') as string;

  // ===== RÉCUPÉRER LES KITS SOLAIRES =====
  useEffect(() => {
    fetchProducts();
  }, []);

  // ===== FILTRER LES PRODUITS =====
  useEffect(() => {
    const filtered = products.filter((p) =>
      p.nom.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [query, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupère tous les kits solaires avec les informations du fournisseur
      const { data: kits, error: kitsError } = await supabase
        .from('produits_solaires')
        .select('*, fournisseurs(nom, contact)')
        .order('date_creation', { ascending: false });

      if (kitsError) {
        throw kitsError;
      }

      console.log('✅ Kits solaires récupérés :', kits);

      // Formate les données pour l'affichage
      const formattedProducts = (kits || []).map((kit: any) => ({
        id: kit.id,
        name: kit.nom,
        price: `${kit.prix?.toLocaleString('fr-FR')} FCFA`,
        priceValue: kit.prix,
        capacite: kit.capacite,
        description: kit.description,
        fournisseur: kit.fournisseurs?.nom || 'Fournisseur inconnu',
        stock: 5, // Par défaut (à adapter selon votre logique)
        available: true,
      }));

      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
    } catch (err: any) {
      console.error('❌ Erreur :', err.message);
      setError(err.message || 'Erreur lors du chargement des produits');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== LOADING =====
  if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={darkGreen} />
        <ThemedText style={{ marginTop: 12 }}>Chargement du catalogue...</ThemedText>
      </ThemedView>
    );
  }

  // ===== RENDER =====
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Catalogue</ThemedText>

      <Input placeholder="Rechercher un produit..." value={query} onChangeText={setQuery} />

      <FlatList
        data={filteredProducts}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingVertical: 12 }}
        ListHeaderComponent={()=>{
            <View style={styles.summary}>
            <ThemedText style={{ fontSize: 12, opacity: 0.7 }}>
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} disponible
              {filteredProducts.length > 1 ? 's' : ''}
            </ThemedText>
          </View>
        }
        }
        renderItem={({ item }) => (
          <Link href={`/marketplace/kit/${item.id}`} asChild>
            <ProductCard name={item.name} price={item.price} stock={item.stock} available={item.available} />
          </Link>
        )}
        ListEmptyComponent={()=>(
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText style={{ textAlign: 'center', opacity: 0.7, marginBottom: 12 }}>
            {products.length === 0
              ? 'Aucun kit solaire disponible pour le moment'
              : 'Aucun produit ne correspond à votre recherche'}
          </ThemedText>
          {products.length === 0 && (
            <Button
              title="Rafraîchir"
              variant="secondary"
              onPress={fetchProducts}
            />
          )}
        </View>
        )
        }
      />

      <ThemedText style={styles.footerText}>
        Tous les produits affichés proviennent de fournisseurs vérifiés.
      </ThemedText>

      {/* Message d'erreur */}
      {error && (
        <View style={{ marginTop: 12, padding: 12, backgroundColor: '#FFE8E8', borderRadius: 8 }}>
          <ThemedText style={{ color: '#FF6B6B', fontSize: 12 }}>
             {error}
          </ThemedText>
          <Button
            title="Réessayer"
            variant="secondary"
            style={{ marginTop: 8 }}
            onPress={fetchProducts}
          />
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,  paddingHorizontal: 16 },
  footerText: { fontSize: 12, color: '#6b6b6b', margin: 12, textAlign: 'center' },
  summary: { paddingVertical: 12, alignItems: 'center' },
});
