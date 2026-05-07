import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Image, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';

export default function CreationProduitStep3() {
  const router = useRouter();
  const params = useLocalSearchParams() as any;

  const [kitContent, setKitContent] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [deliveryZone, setDeliveryZone] = useState('');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; status: 'success' | 'error'; title?: string; message?: string } | null>(null);

  useEffect(() => {
    if (params) {
      if (params.kitContent) setKitContent(String(params.kitContent));
      if (params.weight) setWeight(String(params.weight));
      if (params.dimensions) setDimensions(String(params.dimensions));
      if (params.deliveryZone) setDeliveryZone(String(params.deliveryZone));
    }
  }, [params]);

  function buildQueryWithAll(extra: Record<string, string>) {
    const p = params || {};
    const qObj: Record<string, string> = {
      name: p.name || '',
      category: p.category || '',
      description: p.description || '',
      image: p.image || '',
      price: p.price || '',
      stock: p.stock || '',
      brand: p.brand || '',
      guarantee: p.guarantee || '',
      power: p.power || '',
      batteryType: p.batteryType || '',
      capacity: p.capacity || '',
      voltage: p.voltage || '',
      ...extra,
    };
    return (
      '?' +
      Object.entries(qObj)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v || ''))}`)
        .join('&')
    );
  }

  function handlePrev() {
    const q = buildQueryWithAll({ kitContent, weight, dimensions, deliveryZone });
    router.push(`../fournisseurs/02_creation_produit${q}`);
  }

  function handlePublish() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatus({ visible: true, status: 'success', title: 'Produit publié', message: 'Votre produit a bien été publié.' });
    }, 900);
  }

  function onCloseStatus() {
    setStatus((s) => (s ? { ...s, visible: false } : s));
    router.push('../fournisseurs/produits');
  }

  const productPreview = {
    image: params?.image || undefined,
    name: params?.name || 'Produit sans nom',
    category: params?.category || '',
    price: params?.price || '',
    stock: params?.stock || '',
  } as any;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <ThemedText type="title">Informations complémentaires</ThemedText>
        <ThemedText style={{ marginTop: 4 }}>Étape 3 sur 3</ThemedText>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>

        <Card style={{ marginTop: 12 }}>
          <ThemedText>Contenu du kit</ThemedText>
          <Input placeholder="Listez les éléments inclus dans le kit..." value={kitContent} onChangeText={setKitContent} />

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <View style={{ flex: 1 }}>
              <Input label="Poids (kg)" placeholder="Ex: 25" value={weight} onChangeText={setWeight} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="Dimensions (cm)" placeholder="Ex: 100 x 60 x 30" value={dimensions} onChangeText={setDimensions} />
            </View>
          </View>

          <Input label="Lieu de livraison" placeholder="Sélectionner une zone de livraison" value={deliveryZone} onChangeText={setDeliveryZone} />
        </Card>

        <Card style={{ marginTop: 12, borderColor: '#DCFCE7', borderWidth: 1 }}>
          <ThemedText style={{ color: '#065F46' }}>Conseil</ThemedText>
          <ThemedText style={{ marginTop: 6 }}>Fournissez des informations précises pour rassurer vos acheteurs et améliorer vos ventes.</ThemedText>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            {productPreview.image ? (
              <Image source={{ uri: productPreview.image }} style={{ width: 72, height: 72, borderRadius: 6 }} />
            ) : (
              <View style={{ width: 72, height: 72, backgroundColor: '#f4f4f4', borderRadius: 6 }} />
            )}
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold">{productPreview.name}</ThemedText>
              <ThemedText style={{ marginTop: 4 }}>Catégorie: {productPreview.category}</ThemedText>
              <ThemedText style={{ marginTop: 4 }}>Prix: {productPreview.price} FCFA</ThemedText>
              <ThemedText>Stock: {productPreview.stock} unités</ThemedText>
            </View>
          </View>
        </Card>

        <View style={{ marginTop: 18, flexDirection: 'row', gap: 8 }}>
          <Button title="Précédent" variant="secondary" onPress={handlePrev} />
          <Button title="Publier le produit" variant="primary" onPress={handlePublish} />
        </View>
      </ScrollView>

      <LoadingModal visible={loading} />
      {status ? (
        <StatusModal visible={status.visible} status={status.status} title={status.title} message={status.message} onClose={onCloseStatus} />
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressBar: { height: 6, backgroundColor: '#eef2f1', borderRadius: 6, overflow: 'hidden', marginTop: 12 },
  progressFill: { height: '100%', backgroundColor: '#16A34A' },
});
