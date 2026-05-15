import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LineChart } from 'react-native-chart-kit';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import { spacing } from '@/constants/theme';

const screenWidth = Dimensions.get('window').width - 40;

// Switch to MOCK_EMPTY for the empty/onboarding state
const MOCK_EMPTY = {
  commandes: 0,
  ventes: 0,
  produits: 0,
  clients: 0,
  recentOrders: [],
  chartData: null,
};

const MOCK_ACTIVE = {
  commandes: 12,
  ventes: 2580000,
  produits: 8,
  clients: 156,
  recentOrders: [
    {
      id: 'CMD-00012',
      status: 'En attente',
      statusColor: '#F59E0B',
      statusBg: '#FFFBEB',
      client: 'Jean Dupont',
      product: 'Kit Solaire Résidentiel 1kW',
      amount: '180 000 FCFA',
      date: "Aujourd'hui à 10:30",
    },
    {
      id: 'CMD-00011',
      status: 'Validée',
      statusColor: '#16A34A',
      statusBg: '#F0FDF4',
      client: 'Marie Claire',
      product: 'Kit Solaire Résidentiel 3kW',
      amount: '450 000 FCFA',
      date: 'Hier à 15:45',
    },
    {
      id: 'CMD-00010',
      status: 'Expédiée',
      statusColor: '#2563EB',
      statusBg: '#EFF6FF',
      client: 'Paul Mwondo',
      product: 'Kit Solaire Portable 300W',
      amount: '95 000 FCFA',
      date: '18 Mai 2024',
    },
    {
      id: 'CMD-00009',
      status: 'Livrée',
      statusColor: '#16A34A',
      statusBg: '#F0FDF4',
      client: 'Aminata S.',
      product: 'Kit Solaire Hybride 5kW',
      amount: '850 000 FCFA',
      date: '16 Mai 2024',
    },
  ],
  chartData: {
    labels: ['15 Mai', '16 Mai', '17 Mai', '18 Mai', '19 Mai', '20 Mai', '21 Mai'],
    datasets: [{ data: [200000, 320000, 250000, 400000, 370000, 560000, 290000] }],
  },
};

export default function FournisseursDashboard() {
  const router = useRouter();
  const darkGreen = useThemeColor({}, 'darkGreen') as string;
  const accent = useThemeColor({}, 'accentGreen') as string;
  const border = useThemeColor({}, 'border') as string;

  // modifier ici: MOCK_EMPTY ou MOCK_ACTIVE
  const data = MOCK_ACTIVE;
  const isEmpty = data.commandes === 0 && data.produits === 0;

  const [chartRange, setChartRange] = useState('7 derniers jours');


  const stats = [
    {
      id: 's1',
      label: 'Commandes',
      value: data.commandes.toString(),
      sub: data.commandes === 0 ? 'Aucune commande reçue' : 'Nouvelles commandes',
      iconName: 'bag.fill',
      iconBg: '#FFF3E0',
      iconColor: '#F59E0B',
    },
    {
      id: 's2',
      label: 'Ventes (mois)',
      value: data.ventes === 0 ? '0 FCFA' : `${data.ventes.toLocaleString()} FCFA`,
      sub: data.ventes === 0 ? "Chiffre d'affaires" : "Chiffre d'affaires",
      iconName: 'chart.bar.fill',
      iconBg: '#E8F5E9',
      iconColor: darkGreen,
    },
    {
      id: 's3',
      label: 'Produits',
      value: data.produits.toString(),
      sub: data.produits === 0 ? 'Aucun produit en ligne' : 'En ligne',
      iconName: 'shippingbox.fill',
      iconBg: '#EEF2FF',
      iconColor: '#6366F1',
    },
    {
      id: 's4',
      label: 'Clients',
      value: data.clients.toString(),
      sub: data.clients === 0 ? 'Aucun client pour le moment' : 'Total',
      iconName: 'person.2.fill',
      iconBg: '#F3E8FF',
      iconColor: '#9333EA',
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.headerRow}>
          <View>
            {isEmpty ? (
              <>
                <ThemedText type="title">Bonjour jean doe </ThemedText>
                <ThemedText style={styles.headerSub}>Bienvenue sur votre espace prestataire</ThemedText>
              </>
            ) : (
              <>
                <ThemedText type="title">Tableau de bord</ThemedText>
                <ThemedText style={styles.headerSub}>jean doe</ThemedText>
              </>
            )}
          </View>
          <TouchableOpacity onPress={() => router.push('/compte/notifications')} style={styles.notifWrap}>
            <IconSymbol name={'bell' as any} size={22} color={darkGreen} />
            <View style={styles.notifBadge}>
              <ThemedText style={styles.notifBadgeText}>3</ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        {isEmpty && (
          <View style={styles.onboardingBanner}>
            <View style={[styles.onboardingIconWrap, { backgroundColor: '#E8F5E9' }]}>
              <IconSymbol name={'shippingbox.fill' as any} size={24} color={darkGreen} />
            </View>
            <View style={{ flex: 1, marginHorizontal: 12 }}>
              <ThemedText type="defaultSemiBold" style={{ fontSize: 14 }}>
                Commencez à développer votre activité
              </ThemedText>
              <ThemedText style={styles.onboardingText}>
                Ajoutez vos produits ou services et recevez vos premières commandes.
              </ThemedText>
            </View>
            <TouchableOpacity
              style={[styles.onboardingBtn, { backgroundColor: darkGreen }]}
              onPress={() => router.push('/produits/01_creation_produit')}
            >
              <ThemedText style={styles.onboardingBtnText}>Ajouter un produit</ThemedText>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.statGrid}>
          {stats.map((s) => (
            <View key={s.id} style={[styles.statCard, { borderColor: border }]}>
              <View style={styles.statCardHeader}>
                <ThemedText style={styles.statLabel}>{s.label}</ThemedText>
                <View style={[styles.statIconWrap, { backgroundColor: s.iconBg }]}>
                  <IconSymbol name={s.iconName as any} size={20} color={s.iconColor} />
                </View>
              </View>
              <ThemedText style={styles.statValue}>{s.value}</ThemedText>
              <ThemedText style={styles.statSub}>{s.sub}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Commandes récentes</ThemedText>
          <TouchableOpacity onPress={() => router.push('/commandes')}>
            <ThemedText style={[styles.seeAll, { color: darkGreen }]}>Voir tout</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={[styles.sectionCard, { borderColor: border }]}>
          {data.recentOrders.length === 0 ? (
            <View style={styles.emptySection}>
              <View style={[styles.emptyIconCircle, { backgroundColor: '#E8F5E9' }]}>
                <IconSymbol name={'bag.fill' as any} size={28} color={darkGreen} />
              </View>
              <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
                Aucune commande pour le moment
              </ThemedText>
              <ThemedText style={styles.emptySubtitle}>
                Les commandes que vous recevrez apparaîtront ici.
              </ThemedText>
            </View>
          ) : (
            data.recentOrders.map((order, index) => (
              <TouchableOpacity
                key={order.id}
                onPress={() => router.push(`/commandes?q=${order.id}`)}
                style={[
                  styles.orderRow,
                  index < data.recentOrders.length - 1 && { borderBottomWidth: 1, borderBottomColor: border },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <View style={styles.orderTopRow}>
                    <ThemedText style={styles.orderId}>{`#${order.id}`}</ThemedText>
                    <View style={[styles.statusBadge, { backgroundColor: order.statusBg }]}>
                      <ThemedText style={[styles.statusText, { color: order.statusColor }]}>
                        {order.status}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.orderClient}>{order.client}</ThemedText>
                  <ThemedText style={styles.orderProduct}>{order.product}</ThemedText>
                  <ThemedText style={styles.orderAmount}>{order.amount}</ThemedText>
                </View>
                <View style={styles.orderRight}>
                  <ThemedText style={styles.orderDate}>{order.date}</ThemedText>
                  <IconSymbol name={'chevron.right' as any} size={16} color={border} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={[styles.sectionHeader, { marginTop: spacing.rLg ?? 20 }]}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Aperçu des ventes</ThemedText>
          <TouchableOpacity style={[styles.rangeSelector, { borderColor: border }]}>
            <ThemedText style={styles.rangeSelectorText}>{chartRange}</ThemedText>
            <IconSymbol name={'chevron.down' as any} size={14} color="#555" />
          </TouchableOpacity>
        </View>

        <View style={[styles.sectionCard, { borderColor: border }]}>
          {!data.chartData ? (
            <View style={styles.emptySection}>
              <View style={[styles.emptyIconCircle, { backgroundColor: '#E8F5E9' }]}>
                <IconSymbol name={'chart.bar.fill' as any} size={28} color={darkGreen} />
              </View>
              <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
                Aucune donnée disponible
              </ThemedText>
              <ThemedText style={styles.emptySubtitle}>
                Vos ventes seront affichées ici dès que vous aurez reçu vos premières commandes.
              </ThemedText>
            </View>
          ) : (
            <LineChart
              data={data.chartData}
              width={screenWidth - 24}
              height={180}
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: () => accent,
                labelColor: () => '#999',
                style: { borderRadius: 8 },
                propsForDots: { r: '4', strokeWidth: '2', stroke: darkGreen },
                propsForBackgroundLines: { stroke: '#F0F0F0' },
              }}
              bezier
              style={{ borderRadius: 8, marginLeft: -8 }}
              withInnerLines
              withOuterLines={false}
              formatYLabel={(v) => {
                const n = parseInt(v);
                if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
                if (n >= 1000) return `${n / 1000}K`;
                return v;
              }}
            />
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerSub: {
    fontSize: 13,
    opacity: 0.55,
    marginTop: 2,
  },
  notifWrap: { position: 'relative', padding: 4 },
  notifBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  notifBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  // Onboarding banner
  onboardingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4FAF5',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  onboardingIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onboardingText: { fontSize: 12, opacity: 0.65, marginTop: 2, lineHeight: 17 },
  onboardingBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  onboardingBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // Stat grid
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: '47.5%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statLabel: { fontSize: 12, opacity: 0.6, fontWeight: '500' },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { fontSize: 22, fontWeight: '700', marginTop: 8 },
  statSub: { fontSize: 11, opacity: 0.5, marginTop: 3 },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 15 },
  seeAll: { fontSize: 13, fontWeight: '600' },

  // Section card wrapper
  sectionCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
    padding: 16,
    marginBottom: 4,
  },

  // Order rows
  orderRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  orderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  orderId: { fontSize: 12, fontWeight: '700', opacity: 0.75 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  statusText: { fontSize: 11, fontWeight: '600' },
  orderClient: { fontSize: 12, opacity: 0.5, marginBottom: 2 },
  orderProduct: { fontSize: 13, fontWeight: '600' },
  orderAmount: { fontSize: 13, opacity: 0.7, marginTop: 2 },
  orderRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
    marginLeft: 8,
  },
  orderDate: { fontSize: 11, opacity: 0.45 },

  // Range selector
  rangeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  rangeSelectorText: { fontSize: 12, opacity: 0.7 },

  // Empty states
  emptySection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: { fontSize: 15, textAlign: 'center', marginBottom: 6 },
  emptySubtitle: {
    fontSize: 13,
    opacity: 0.55,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },
  emptyOutlineBtn: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  emptyOutlineBtnText: { fontSize: 13, fontWeight: '700' },
});