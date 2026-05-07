import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { TabButtons } from '@/components/ui/tab';
import { SearchBar } from '@/components/ui/search-bar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

const { width } = Dimensions.get('window');
const primaryColor = useThemeColor({}, 'darkGreen') as string;
const textColor = useThemeColor({}, 'text') as string;


type OrderStatus = 'En attente' | 'Validée' | 'Expédiée' | 'Livrée';

interface Order {
  id: string;
  name: string;
  product: string;
  baseAmount: string;
  amount: string;
  status: OrderStatus;
  date: string;
}

const STATUS_STYLE = {
  'En attente': { label: 'En attente', color: '#D97706', bg: '#FEF3E2' },
  'Validée': { label: 'Validée', color: primaryColor , bg: '#E8F5EC' },
  'Expédiée': { label: 'Expédiée', color: '#4A90E2', bg: '#EBF3FD' },
  'Livrée': { label: 'Livrée', color: '#6B7280', bg: '#F3F4F6' },
};

const ALL_ORDERS: Order[] = [
  {
    id: '#CMD-00012',
    name: 'Jean Dupont',
    product: 'Kit Solaire Résidentiel 1kW',
    baseAmount: '180 000 FCFA',
    amount: '180 000 FCFA',
    status: 'En attente',
    date: "Aujourd'hui à 10:30",
  },
  {
    id: '#CMD-00011',
    name: 'Marie Claire',
    product: 'Kit Solaire Résidentiel 3kW',
    baseAmount: '450 000 FCFA',
    amount: '450 000 FCFA',
    status: 'Validée',
    date: 'Hier à 15:45',
  },
  {
    id: '#CMD-00010',
    name: 'Paul Mwondo',
    product: 'Kit Solaire Portable 300W',
    baseAmount: '95 000 FCFA',
    amount: '95 000 FCFA',
    status: 'Expédiée',
    date: '18 Mai 2024',
  },
  {
    id: '#CMD-00009',
    name: 'Aminata S.',
    product: 'Kit Solaire Hybride 5kW',
    baseAmount: '850 000 FCFA',
    amount: '850 000 FCFA',
    status: 'Livrée',
    date: '16 Mai 2024',
  },
];

const TABS = [
  { id: 'all', label: 'Toutes (12)' },
  { id: 'pending', label: 'En attente (3)' },
  { id: 'validated', label: 'Validées (4)' },
  { id: 'shipped', label: 'Expédiées (3)' },
  { id: 'delivered', label: 'Livrées (2)' },
];

const TAB_STATUS_MAP: Record<string, OrderStatus | null> = {
  all: null,
  pending: 'En attente',
  validated: 'Validée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
};


function ActionButton({ status }: { status: OrderStatus }) {
  const config = {
    'En attente': {
      label: 'Valider',
      icon: 'checkmark.circle.fill' as const,
      style: cardStyles.btnPrimary,
      textStyle: cardStyles.btnPrimaryText,
    },
    Validée: {
      label: 'Préparer',
      icon: 'shippingbox' as const,
      style: cardStyles.btnSecondary,
      textStyle: cardStyles.btnSecondaryText,
    },
    Expédiée: {
      label: 'Marquer livrée',
      icon: 'box.truck' as const,
      style: cardStyles.btnOutline,
      textStyle: cardStyles.btnOutlineText,
    },
    Livrée: null,
  }[status];

  if (!config) return null;

  return (
    <TouchableOpacity style={[cardStyles.actionBtn, config.style]} activeOpacity={0.8}>
      <IconSymbol name={config.icon} size={14} color={status === 'En attente' ? '#fff' : primaryColor} />
      <ThemedText style={config.textStyle}>{config.label}</ThemedText>
    </TouchableOpacity>
  );
}

function OrderCard({ item }: { item: Order }) {
  const badge = STATUS_STYLE[item.status];

  return (
    <Card style={cardStyles.card}>
      {/* Row 1 : ID + badge + date */}
      <View style={cardStyles.topRow}>
        <View style={cardStyles.idBadgeRow}>
          <ThemedText style={cardStyles.orderId}>{item.id}</ThemedText>
          <View style={[cardStyles.badge, { backgroundColor: badge.bg }]}>
            <ThemedText style={[cardStyles.badgeText, { color: badge.color }]}>
              {badge.label}
            </ThemedText>
          </View>
        </View>
        <ThemedText style={cardStyles.date}>{item.date}</ThemedText>
      </View>

      {/* Row 2 : customer + product + amount */}
      <ThemedText style={cardStyles.customerName}>{item.name}</ThemedText>
      <ThemedText style={cardStyles.productName}>{item.product}</ThemedText>
      <View style={cardStyles.amountRow}>
        <ThemedText style={cardStyles.baseAmount}>{item.baseAmount}</ThemedText>
        <ThemedText style={cardStyles.amount}>{item.amount}</ThemedText>
      </View>

      {/* Divider */}
      <View style={cardStyles.divider} />

      {/* Row 3 : actions */}
      <View style={cardStyles.actionsRow}>
        <TouchableOpacity style={cardStyles.detailsBtn} activeOpacity={0.7}>
          <MaterialIcons name="visibility" size={15} color="#6B7280" />
          <ThemedText style={cardStyles.detailsText}>Voir détails</ThemedText>
        </TouchableOpacity>
        <ActionButton status={item.status} />
      </View>
    </Card>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  idBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  orderId: { fontSize: 14, fontWeight: '700', color: textColor },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 11, fontWeight: '600' },
  date: { fontSize: 11, color: '#9CA3AF' },
  customerName: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  productName: { fontSize: 14, fontWeight: '700', color: textColor },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  baseAmount: { fontSize: 12, color: '#9CA3AF' },
  amount: { fontSize: 15, fontWeight: '800', color: primaryColor },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 10 },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  detailsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailsText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
  },
  btnPrimary: { backgroundColor: primaryColor },
  btnPrimaryText: { fontSize: 13, color: '#fff', fontWeight: '700' },
  btnSecondary: { backgroundColor: '#E8F5EC', borderWidth: 1, borderColor: '#B7DFC4' },
  btnSecondaryText: { fontSize: 13, color: primaryColor, fontWeight: '700' },
  btnOutline: { borderWidth: 1, borderColor: primaryColor, backgroundColor: '#fff' },
  btnOutlineText: { fontSize: 13, color: primaryColor, fontWeight: '700' },
});

export default function Commandes() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const statusFilter = TAB_STATUS_MAP[activeTab];
  const filtered = ALL_ORDERS.filter((o) => {
    const matchesTab = statusFilter === null || o.status === statusFilter;
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <ThemedView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn}>
          <IconSymbol size={22} name="chevron.left" color="#1A1A1A" />
        </TouchableOpacity>
        <ThemedText type='title'>Commandes</ThemedText>
      </View>

      {/* Search + Filtrer */}
      <SearchBar placeholder="Rechercher une commande..." value={search} onChangeText={setSearch} showFilter={true} />

      {/* Tabs underline variant */}
      <TabButtons
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="underline"
      />

      {/* Orders list */}
      <FlatList
        data={filtered}
        keyExtractor={(o) => o.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <OrderCard item={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="inbox" size={40} color="#D1D5DB" />
            <ThemedText style={styles.emptyText}>Aucune commande trouvée</ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 52 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  backBtn: { padding: 2 },

  // List
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  empty: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 14, color: '#9CA3AF' },
});