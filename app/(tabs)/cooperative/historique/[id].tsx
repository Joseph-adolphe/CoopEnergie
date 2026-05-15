import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TabButtons } from '@/components/ui/tab';

const { width } = Dimensions.get('window');

const STATS = [
  {
    id: 's1',
    icon: 'arrow.up.circle.fill' as const,
    iconBg: '#1A8C3E',
    label: 'Contributions',
    value: '1 245 000 FCFA',
    valueColor: '#1A8C3E',
    sub: '48 transactions',
  },
  {
    id: 's2',
    icon: 'checkmark.square' as const,
    iconBg: '#F5A623',
    label: 'Votes organisés',
    value: '12',
    valueColor: '#F5A623',
    sub: 'Ces 30 derniers jours',
  },
  {
    id: 's3',
    icon: 'person.2.fill' as const,
    iconBg: '#4A90E2',
    label: 'Membres actifs',
    value: '156',
    valueColor: '#4A90E2',
    sub: 'Ces 30 derniers jours',
  },
  {
    id: 's4',
    icon: 'list.bullet.clipboard' as const,
    iconBg: '#8B5CF6',
    label: 'Activités totales',
    value: '60',
    valueColor: '#8B5CF6',
    sub: 'Ces 30 derniers jours',
  },
];


type ActivityType = 'contribution' | 'vote' | 'member' | 'vote-done';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  sub: string;
  date: string;
  amount?: string;
  tag?: string;
  tagColor?: string;
  tagBg?: string;
}

const ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    type: 'contribution',
    title: 'Nouvelle contribution',
    sub: 'Par Marie',
    date: '20 Mai 2024 • 10:30',
    amount: '+ 10 000 FCFA',
    tag: 'Coopérative Soleil',
    tagColor: '#1A8C3E',
    tagBg: '#E8F5EC',
  },
  {
    id: 'a2',
    type: 'vote',
    title: 'Vote créé',
    sub: "Achat d'équipements solaires",
    date: '20 Mai 2024 • 09:15',
    tag: 'Vote',
    tagColor: '#F5A623',
    tagBg: '#FEF3E2',
  },
  {
    id: 'a3',
    type: 'contribution',
    title: 'Nouvelle contribution',
    sub: 'Par Paul',
    date: '19 Mai 2024 • 18:40',
    amount: '+ 20 000 FCFA',
    tag: 'Coopérative Soleil',
    tagColor: '#1A8C3E',
    tagBg: '#E8F5EC',
  },
  {
    id: 'a4',
    type: 'member',
    title: 'Nouveau membre',
    sub: 'Amina a rejoint la coopérative',
    date: '19 Mai 2024 • 16:20',
    tag: 'Membre',
    tagColor: '#4A90E2',
    tagBg: '#EBF3FD',
  },
  {
    id: 'a5',
    type: 'vote-done',
    title: 'Vote terminé',
    sub: 'Distribution des bénéfices 2023',
    date: '18 Mai 2024 • 14:10',
    tag: 'Adopté',
    tagColor: '#6B7280',
    tagBg: '#F3F4F6',
  },
  {
    id: 'a6',
    type: 'contribution',
    title: 'Nouvelle contribution',
    sub: 'Par Ibrahim',
    date: '18 Mai 2024 • 11:05',
    amount: '+ 5 000 FCFA',
    tag: 'Coopérative Soleil',
    tagColor: '#1A8C3E',
    tagBg: '#E8F5EC',
  },
];


function ActivityIcon({ type }: { type: ActivityType }) {
  const config = {
    contribution: { icon: 'arrow-upward', bg: '#1A8C3E' },
    vote: { icon: 'inbox', bg: '#F5A623' },
    member: { icon: 'person-add', bg: '#4A90E2' },
    'vote-done': { icon: 'check', bg: '#F5A623' },
  }[type];

  return (
    <View style={[actStyles.iconCircle, { backgroundColor: config.bg }]}>
      <MaterialIcons name={config.icon as any} size={18} color="#fff" />
    </View>
  );
}

const actStyles = StyleSheet.create({
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const TABS = [
  { id: 'all', label: 'Toutes' },
  { id: 'contributions', label: 'Contributions' },
  { id: 'votes', label: 'Votes' },
];

export default function CooperativeHistory() {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = ACTIVITIES.filter((a) => {
    if (activeTab === 'contributions') return a.type === 'contribution';
    if (activeTab === 'votes') return a.type === 'vote' || a.type === 'vote-done';
    return true;
  });

  return (
    <ThemedView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.pageTitle}>Historique de la coopérative</ThemedText>
          <ThemedText style={styles.pageSub}>
            Toutes les activités réalisées dans la coopérative.
          </ThemedText>
        </View>
        <TouchableOpacity style={styles.bell}>
          <IconSymbol name="bell" size={22} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

       {/* Tab buttons */}
      <TabButtons tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
                 {/* Summary */}
        <ThemedText style={styles.sectionTitle}>Résumé</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsRow}
        >
          {STATS.map((s) => (
            <View key={s.id} style={styles.statCard}>
              <View style={[styles.statIconCircle, { backgroundColor: s.iconBg }]}>
               <IconSymbol name={s.icon } size={20} color="#fff" />
              </View>
              <View style={{flexDirection:'row' ,  justifyContent: 'space-between' , alignItems: 'center'}}>
               <ThemedText style={styles.statLabel}>{s.label}</ThemedText>
               <IconSymbol name="chevron.right" size={18} color="#C0C0C0"/>
              </View>
              <ThemedText style={[styles.statValue, { color: s.valueColor }]}>
                {s.value}
              </ThemedText>
              <ThemedText style={styles.statSub}>{s.sub}</ThemedText>
            </View>
          ))}
        </ScrollView>

        {/* Recent activities */}
        <View style={styles.actHeader}>
          <ThemedText style={styles.sectionTitle}>Activités récentes</ThemedText>
          <TouchableOpacity style={styles.filterBtn}>
            <ThemedText style={styles.filterText}>Filtrer</ThemedText>
            <MaterialIcons name="filter-list" size={16} color="#1A8C3E" />
          </TouchableOpacity>
        </View>

        <View style={styles.actList}>
          {filtered.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.actItem,
                index === filtered.length - 1 && styles.actItemLast,
              ]}
              activeOpacity={0.7}
            >
              <ActivityIcon type={item.type} />

              <View style={styles.actBody}>
                 <View style={styles.actBody}>
                <ThemedText style={styles.actTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.actSub}>{item.sub}</ThemedText>
                <ThemedText style={styles.actDate}>{item.date}</ThemedText>
              </View>

              <View style={styles.actRight}>
                {item.amount && (
                  <ThemedText style={styles.actAmount}>{item.amount}</ThemedText>
                )}
                <View style={[styles.tag, { backgroundColor: item.tagBg }]}>
                  <ThemedText style={[styles.tagText, { color: item.tagColor }]}>
                    {item.tag}
                  </ThemedText>
                </View>
              </View>

              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Load more */}
        <TouchableOpacity style={styles.loadMore} activeOpacity={0.7}>
          <ThemedText style={styles.loadMoreText}>Charger plus</ThemedText>
          <MaterialIcons name="expand-more" size={20} color="#1A8C3E" />
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 12
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    maxWidth: width * 0.72,
    lineHeight: 26,
  },
  pageSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    maxWidth: width * 0.72,
  },
  bell: {
    marginTop: 4,
    padding: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 0,
  },

  // Stats
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 20,
    marginBottom: 12,
  },
  statsRow: {
    gap: 12,
    height: 210,
  },
  statCard: {
    width: (width - 64) / 2,
    height: 200,
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    gap: 4,
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  statSub: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },

  // Activity list
  actHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actList: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
    marginTop: 0,
  },
  actItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actItemLast: {
    borderBottomWidth: 0,
  },
  actBody: {
    flex: 1,
    gap: 2,
  },
  actTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  actSub: {
    fontSize: 12,
    color: '#6B7280',
  },
  actDate: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  actRight: {
    alignItems: 'flex-start',
    gap: 4,
  },
  actAmount: {
    fontSize: 13,
    fontWeight: '700',
  },
  tag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Load more
  loadMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
});