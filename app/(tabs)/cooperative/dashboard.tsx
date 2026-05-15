import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { IconSymbol } from '@/components/ui/icon-symbol';

const ACCENT  = '#00450D';
const DARK    = '#00450D';
const PROGRESS = 37;

const CONTRIBUTIONS = [
  { id: '1', name: 'Marie', date: '20 Mai 2024 - 10:30', amount: '10 000 FCFA' },
  { id: '2', name: 'Paul',  date: '20 Mai 2024 - 09:15', amount: '5 000 FCFA'  },
  { id: '3', name: 'Amina', date: '19 Mai 2024 - 18:40', amount: '20 000 FCFA' },
];

const MENU_ITEMS = [
  { icon: 'checkmark.square',        label: 'Votes',                      route: '/vote-admin?admin=true' },
  { icon: 'arrow.up.circle.fill',    label: 'Cotisations',                route: '/cooperative/cotiser'   },
  { icon: 'clock.arrow.circlepath',  label: 'Historiques',                route: '/cooperative/historique/1' },
  { icon: 'person.2.fill',           label: 'Membres',                    route: '/cooperative'   },
  { icon: 'plus.circle',             label: 'Créer une nouvelle coopérative', route: '/cooperative/creation' },
];


export default function CooperativeDashboard() {
  const router    = useRouter();
  const [hasCoop]   = useState(true);
  const [showMenu, setShowMenu] = useState(false);


  if (!hasCoop) {
    return (
      <ThemedView style={styles.screen}>
        {/* Header */}
        <View style={styles.headerRow}>
          <ThemedText style={styles.brand}>COOPENERGIE</ThemedText>
          <TouchableOpacity style={styles.menuBtn}>
            <ThemedText style={styles.menuTxt}>•••</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.greeting}>Bonjour Alliance </ThemedText>


        <View style={styles.emptyCard}>
          <View style={styles.emptyIllustration}>
            <View style={styles.emptyAvatarBg}>
              <IconSymbol name="person.fill" size={48} color={ACCENT} />
            </View>
          </View>

          <ThemedText style={styles.emptyTitle}>
            Vous n'êtes affilié à aucune coopérative.
          </ThemedText>
          <ThemedText style={styles.emptyBody}>
            Créez votre première coopérative et commencez à collaborer avec d'autres membres.
          </ThemedText>

          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => router.push('/cooperative/creation')}
            activeOpacity={0.88}
          >
            <ThemedText style={styles.createBtnText}>+  Créer une coopérative</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.headerRow}>
          <ThemedText style={styles.brand}>COOPENERGIE</ThemedText>
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => setShowMenu((s) => !s)}
          >
            <ThemedText style={styles.menuTxt}>•••</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.greeting}>Bonjour Alliance </ThemedText>

        <View style={styles.objectiveCard}>
          <ThemedText style={styles.objectiveLabel}>Objectif de la coopérative</ThemedText>

          <View style={styles.objectiveAmountRow}>
            <ThemedText style={styles.objectiveAmount}>75 000 </ThemedText>
            <ThemedText style={styles.objectiveTotal}>/ 200 000 FCFA</ThemedText>
          </View>

          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${PROGRESS}%` }]} />
          </View>

          <View style={styles.progressFooter}>
            <ThemedText style={styles.progressCaption}>{PROGRESS}% atteint</ThemedText>
            <ThemedText style={styles.progressCaption}>Objectif en 12 jours</ThemedText>
          </View>
        </View>

        <TouchableOpacity
          style={styles.voteCard}
          onPress={() => router.push('/vote')}
          activeOpacity={0.88}
        >
          <View style={styles.voteCardLeft}>
            <View style={styles.voteIconWrap}>
              <IconSymbol name="checkmark.square" size={22} color="#E07B00" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.voteTitleRow}>
                <ThemedText style={styles.voteTitle}>Vote en cours</ThemedText>
                <View style={styles.voteTimerBadge}>
                  <ThemedText style={styles.voteTimerText}>2 jours restants</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.voteSubtitle}>
                Vote sur l'achat d'équipements solaires
              </ThemedText>
            </View>
          </View>

          <View style={styles.voteLinkRow}>
            <ThemedText type='text' style={styles.voteLinkText}>Voir le vote</ThemedText>
            <IconSymbol name="chevron.right" size={16} color='#0000' />
          </View>
        </TouchableOpacity>

        <View style={styles.contribSection}>
          <View style={styles.contribHeader}>
            <ThemedText style={styles.sectionTitle}>Contributions récentes</ThemedText>
            <TouchableOpacity onPress={() => router.push('/cooperative/historique/1')}>
              <ThemedText style={styles.seeAll}>Voir tout</ThemedText>
            </TouchableOpacity>
          </View>

          <View >
            {CONTRIBUTIONS.map((item, idx) => (
              <View key={item.id}>
                <View style={styles.contribRow}>
                  <Avatar name={item.name} size={44} />
                  <View style={styles.contribInfo}>
                    <ThemedText style={styles.contribName}>{item.name}</ThemedText>
                    <ThemedText style={styles.contribDate}>{item.date}</ThemedText>
                  </View>
                  <ThemedText style={styles.contribAmount}>{item.amount}</ThemedText>
                </View>
                {idx < CONTRIBUTIONS.length - 1 && <View style={styles.contribDivider} />}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>


      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/cooperative/cotiser')}
        activeOpacity={0.88}
      >
        <IconSymbol name="plus" size={30} color="#fff" />
      </TouchableOpacity>


      {showMenu && (
        <>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            onPress={() => setShowMenu(false)}
            activeOpacity={1}
          />
          <View style={styles.menuOverlay}>
            {MENU_ITEMS.map((item, idx) => (
              <TouchableOpacity
                key={item.route}
                style={[
                  styles.menuItem,
                  idx < MENU_ITEMS.length - 1 && styles.menuItemBorder,
                ]}
                onPress={() => {
                  setShowMenu(false);
                  router.push(item.route as any);
                }}
              >
                <IconSymbol name={item.icon as any} size={20} color={DARK} />
                <ThemedText type='text' style={styles.menuItemText}>{item.label}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  screen:        { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  brand:   { color: ACCENT, fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },
  menuBtn: { padding: 6 },
  menuTxt: { fontSize: 18, color: '#374151', letterSpacing: 2, fontWeight: '700' },

  greeting: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 20 },


  objectiveCard: {
    backgroundColor: ACCENT,
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    ...Platform.select({
      ios:     { shadowColor: ACCENT, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14 },
      android: { elevation: 8 },
    }),
  },
  objectiveLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginBottom: 6,
  },
  objectiveAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  objectiveAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
  },
  objectiveTotal: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },
  progressBg: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressCaption: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },

  voteCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#F5D6B0',
    backgroundColor: '#FFF9F0',
  },
  voteCardLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  voteIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FEF3E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voteTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  voteTitle:     { fontSize: 14, fontWeight: '700', color: '#111827' },
  voteTimerBadge: {
    backgroundColor: '#FEF3E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  voteTimerText: { fontSize: 11, color: '#E07B00', fontWeight: '600' },
  voteSubtitle:  { fontSize: 13, color: '#6B7280' },
  voteLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: '#F5D6B0',
    paddingTop: 10,
  },
  voteLinkText: { fontSize: 13, fontWeight: '700' },

  contribSection: { marginBottom: 20 },
  contribHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  seeAll:       { fontSize: 13, color: ACCENT, fontWeight: '700' },

  contribRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  contribInfo:   { flex: 1 },
  contribName:   { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  contribDate:   { fontSize: 12, color: '#9CA3AF' },
  contribAmount: { fontSize: 14, fontWeight: '700', color: '#111827' },
  contribDivider: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 56 },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios:     { shadowColor: ACCENT, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12 },
      android: { elevation: 8 },
    }),
  },

  menuOverlay: {
    position: 'absolute',
    top: 72,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 4,
    minWidth: 220,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 20 },
      android: { elevation: 10 },
    }),
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemText: { fontSize: 14, fontWeight: '500' },

  emptyCard: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12 },
      android: { elevation: 3 },
    }),
  },
  emptyIllustration: {
    marginBottom: 20,
  },
  emptyAvatarBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEF8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
  },
  emptyBody: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  createBtn: {
    backgroundColor: DARK,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  createBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});