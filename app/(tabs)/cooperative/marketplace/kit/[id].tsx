import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function KitDetail() {
  const { id } = useLocalSearchParams();
  const [showDetails, setShowDetails] = useState(false);
  const [showAboutMore, setShowAboutMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; status: 'success' | 'error'; title?: string; message?: string } | null>(null);

  // Mock product data (replace with API)
  const product = {
    id,
    name: 'Kit Solaire Résidentiel 1kW',
    price: 180000,
    rating: 4.8,
    reviews: 25,
    stock: 12,
    guarantee: '24 mois',
    delivery: '2 - 5 jours',
    seller: { name: 'SolarPlus Cameroun', rating: 4.8 },
    description:
      "Kit solaire complet idéal pour les foyers. Il permet d'alimenter l'éclairage, la télévision, les ventilateurs et de recharger vos téléphones. Contient panneaux, batterie, contrôleur et accessoires.",
    capabilities: ['5 - 6 ampoules LED', '1 Téléviseur', '1 Ventilateur', '5 - 6 Téléphones'],
    technical: {
      Puissance: '1000 W',
      'Panneau solaire': '2 x 550W',
      'Capacité batterie': '1000 Wh',
      'Type de batterie': 'Lithium',
      'Contrôleur': 'MPPT 20A',
      Onduleur: '1000W',
      'Tension de sortie': '220V',
      'Durée de vie': '10+ ans',
      Dimensions: '100 x 60 x 30 cm',
      Poids: '25 kg',
    },
  };

  const accent = useThemeColor({}, 'accentGreen') as string;
  const darkGreen = useThemeColor({}, 'darkGreen') as string;

  function handleContact() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatus({ visible: true, status: 'success', title: 'Contact envoyé', message: 'Le fournisseur a été contacté.' });
    }, 700);
  }

  function handleAddToQuote() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatus({ visible: true, status: 'success', title: 'Ajouté au devis', message: 'Le produit a été ajouté au devis.' });
    }, 700);
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140  }}>
        <Image source={require('@/assets/images/placeholder.png')} style={styles.image} resizeMode="cover" />

       <View style={styles.meta}>

           <View >
          <View style={{ flex: 1 }}>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: accent }]}>
                <ThemedText style={{ color: '#fff' , fontSize: 12 }}>Disponible</ThemedText>
              </View>
            </View>

            <ThemedText type="title" style={{ marginTop: 6 }}>{product.name}</ThemedText>
            <ThemedText type="text" style={{ marginTop: 6 }}>{`${product.rating} ⭐ (${product.reviews} avis)`}</ThemedText>

            <ThemedText type="defaultSemiBold" style={{ color: darkGreen, marginTop: 8, fontSize: 22 }}>{`${product.price.toLocaleString()} FCFA`}</ThemedText>
            <ThemedText type="text">Prix TTC</ThemedText>
          </View>
        </View>

        {/* <Card style={{ marginTop: 12 }}>
          <View style={styles.featuresRow}>
            <View style={styles.featureItem}><IconSymbol name={'cart.fill' as any} size={18} color={darkGreen} /><ThemedText style={{ marginLeft: 8 }}>Stock disponible{`\n`}{product.stock} unités</ThemedText></View>
            <View style={styles.featureItem}><IconSymbol name={'chevron.right' as any} size={18} color={darkGreen} /><ThemedText style={{ marginLeft: 8 }}>Garantie{`\n`}{product.guarantee}</ThemedText></View>
            <View style={styles.featureItem}><IconSymbol name={'paperplane.fill' as any} size={18} color={darkGreen} /><ThemedText style={{ marginLeft: 8 }}>Livraison{`\n`}{product.delivery}</ThemedText></View>
          </View>
        </Card> */}

        <Card style={{ marginTop: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar size={48} name={product.seller.name} />
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold">{product.seller.name}</ThemedText>
              <ThemedText type="text">{`${product.seller.rating} ⭐ (${product.reviews} avis)`}</ThemedText>
              <ThemedText style={{ color: darkGreen, marginTop: 6 }}>Fournisseur vérifié</ThemedText>
            </View>
            <TouchableOpacity>
              <IconSymbol name={'chevron.right' as any} size={20} color={darkGreen} />
            </TouchableOpacity>
          </View>
        </Card>

        <View style={{ marginTop: 12 }}>
          <ThemedText type="defaultSemiBold">À propos du produit</ThemedText>
          <ThemedText type='text' style={{ marginTop: 8 }}>{showAboutMore ? product.description : `${product.description.slice(0, 140)}...`}</ThemedText>
          <TouchableOpacity onPress={() => setShowAboutMore((s) => !s)}>
            <ThemedText style={{ color: darkGreen, marginTop: 8 }}>{showAboutMore ? 'Voir moins' : 'Voir plus'}</ThemedText>
          </TouchableOpacity>
        </View>

        <Card style={{ marginTop: 12 }}>
          <ThemedText type="defaultSemiBold">Ce kit vous permet d'alimenter</ThemedText>
          <View style={styles.capabilitiesGrid}>
            {product.capabilities.map((c, i) => (
              <View key={i} style={styles.capabilityItem}>
                <ThemedText type='text'>- {c}</ThemedText>
              </View>
            ))}
          </View>
        </Card>

        <TouchableOpacity style={styles.detailsToggle} onPress={() => setShowDetails((s) => !s)}>
          <ThemedText style={{ color: darkGreen }}>{showDetails ? 'Masquer les détails techniques' : 'Voir les détails techniques'}</ThemedText>
        </TouchableOpacity>

        {showDetails ? (
          <Card style={{ marginTop: 8 }}>
            {Object.entries(product.technical).map(([k, v]) => (
              <View key={k} style={styles.techRow}>
                <ThemedText type='text'>{k}</ThemedText>
                <ThemedText type="defaultSemiBold">{v}</ThemedText>
              </View>
            ))}
          </Card>
        ) : null}

       </View>

      </ScrollView>

      <View style={styles.bottomBarWrap} pointerEvents="box-none">
        <View style={styles.bottomBar}>
          <View>
            <ThemedText type="defaultSemiBold">{`${product.price.toLocaleString()} FCFA`}</ThemedText>
            <ThemedText type="text"> disponible : {product.stock} unités</ThemedText>
          </View>

          <View style={{ flexDirection: 'row', gap: 8 , padding: 4}}>
            <Button title="Contacter" variant="secondary" onPress={handleContact} />
            <Button title="soumettre au vote" variant="primary" onPress={handleAddToQuote} />
          </View>
        </View>
      </View>

      <LoadingModal visible={loading} />
      {status ? <StatusModal visible={status.visible} status={status.status} title={status.title} message={status.message} onClose={() => setStatus((s) => (s ? { ...s, visible: false } : s))} /> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: '100%', height: 260, backgroundColor: '#f4f4f4' },
  meta: { padding: 16 },
  badgeRow: { flexDirection: 'row' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 16 },
  featuresRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  featureItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  capabilitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  capabilityItem: { width: '48%', padding: 8, marginBottom: 4 },
  detailsToggle: { marginTop: 12, paddingHorizontal: 16 },
  techRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  bottomBarWrap: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  bottomBar: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
});
