import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { spacing } from '@/constants/theme';

const PLACEHOLDER = require('@/assets/images/placeholder.png');

type ProductCardProps = {
  id?: string;
  name: string;
  price: string;
  stock?: number;
  available?: boolean;
  imageUri?: string;
  onPress?: () => void;
};

export function ProductCard({ name, price, stock = 0, available = true, imageUri, onPress }: ProductCardProps) {
  const border = useThemeColor({}, 'border') as string;
  const titleColor = useThemeColor({}, 'textPrimary') as string;
  const muted = useThemeColor({}, 'textMuted') as string;
  const statusColor = available ? useThemeColor({}, 'accentGreen') : '#e05656';

  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, { borderColor : border }]}> 
      <Image source={imageUri ? { uri: imageUri } : PLACEHOLDER} style={styles.image} resizeMode="cover" />

     <View>
      <ThemedText type="defaultSemiBold" style={{ color: titleColor , maxWidth: 190 , textOverflow: 'ellipsis' }}>{name}</ThemedText>
      <View style={{flexDirection: 'row'}}>
      <View style={styles.body}>
        <ThemedText style={{ color: muted, marginTop: 6 }}>{stock > 0 ? `Stock : ${stock} unités` : 'Stock : 0 unité'}</ThemedText>
      </View>

      <View style={styles.right}>
        <ThemedText type="defaultSemiBold" style={{ marginBottom: 8 }}>{price}</ThemedText>
        <View style={[styles.badge, { backgroundColor: statusColor }]}>
          <ThemedText style={{ color: '#fff', fontSize: 12 }}>{available ? 'Disponible' : 'Indisponible'}</ThemedText>
        </View>
      </View>
      </View>
     </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1 },
  image: { width: 88, height: 88, borderRadius: 8, marginRight: 12 },
  body: { flex: 1 },
  right: { alignItems: 'flex-end' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
});
