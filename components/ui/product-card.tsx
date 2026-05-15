import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
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
  const muted = useThemeColor({}, 'textMuted') as string;
  const darkGreen = useThemeColor({}, 'darkGreen') as string;
  const accentGreen = useThemeColor({}, 'accentGreen') as string;
  const statusColor = available ? accentGreen : '#e05656';
  const isEditMode = variant === 'edit';

  return (
    <View style={[styles.card, { borderColor: border }]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.content}>
        <Image
          source={imageUri ? { uri: imageUri } : PLACEHOLDER}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.info}>
          <View style={[styles.badge, { backgroundColor: available ? '#E8F5EC' : '#FFF0F0' }]}>
            <View style={[styles.badgeDot, { backgroundColor: statusColor }]} />
            <ThemedText style={[styles.badgeText, { color: statusColor }]}>
              {available ? 'Disponible' : 'Indisponible'}
            </ThemedText>
          </View>

          <ThemedText style={styles.name} numberOfLines={2}>
            {name}
          </ThemedText>

          <ThemedText style={styles.price}>{price}</ThemedText>

          <ThemedText style={[styles.stock, { color: darkGreen }]}>
            Stock : {stock > 0 ? `${stock} unités` : '0 unité'}
          </ThemedText>

          {publishDate && (
            <ThemedText style={[styles.publishDate, { color: muted }]}>
              Publié le {publishDate}
            </ThemedText>
          )}
        </View>
      </TouchableOpacity>

      {isEditMode && (
        <>
          <View style={[styles.divider, { backgroundColor: border }]} />
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={onEdit}
              style={[styles.actionBtn, styles.editBtn]}
              activeOpacity={0.7}
            >
              <IconSymbol name="square.and.pencil" size={15} color={darkGreen} />
              <ThemedText style={[styles.actionText, { color: darkGreen }]}>Modifier</ThemedText>
            </TouchableOpacity>

            <View style={[styles.actionDivider, { backgroundColor: border }]} />

            <TouchableOpacity
              onPress={onDelete}
              style={[styles.actionBtn, styles.deleteBtn]}
              activeOpacity={0.7}
            >
              <IconSymbol name="trash" size={15} color="#e05656" />
              <ThemedText style={[styles.actionText, { color: '#e05656' }]}>Supprimer</ThemedText>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    gap: 12,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  info: {
    flex: 1,
    gap: 4,
  },


  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 2,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Text
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 20,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 2,
  },
  stock: {
    fontSize: 13,
    fontWeight: '500',
  },
  publishDate: {
    fontSize: 12,
  },


  divider: {
    height: 1,
  },

  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
  },
  editBtn: {
    backgroundColor: '#fff',
  },
  deleteBtn: {
    backgroundColor: '#fff',
  },
  actionDivider: {
    width: 1,
    height: 20,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});