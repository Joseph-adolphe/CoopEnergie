import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';
import { Ionicons } from '@expo/vector-icons';


const ACCENT = '#00450D';
const DARK   = '#00450D';

const INVITE_LINK = 'https://coopenergie.app/invite/ABCD1234';

const SHARE_CHANNELS = [
  { id: 'whatsapp', label: 'WhatsApp',  bg: '#25D366', icon: 'logo-whatsapp'   },
  { id: 'facebook', label: 'Facebook',  bg: '#1877F2', icon: 'logo-facebook'   },
  { id: 'telegram', label: 'Telegram',  bg: '#2AABEE', icon: 'paper-plane'     },
  { id: 'sms',      label: 'SMS',       bg: '#4CAF50', icon: 'chatbubble'      },
  { id: 'more',     label: 'Plus',      bg: '#F3F4F6', icon: 'ellipsis-horizontal', iconColor: '#374151' },
] as const;


export default function InvitationStep() {
  const params   = useLocalSearchParams();
  const router   = useRouter();

  const name     = (params.name     as string) || '';
  const objectif = (params.objectif as string) || '';
  const duration = (params.duration as string) || '';

  const [phones,  setPhones]  = useState('');
  const [copied,  setCopied]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [status,  setStatus]  = useState<{
    visible: boolean;
    kind?: 'success' | 'error';
    title?: string;
    message?: string;
  }>({ visible: false });

  async function copyLink() {
    await Clipboard.setStringAsync(INVITE_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function shareVia(channel: string) {
    if (channel === 'more') {
      try {
    await Share.share({
      message:` Voici le lien : ${INVITE_LINK }`,
      url: INVITE_LINK , // Optionnel sur iOS pour afficher l'aperçu
    });
    } catch  {
   
    }
    }
    // Dans une vraie app : ouvrir l'app correspondante via Linking
    setStatus({ visible: true, kind: 'success', title: 'Partage', message: `Ouverture de ${channel}...` });
  }

  function handleNext() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const qs = `?name=${encodeURIComponent(name)}&objectif=${encodeURIComponent(objectif)}&duration=${encodeURIComponent(duration)}&invited=${encodeURIComponent(phones)}`;
      router.push(`../creation/03_success${qs}` as any);
    }, 700);
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ══ Section 1 : Numéro de téléphone ══ */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Ajouter des membres par numéro de téléphone
          </ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Entrez plusieurs numéros séparés par une virgule.
          </ThemedText>

          <TextInput
            style={styles.textarea}
            placeholder={
              'Ex: 2250701020304, 2250506070809,\n2250102030405'
            }
            placeholderTextColor="#9CA3AF"
            value={phones}
            onChangeText={setPhones}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            keyboardType="phone-pad"
          />

          <ThemedText style={styles.hint}>
            Format international recommandé avec l'indicatif pays.{'\n'}
            Exemple (Côte d'Ivoire) : 2250701020304
          </ThemedText>
        </View>

        {/* ── Séparateur OU ── */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <ThemedText style={styles.dividerLabel}>OU</ThemedText>
          <View style={styles.dividerLine} />
        </View>

        {/* ══ Section 2 : Lien d'invitation ══ */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Partager le lien d'invitation
          </ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Partagez ce lien avec vos contacts pour les inviter{'\n'}à rejoindre votre coopérative.
          </ThemedText>

          {/* Lien + bouton copier */}
          <View style={styles.linkBox}>
            <ThemedText style={styles.linkText} numberOfLines={1}>
              {INVITE_LINK}
            </ThemedText>
            <TouchableOpacity onPress={copyLink} style={styles.copyIconBtn} activeOpacity={0.7}>
              <Ionicons
                name={copied ? 'checkmark' : 'copy-outline'}
                size={20}
                color={copied ? ACCENT : '#6B7280'}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.copyBtn}
            onPress={copyLink}
            activeOpacity={0.85}
          >
            <Ionicons name="copy-outline" size={16} color={ACCENT} />
            <ThemedText style={styles.copyBtnText}>
              {copied ? 'Lien copié !' : 'Copier le lien'}
            </ThemedText>
          </TouchableOpacity>

          {/* Partager via */}
          <ThemedText style={styles.shareViaLabel}>Partager via</ThemedText>
          <View style={styles.shareRow}>
            {SHARE_CHANNELS.map((ch) => (
              <TouchableOpacity
                key={ch.id}
                style={styles.shareItem}
                onPress={() => shareVia(ch.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.shareIconCircle, { backgroundColor: ch.bg }]}>
                  <Ionicons
                    name={ch.icon as any}
                    size={22}
                    color={'iconColor' in ch ? (ch as any).iconColor : '#fff'}
                  />
                </View>
                <ThemedText style={styles.shareLabel}>{ch.label}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ── Bouton fixe en bas ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={handleNext}
          activeOpacity={0.88}
        >
          <ThemedText style={styles.nextBtnText}>Suivant</ThemedText>
        </TouchableOpacity>
      </View>

      <LoadingModal visible={loading} message="Envoi des invitations..." />
      <StatusModal
        visible={status.visible}
        status={status.kind === 'success' ? 'success' : 'error'}
        title={status.title}
        message={status.message}
        onClose={() => setStatus({ visible: false })}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1, },
  container: { padding: 20,  paddingBottom: 100 },

  // Sections
  section:         { marginBottom: 8 },
  sectionTitle:    { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: '#6B7280', lineHeight: 18, marginBottom: 14 },

  // Textarea
  textarea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#111827',
    minHeight: 80,
    backgroundColor: '#FAFAFA',
    lineHeight: 20,
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 17,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine:  { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerLabel: { fontSize: 13, color: '#9CA3AF', fontWeight: '600' },

  // Lien
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: '#FAFAFA',
    marginBottom: 10,
    gap: 8,
  },
  linkText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
  },
  copyIconBtn: { padding: 2 },

  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 13,
    backgroundColor: '#fff',
    marginBottom: 22,
  },
  copyBtnText: { fontSize: 14, color: ACCENT, fontWeight: '700' },

  // Partager via
  shareViaLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },
  shareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareItem: { alignItems: 'center', gap: 6 },
  shareIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 },
      android: { elevation: 3 },
    }),
  },
  shareLabel: { fontSize: 11, color: '#6B7280', fontWeight: '500' },

  // Footer fixe
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  nextBtn: {
    backgroundColor: ACCENT,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      ios:     { shadowColor: ACCENT, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
      android: { elevation: 5 },
    }),
  },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});