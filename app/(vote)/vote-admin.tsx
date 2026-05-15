import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';
import { TabButtons } from '@/components/ui/tab';
import { IconSymbol } from '@/components/ui/icon-symbol';

// ── Données mockées ────────────────────────────────────────────────────────
const VOTES = [
  { id: '1', name: 'Marie Claire', date: '20 Mai 2024 à 10:15', choice: 'yes' as const },
  { id: '2', name: 'Jean Dupont',  date: '20 Mai 2024 à 10:18', choice: 'yes' as const },
  { id: '3', name: 'Paul Mvondo',  date: '20 Mai 2024 à 10:22', choice: 'no'  as const },
  { id: '4', name: 'Aminata S.',   date: '20 Mai 2024 à 10:25', choice: 'yes' as const },
  { id: '5', name: 'David Takam',  date: '20 Mai 2024 à 10:30', choice: 'no'  as const },
  { id: '6', name: 'Fatou Diallo', date: '20 Mai 2024 à 10:45', choice: 'yes' as const },
  { id: '7', name: 'Éric Nkomo',   date: '20 Mai 2024 à 11:00', choice: 'yes' as const },
];

const ACCENT = '#1A8C3E';
const RED    = '#DC2626';
const TABS   = [
  { id: 'resume', label: 'Résumé' },
  { id: 'votes',  label: `Votes (${VOTES.length})` },
];

// ── Page principale ────────────────────────────────────────────────────────
export default function VoteAdmin() {
  const params  = useLocalSearchParams();
  const isAdmin = params?.admin === '1' || params?.admin === 'true';

  const [activeTab, setActiveTab] = useState('resume');
  const [filter,    setFilter]    = useState<'all' | 'yes' | 'no'>('all');
  const [loading,   setLoading]   = useState(false);
  const [status,    setStatus]    = useState<{
    visible: boolean;
    status: 'success' | 'error';
    title?: string;
    message?: string;
  } | null>(null);

  const yesCount     = VOTES.filter((v) => v.choice === 'yes').length;
  const noCount      = VOTES.filter((v) => v.choice === 'no').length;
  const abstentCount = 0; // à brancher sur vos données réelles
  const total        = VOTES.length;
  const pctYes       = Math.round((yesCount / total) * 100);
  const pctNo        = Math.round((noCount  / total) * 100);
  const threshold    = 60;
  const onTrack      = pctYes >= threshold;

  const filteredVotes = VOTES.filter((v) =>
    filter === 'all' ? true : v.choice === filter
  );

  function applyDecision() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatus({ visible: true, status: 'success', title: 'Décision appliquée', message: 'La décision a été enregistrée avec succès.' });
    }, 900);
  }

  if (!isAdmin) {
    return (
      <ThemedView style={styles.screen}>
        <View style={styles.centered}>
          <ThemedText style={styles.accessTitle}>Accès réservé</ThemedText>
          <ThemedText style={styles.accessBody}>
            Cette page est réservée aux administrateurs de la coopérative.
          </ThemedText>
          <Link href="../cooperative" style={styles.link}>← Retour</Link>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.topBar}>
        <View style={styles.topBadge}>
          <View style={styles.topDot} />
          <ThemedText style={styles.topBadgeText}>Vote en cours · 6 jours restants</ThemedText>
        </View>
        <ThemedText style={styles.topTitle}>Achat d'un kit solaire résidentiel 3kW</ThemedText>

        {/* Tabs */}
        <View style={styles.tabWrap}>
          <TabButtons
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="underline"
          />
        </View>
      </View>

      {/* ── Onglet Résumé ── */}
      {activeTab === 'resume' && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Aperçu résultats */}
          <ThemedText style={styles.sectionTitle}>Aperçu des résultats</ThemedText>

          {/* Barre de progression */}
          <View style={styles.progressCard}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${pctYes}%` }]} />
            </View>
            <View style={styles.progressLabels}>
              <View style={styles.progressLabel}>
                <View style={[styles.dot, { backgroundColor: ACCENT }]} />
                <ThemedText style={styles.progressText}>Oui — {yesCount} ({pctYes}%)</ThemedText>
              </View>
              <View style={styles.progressLabel}>
                <View style={[styles.dot, { backgroundColor: RED }]} />
                <ThemedText style={styles.progressText}>Non — {noCount} ({pctNo}%)</ThemedText>
              </View>
              {abstentCount > 0 && (
                <View style={styles.progressLabel}>
                  <View style={[styles.dot, { backgroundColor: '#9CA3AF' }]} />
                  <ThemedText style={styles.progressText}>Abstention — {abstentCount}</ThemedText>
                </View>
              )}
            </View>

            {/* Taux d'approbation */}
            <View style={styles.thresholdRow}>
              <View>
                <ThemedText style={styles.thresholdLabel}>Taux d'approbation requis</ThemedText>
                <ThemedText style={styles.thresholdValue}>{threshold} %</ThemedText>
              </View>
              <View style={styles.thresholdStatus}>
                <ThemedText style={[styles.thresholdStatusText, { color: onTrack ? ACCENT : RED }]}>
                  {onTrack ? 'En bonne voie' : ' Insuffisant'}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Informations du vote */}
          <ThemedText style={[styles.sectionTitle, { marginTop: 8 }]}>Informations du vote</ThemedText>
          <View style={styles.infoCard}>
            <InfoRow icon="person-outline"    label="Proposé par"              value="Marie Claire (Admin)" />
            <InfoRow icon="calendar-outline"  label="Date de début"            value="20 Mai 2024 à 10:00" />
            <InfoRow icon="calendar-outline"  label="Date de fin"              value="27 Mai 2024 à 23:59" />
            <InfoRow icon="checkmark-circle-outline" label="Votes requis"      value={`${threshold} % des votes "Oui"`} />
            <InfoRow icon="cube-outline"      label="Produit concerné"         value="Kit solaire résidentiel 3kW" last />
          </View>

          {/* Actions admin */}
          <View style={styles.adminActions}>
            <TouchableOpacity style={styles.exportBtn}>
              <IconSymbol name="arrow.down.to.line" size={16} color="#374151" />
              <ThemedText style={styles.exportText}>Exporter le rapport</ThemedText>
            </TouchableOpacity>
            <Button
              title="Valider l'achat du kit"
              variant="primary"
              onPress={applyDecision}
              style={styles.validateBtn}
            />
          </View>

          <View style={styles.footerNote}>
            <IconSymbol name="info.circle" size={14} color="#9CA3AF" />
            <ThemedText style={styles.footerText}>
              Le vote sera validé automatiquement à la fin si le taux requis est atteint.
            </ThemedText>
          </View>
        </ScrollView>
      )}

      {activeTab === 'votes' && (
        <View style={{ flex: 1 }}>
          {/* Filtres */}
          <View style={styles.filterRow}>
            {(['all', 'yes', 'no'] as const).map((f) => {
              const label = f === 'all' ? `Tous (${total})` : f === 'yes' ? `Oui (${yesCount})` : `Non (${noCount})`;
              return (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterChip, filter === f && styles.filterChipActive]}
                  onPress={() => setFilter(f)}
                >
                  <ThemedText style={[styles.filterLabel, filter === f && styles.filterLabelActive]}>
                    {label}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>

          <FlatList
            data={filteredVotes}
            keyExtractor={(i) => i.id}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <View style={styles.voteRow}>
                <Avatar name={item.name} size={40} />
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

      <LoadingModal visible={loading} />
      {status && (
        <StatusModal
          visible={status.visible}
          status={status.status}
          title={status.title}
          message={status.message}
          onClose={() => setStatus(null)}
        />
      )}
    </ThemedView>
  );
}

function InfoRow({
  icon,
  label,
  value,
  last,
}: {
  icon: any;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[infoStyles.row, last && infoStyles.rowLast]}>
      <IconSymbol name={icon} size={16} color="#9CA3AF" style={infoStyles.icon} />
      <ThemedText style={infoStyles.label}>{label}</ThemedText>
      <ThemedText style={infoStyles.value}>{value}</ThemedText>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 8,
  },
  rowLast: { borderBottomWidth: 0 },
  icon:  { width: 20 },
  label: { fontSize: 13, color: '#6B7280', flex: 1 },
  value: { fontSize: 13, fontWeight: '600', textAlign: 'right', maxWidth: '55%' },
});

const styles = StyleSheet.create({
  screen: { flex: 1 },

  // accès réservé
  centered:    { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  accessTitle: { fontSize: 20, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  accessBody:  { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
  link:        { marginTop: 20, color: '#1A8C3E', fontWeight: '600' },

  // top bar
  topBar: {  paddingHorizontal: 20, backgroundColor: '#fff', paddingBottom: 0 },
  topBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  topDot:   { width: 8, height: 8, borderRadius: 4,  },
  topBadgeText: { fontSize: 12, fontWeight: '600' },
  topTitle: { fontSize: 18, fontWeight: '700', lineHeight: 24, marginBottom: 16 },
  tabWrap:  { marginHorizontal: -20 },

  // contenu scroll
  content: { padding: 20, paddingBottom: 48 },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },

  // progress card
  progressCard: {
    backgroundColor: '#F9FAF9',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    marginBottom: 20,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    marginBottom: 14,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1A8C3E',
    borderRadius: 6,
  },
  progressLabels: { gap: 6, marginBottom: 16 },
  progressLabel:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot:            { width: 10, height: 10, borderRadius: 5 },
  progressText:   { fontSize: 13, color: '#374151' },

  thresholdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  thresholdLabel: { fontSize: 12, color: '#6B7280' },
  thresholdValue: { fontSize: 18, fontWeight: '700' },
  thresholdStatus: {},
  thresholdStatusText: { fontSize: 14, fontWeight: '700' },

  // info card
  infoCard: {
    backgroundColor: '#F9FAF9',
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    marginBottom: 20,
  },

  // actions admin
  adminActions: { flexDirection: 'column', gap: 10, marginBottom: 12 },
  exportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 13,
    backgroundColor: '#fff',
  },
  exportText:   { fontSize: 13, fontWeight: '600', color: '#374151' },
  validateBtn:  { flex: 1, borderRadius: 12 },

  footerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 10,
  },
  footerText: { fontSize: 12, color: '#6B7280', flex: 1, lineHeight: 16 },

  // liste votes
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterChipActive: { backgroundColor: '#EEF8F0' },
  filterLabel:      { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  filterLabelActive: { color: '#1A8C3E', fontWeight: '700' },

  listContent:  { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  separator:    { height: 1, backgroundColor: '#F0F0F0' },
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