import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { spacing } from '@/constants/theme';
import { IconSymbol } from './icon-symbol';

const PLACEHOLDER = require('@/assets/images/placeholder.png');

type ProductCardProps = {
  id?: string;
  name: string;
  price: string;
  stock?: number;
  available?: boolean;
  imageUri?: string;
  onPress?: () => void;
  variant?: 'default' | 'edit';
  onEdit?: () => void;
  onDelete?: () => void;
  publishDate?: string;
};

export function ProductCard({
  name,
  price,
  stock = 0,
  available = true,
  imageUri,
  onPress,
  variant = 'default',
  onEdit,
  onDelete,
  publishDate,
}: ProductCardProps) {
  const border = useThemeColor({}, 'border') as string;
  const titleColor = useThemeColor({}, 'textPrimary') as string;
  const muted = useThemeColor({}, 'textMuted') as string;
  const darkGreen = useThemeColor({}, 'darkGreen') as string;
  const statusColor = available ? useThemeColor({}, 'accentGreen') : '#e05656';

  const isEditMode = variant === 'edit';

  return (
    <View style={[styles.card, { borderColor: border }]}>
      <TouchableOpacity onPress={onPress} style={styles.content}>
        <Image source={imageUri ? { uri: imageUri } : PLACEHOLDER} style={styles.image} resizeMode="cover" />

        <View style={styles.info}>
          <ThemedText type="defaultSemiBold" style={{ color: titleColor, maxWidth: 190 }}>
            {name}
          </ThemedText>
          <ThemedText style={{ color: muted, marginTop: 6 }}>
            {stock > 0 ? `Stock : ${stock} unités` : 'Stock : 0 unité'}
          </ThemedText>
          {publishDate && <ThemedText style={{ color: muted, marginTop: 4, fontSize: 12 }}>Publié le {publishDate}</ThemedText>}
        </View>

        <View style={styles.right}>
          <ThemedText type="defaultSemiBold" style={{ marginBottom: 8 }}>
            {price}
          </ThemedText>
          <View style={[styles.badge, { backgroundColor: statusColor }]}>
            <ThemedText style={{ color: '#fff', fontSize: 12 }}>
              {available ? 'Disponible' : 'Indisponible'}
            </ThemedText>
          </View>
        </View>
      </TouchableOpacity>

      {isEditMode && (
        <View style={[styles.divider, { backgroundColor: border }]} />
      )}

      {isEditMode && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={onEdit}
            style={[styles.actionBtn, styles.editBtn]}
            activeOpacity={0.7}
          >
            <IconSymbol name="square.and.pencil" size={16} color={darkGreen}/>
            <ThemedText style={[styles.actionText, { color: darkGreen }]}>Modifier</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDelete}
            style={[styles.actionBtn, styles.deleteBtn]}
            activeOpacity={0.7}
          >
            <IconSymbol  name="trash" size={16} color="#e05656"/>
            <ThemedText style={[styles.actionText, { color: '#e05656' }]}>Supprimer</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  image: { width: 88, height: 88, borderRadius: 8, marginRight: 12 },
  info: { flex: 1 },
  right: { alignItems: 'flex-end' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  divider: {
    height: 1,
    marginHorizontal: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    paddingTop: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  editBtn: {
    borderColor: '#1A8C3E',
    backgroundColor: '#f0f9f7',
  },
  deleteBtn: {
    borderColor: '#f0b3b3',
    backgroundColor: '#fff5f5',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
