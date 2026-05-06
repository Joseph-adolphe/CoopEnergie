import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';

export default function CreationProduitStep2() {
  const router = useRouter();
  const params = useLocalSearchParams() as any;

  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [brand, setBrand] = useState('');
  const [guarantee, setGuarantee] = useState('');

  const [power, setPower] = useState('');
  const [batteryType, setBatteryType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [voltage, setVoltage] = useState('');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; status: 'success' | 'error'; title?: string; message?: string } | null>(null);

  useEffect(() => {
    if (params) {
      if (params.price) setPrice(String(params.price));
      if (params.stock) setStock(String(params.stock));
      if (params.brand) setBrand(String(params.brand));
      if (params.guarantee) setGuarantee(String(params.guarantee));

      if (params.power) setPower(String(params.power));
      if (params.batteryType) setBatteryType(String(params.batteryType));
      if (params.capacity) setCapacity(String(params.capacity));
      if (params.voltage) setVoltage(String(params.voltage));
    }
  }, [params]);

  function buildBaseQuery() {
    const p = params || {};
    return `?name=${encodeURIComponent(p.name || '')}&category=${encodeURIComponent(p.category || '')}&description=${encodeURIComponent(p.description || '')}&image=${encodeURIComponent(p.image || '')}`;
  }

  function handlePrev() {
    const q = `${buildBaseQuery()}&price=${encodeURIComponent(price)}&stock=${encodeURIComponent(stock)}&brand=${encodeURIComponent(brand)}&guarantee=${encodeURIComponent(guarantee)}`;
    router.push(`../fournisseurs/01_creation_produit${q}`);
  }

  function handleNext() {
    if (!price.trim() || !stock.trim()) {
      setStatus({ visible: true, status: 'error', title: 'Champs requis', message: 'Veuillez renseigner le prix et le stock.' });
      return;
    }

    const q = `${buildBaseQuery()}&price=${encodeURIComponent(price)}&stock=${encodeURIComponent(stock)}&brand=${encodeURIComponent(brand)}&guarantee=${encodeURIComponent(guarantee)}&power=${encodeURIComponent(power)}&batteryType=${encodeURIComponent(batteryType)}&capacity=${encodeURIComponent(capacity)}&voltage=${encodeURIComponent(voltage)}`;
    router.push(`../fournisseurs/03_creation_produit${q}`);
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <ThemedText type="title">Détails et spécifications</ThemedText>
        <ThemedText style={{ marginTop: 4 }}>Étape 2 sur 3</ThemedText>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '66%' }]} />
        </View>

        <Card style={{ marginTop: 12 }}>
          <Input label="Prix *" placeholder="Ex: 180000" value={price} onChangeText={setPrice} keyboardType="numeric" />
          <Input label="Stock disponible *" placeholder="Ex: 10" value={stock} onChangeText={setStock} keyboardType="numeric" />
          <Input label="Marque (optionnel)" placeholder="Ex: SunPower" value={brand} onChangeText={setBrand} />
          <Input label="Garantie" placeholder="Ex: 24 mois" value={guarantee} onChangeText={setGuarantee} />

          <ThemedText style={{ marginTop: 12, marginBottom: 8 }}>Spécifications techniques</ThemedText>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Input label="Puissance (W)" placeholder="Ex: 1000" value={power} onChangeText={setPower} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="Type de batterie" placeholder="Ex: Lithium" value={batteryType} onChangeText={setBatteryType} />
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Input label="Capacité batterie (Wh)" placeholder="Ex: 1000" value={capacity} onChangeText={setCapacity} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="Tension (V)" placeholder="Ex: 12V" value={voltage} onChangeText={setVoltage} />
            </View>
          </View>
        </Card>

        <View style={{ marginTop: 18, flexDirection: 'row', gap: 8 }}>
          <Button title="Précédent" variant="secondary" onPress={handlePrev} />
          <Button title="Suivant" variant="primary" onPress={handleNext} />
        </View>
      </ScrollView>

      <LoadingModal visible={loading} />
      {status ? (
        <StatusModal visible={status.visible} status={status.status} title={status.title} message={status.message} onClose={() => setStatus((s) => (s ? { ...s, visible: false } : s))} />
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressBar: { height: 6, backgroundColor: '#eef2f1', borderRadius: 6, overflow: 'hidden', marginTop: 12 },
  progressFill: { height: '100%', backgroundColor: '#16A34A' },
});
