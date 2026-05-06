import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';

export default function CreationProduitStep1() {
  const router = useRouter();
  const params = useLocalSearchParams() as any;

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; status: 'success' | 'error'; title?: string; message?: string } | null>(null);

  useEffect(() => {
    if (params) {
      if (params.image) setImageUri(String(params.image));
      if (params.name) setName(String(params.name));
      if (params.category) setCategory(String(params.category));
      if (params.description) setDescription(String(params.description));
    }
  }, [params]);

  async function pickImage() {
    try {
      const { status: permission } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission !== 'granted') {
        Alert.alert('Permission requise', "Autorisez l'accès à la galerie pour ajouter une photo.");
        return;
      }

      const result: any = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 });
      if (!result.cancelled && result.assets?.length) {
        setImageUri(result.assets[0].uri);
      } else if (!result.cancelled && result.uri) {
        setImageUri(result.uri);
      }
    } catch (err) {
      // ignore
    }
  }

  function chooseCategory() {
    Alert.alert('Catégorie', undefined, [
      { text: 'Kits Résidentiels', onPress: () => setCategory('Kits Résidentiels') },
      { text: 'Panneaux', onPress: () => setCategory('Panneaux solaires') },
      { text: 'Batteries', onPress: () => setCategory('Batteries') },
      { text: 'Accessoires', onPress: () => setCategory('Accessoires') },
      { text: 'Annuler', style: 'cancel' },
    ]);
  }

  function handleNext() {
    if (!name.trim() || !category.trim() || !description.trim()) {
      setStatus({ visible: true, status: 'error', title: 'Champs requis', message: 'Veuillez renseigner le nom, la catégorie et la description.' });
      return;
    }

    const q = `?name=${encodeURIComponent(name)}&category=${encodeURIComponent(category)}&description=${encodeURIComponent(description)}&image=${encodeURIComponent(imageUri || '')}`;
    router.push(`../fournisseurs/02_creation_produit${q}`);
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <ThemedText type="title">Ajouter un nouveau produit</ThemedText>
        <ThemedText style={{ marginTop: 4 }}>Étape 1 sur 3</ThemedText>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '33%' }]} />
        </View>

        <Card style={{ marginTop: 12 }}>
          <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <ThemedText>Ajouter une image du produit</ThemedText>
                <ThemedText style={{ marginTop: 8, color: '#16A34A' }}>Choisir une image</ThemedText>
              </View>
            )}
          </TouchableOpacity>

          <Input label="Nom du produit *" placeholder="Ex: Kit Solaire Résidentiel 1kW" value={name} onChangeText={setName} />

          <TouchableOpacity onPress={chooseCategory} activeOpacity={0.8}>
            <Input label="Catégorie *" placeholder="Sélectionner une catégorie" value={category} editable={false} />
          </TouchableOpacity>

          <View style={{ marginTop: 8 }}>
            <ThemedText>Description *</ThemedText>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Décrivez votre produit, ses caractéristiques..."
              multiline
              maxLength={500}
              style={styles.textArea}
            />
            <ThemedText style={{ textAlign: 'right', marginTop: 6 }}>{description.length} / 500</ThemedText>
          </View>
        </Card>

        <View style={{ marginTop: 18 }}>
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
  imageBox: { height: 140, borderRadius: 8, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa' },
  imagePreview: { width: '100%', height: '100%' },
  imagePlaceholder: { justifyContent: 'center', alignItems: 'center' },
  textArea: { minHeight: 100, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)', borderRadius: 8, padding: 12, marginTop: 8, textAlignVertical: 'top' },
});
