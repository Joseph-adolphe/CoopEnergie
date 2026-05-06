import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useThemeColor } from '@/hooks/use-theme-color';

const ORDERS = [
  { id: 'CMD-00012', name: 'Jean Dupont', product: 'Kit Solaire Résidentiel 1kW', amount: '180 000 FCFA', status: 'En attente' },
  { id: 'CMD-00011', name: 'Marie Claire', product: 'Kit Solaire Résidentiel 3kW', amount: '450 000 FCFA', status: 'Validée' },
  { id: 'CMD-00010', name: 'Paul Mwondo', product: 'Kit Solaire Portable 300W', amount: '95 000 FCFA', status: 'Expédiée' },
];

export default function Commandes() {
  const darkGreen = useThemeColor({}, 'darkGreen') as string;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Commandes</ThemedText>

      <FlatList
        data={ORDERS}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <Card style={styles.orderCard}>
            <View style={styles.rowHeader}>
              <ThemedText type="defaultSemiBold">{item.id}</ThemedText>
              <ThemedText style={{ color: darkGreen }}>{item.status}</ThemedText>
            </View>

            <ThemedText style={{ marginTop: 8 }}>{item.name}</ThemedText>
            <ThemedText type="defaultSemiBold" style={{ marginTop: 6 }}>{item.product}</ThemedText>

            <View style={styles.orderFooter}>
              <ThemedText type="defaultSemiBold">{item.amount}</ThemedText>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {item.status === 'En attente' ? <Button title="Valider" variant="primary" onPress={() => {}} /> : null}
                {item.status === 'Validée' ? <Button title="Préparer" variant="secondary" onPress={() => {}} /> : null}
                {item.status === 'Expédiée' ? <Button title="Marquer livrée" variant="primary" onPress={() => {}} /> : null}
              </View>
            </View>
          </Card>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 , paddingTop: 48 , paddingHorizontal: 20 },
  orderCard: { marginBottom: 12, padding: 12 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderFooter: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
