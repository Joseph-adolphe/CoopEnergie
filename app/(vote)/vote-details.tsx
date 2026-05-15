import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { TabButtons } from '@/components/ui/tab';
import { IconSymbol } from '@/components/ui/icon-symbol';


const VOTES = [
  { id: '1', name: 'Marie Claire', date: '20 Mai 2024 à 10:15', choice: 'yes' as const },
  { id: '2', name: 'Jean Dupont',  date: '20 Mai 2024 à 10:18', choice: 'yes' as const },
  { id: '3', name: 'Paul Mvondo',  date: '20 Mai 2024 à 10:22', choice: 'no'  as const },
  { id: '4', name: 'Aminata S.',   date: '20 Mai 2024 à 10:25', choice: 'yes' as const },
  { id: '5', name: 'David Takam',  date: '20 Mai 2024 à 10:30', choice: 'no'  as const },
  { id: '6', name: 'Fatou Diallo', date: '20 Mai 2024 à 10:45', choice: 'yes' as const },
  { id: '7', name: 'Éric Nkomo',   date: '20 Mai 2024 à 11:00', choice: 'yes' as const },
  { id: '8', name: 'Lucie Mbarga', date: '20 Mai 2024 à 11:12', choice: 'yes' as const },
];

const ACCENT    = '#1A8C3E';
const RED       = '#DC2626';
const THRESHOLD = 60;


export default function VoteDetail() {
  const [activeTab, setActiveTab] = useState('resume');
  const [filter,    setFilter]    = useState<'all' | 'yes' | 'no' | 'absent'>('all');

  const yesCount     = VOTES.filter((v) => v.choice === 'yes').length;
  const noCount      = VOTES.filter((v) => v.choice === 'no').length;
  const abstentCount = 8; 
  const total        = yesCount + noCount + abstentCount;
  const pctYes       = Math.round((yesCount / total) * 100);
  const pctNo        = Math.round((noCount  / total) * 100);
  const pctAbs       = 100 - pctYes - pctNo;
  const onTrack      = pctYes >= THRESHOLD;

  const TABS = [
    { id: 'resume', label: 'Résumé' },
    { id: 'votes',  label: `Votes (${total})` },
  ];

  const filteredVotes = VOTES.filter((v) => {
    if (filter === 'all')    return true;
    if (filter === 'yes')    return v.choice === 'yes';
    if (filter === 'no')     return v.choice === 'no';
    return false; // 'absent' → futur
  });

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerMeta}>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <ThemedText style={styles.statusText}>Vote en cours</ThemedText>
          </View>
          <View style={styles.timerBadge}>
            <IconSymbol name="clock" size={12} color="#6B7280" />
            <ThemedText style={styles.timerText}>6 jours restants</ThemedText>
          </View>
        </View>

        <ThemedText style={styles.title}>
          Achat d'un kit solaire résidentiel 3kW
        </ThemedText>

       
        <View style={styles.tabWrap}>
          <TabButtons
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="underline"
          />
        </View>
      </View>

      
      {activeTab === 'resume' && (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          
          <ThemedText style={styles.sectionTitle}>Aperçu des résultats</ThemedText>

          <View style={styles.card}>
           
            <View style={styles.totalRow}>
              <ThemedText style={styles.totalNumber}>{total}</ThemedText>
              <ThemedText style={styles.totalLabel}>votes</ThemedText>
            </View>

            
            <View style={styles.segmentBar}>
              <View style={[styles.segment, { flex: yesCount, backgroundColor: ACCENT }]} />
              <View style={[styles.segment, { flex: noCount,  backgroundColor: RED }]} />
              <View style={[styles.segment, { flex: abstentCount, backgroundColor: '#D1D5DB' }]} />
            </View>

            
            <View style={styles.legend}>
              <LegendItem color={ACCENT}    label="Oui"        count={yesCount}     pct={pctYes} />
              <LegendItem color={RED}       label="Non"        count={noCount}      pct={pctNo} />
              <LegendItem color="#D1D5DB"   label="Abstention" count={abstentCount} pct={pctAbs} />
            </View>

            
            <View style={styles.divider} />
            <View style={styles.approvalRow}>
              <View>
                <ThemedText style={styles.approvalLabel}>Taux d'approbation requis</ThemedText>
                <ThemedText style={styles.approvalValue}>{THRESHOLD} %</ThemedText>
              </View>
              <View>
                <ThemedText style={[styles.approvalBadgeText, { color: onTrack ? ACCENT : RED }]}>
                  {onTrack ? ' En bonne voie' : ' Insuffisant'}
                </ThemedText>
              </View>
            </View>

            
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${pctYes}%` }]} />
            </View>
            <ThemedText style={[styles.progressCaption, { color: onTrack ? ACCENT : RED }]}>
              {pctYes} % d'approbation
            </ThemedText>
          </View>

          <ThemedText style={[styles.sectionTitle, { marginTop: 8 }]}>
            Informations du vote
          </ThemedText>
          <View style={styles.infoCard}>
            <InfoRow icon="person-outline"          label="Proposé par"    value="Marie Claire (Admin)" />
            <InfoRow icon="calendar-outline"        label="Date de début"  value="20 Mai 2024 à 10:00" />
            <InfoRow icon="calendar-outline"        label="Date de fin"    value="27 Mai 2024 à 23:59" />
            <InfoRow icon="checkmark-circle-outline" label="Votes requis"  value={`${THRESHOLD} % des "Oui"`} />
            <InfoRow icon="cube-outline"            label="Produit"        value="Kit solaire 3kW" last />
          </View>
        </ScrollView>
      )}

      {activeTab === 'votes' && (
        <View style={{ flex: 1 }}>
          
          <View style={styles.filterBar}>
            {(
              [
                { key: 'all',    label: `Tous (${total})` },
                { key: 'yes',    label: `Oui (${yesCount})` },
                { key: 'no',     label: `Non (${noCount})` },
                { key: 'absent', label: `Absents (${abstentCount})` },
              ] as { key: typeof filter; label: string }[]
            ).map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                style={styles.filterTab}
                onPress={() => setFilter(key)}
                activeOpacity={0.7}
              >
                <ThemedText
                  style={[
                    styles.filterLabel,
                    filter === key && styles.filterLabelActive,
                  ]}
                >
                  {label}
                </ThemedText>
                {filter === key && <View style={styles.filterIndicator} />}
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.filterBorder} />

          <FlatList
            data={filteredVotes}
            keyExtractor={(i) => i.id}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <View style={styles.voteRow}>
                <Avatar name={item.name} size={42} />
                <View style={styles.voteInfo}>
                  <ThemedText style={styles.voteName}>{item.name}</ThemedText>
                  <ThemedText style={styles.voteDate}>{item.date}</ThemedText>
                </View>
                <ThemedText
                  style={[
                    styles.voteChoice,
                    { color: item.choice === 'yes' ? ACCENT : RED },
                  ]}
                >
                  {item.choice === 'yes' ? 'Oui' : 'Non'}
                </ThemedText>
              </View>
            )}
          />
        </View>
      )}
    </ThemedView>
  );
}


function LegendItem({
  color, label, count, pct,
}: { color: string; label: string; count: number; pct: number }) {
  return (
    <View style={legendStyles.row}>
      <View style={[legendStyles.dot, { backgroundColor: color }]} />
      <ThemedText style={legendStyles.label}>{label}</ThemedText>
      <ThemedText style={legendStyles.count}>{count}</ThemedText>
      <ThemedText style={legendStyles.pct}>({pct}%)</ThemedText>
    </View>
  );
}
const legendStyles = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  dot:   { width: 10, height: 10, borderRadius: 5 },
  label: { fontSize: 13, color: '#374151', flex: 1 },
  count: { fontSize: 13, fontWeight: '700' },
  pct:   { fontSize: 12, color: '#9CA3AF', width: 46, textAlign: 'right' },
});

function InfoRow({
  icon, label, value, last,
}: { icon: any; label: string; value: string; last?: boolean }) {
  return (
    <View style={[infoStyles.row, last && infoStyles.last]}>
      <IconSymbol name={icon} size={16} color="#9CA3AF" />
      <ThemedText style={infoStyles.label}>{label}</ThemedText>
      <ThemedText style={infoStyles.value}>{value}</ThemedText>
    </View>
  );
}
const infoStyles = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  last:  { borderBottomWidth: 0 },
  label: { fontSize: 13, color: '#6B7280', flex: 1 },
  value: { fontSize: 13, fontWeight: '600', textAlign: 'right', maxWidth: '55%' },
});


const styles = StyleSheet.create({
  screen: { flex: 1 },

  header: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingBottom: 0,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF9EC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot:  { width: 7, height: 7, borderRadius: 4, backgroundColor: '#F59E0B' },
  statusText: { fontSize: 12, color: '#D97706', fontWeight: '600' },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  timerText: { fontSize: 12, color: '#6B7280' },

  title:   { fontSize: 18, fontWeight: '700', lineHeight: 24, marginBottom: 16 },
  tabWrap: { marginHorizontal: -20 },

  content: { padding: 20, paddingBottom: 48 },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#F9FAF9',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    marginBottom: 20,
  },

  totalRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 14 },
  totalNumber: { fontSize: 36, fontWeight: '800', color: '#111827' },
  totalLabel:  { fontSize: 14, color: '#6B7280', fontWeight: '500' },

  segmentBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 6,
    overflow: 'hidden',
    gap: 2,
    marginBottom: 14,
  },
  segment: { borderRadius: 6 },

  legend: { gap: 4, marginBottom: 14 },

  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 14 },

  approvalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  approvalLabel: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  approvalValue: { fontSize: 20, fontWeight: '800' },
  approvalBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  approvalBadgeText: { fontSize: 13, fontWeight: '700' },

  progressBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill:    { height: '100%', backgroundColor: ACCENT, borderRadius: 6 },
  progressCaption: { fontSize: 12, fontWeight: '600' },

  infoCard: {
    backgroundColor: '#F9FAF9',
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    marginBottom: 20,
  },

  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingTop: 2,
  },
  filterBorder: { height: 1, backgroundColor: '#F0F0F0', marginTop: -1 },
  filterTab: {
    paddingHorizontal: 4,
    paddingVertical: 10,
    marginRight: 20,
    position: 'relative',
    alignItems: 'center',
  },
  filterLabel:       { fontSize: 13, color: '#9CA3AF', fontWeight: '500' },
  filterLabelActive: { color: ACCENT, fontWeight: '700' },
  filterIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: ACCENT,
    borderRadius: 2,
  },

  listContent: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 40 },
  separator:   { height: 1, backgroundColor: '#F5F5F5' },
  voteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  voteInfo:   { flex: 1 },
  voteName:   { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  voteDate:   { fontSize: 12, color: '#9CA3AF' },
  voteChoice: { fontSize: 14, fontWeight: '700' },
});