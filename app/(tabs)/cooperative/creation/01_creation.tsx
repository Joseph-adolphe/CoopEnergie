import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { z, ZodError } from 'zod';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';
import { Ionicons } from '@expo/vector-icons';

// ===== IMPORT SUPABASE =====
import { createUser, createCooperative } from '@/services/supabaseService';

const schema = z.object({
  name: z.string().min(2, 'Entrez un nom valide (min. 2 caractères).'),
  description: z.string().max(250).optional(),
  objectif: z.preprocess(
    (v) => Number(String(v).replace(/\s+/g, '').replace(/,/g, '')),
    z.number().positive("L'objectif de collecte doit être un nombre positif.")
  ),
  duration: z.string().min(1, "Veuillez choisir une durée."),
});


export default function CreationStep1() {
  const router = useRouter();
  const ACCENT = '#1A8C3E';
  const DURATION_OPTIONS = ['3 mois', '6 mois', '12 mois'];

  const [name,        setName]        = useState('');
  const [description, setDescription] = useState('');
  const [objectif,    setObjectif]    = useState('');
  const [duration,    setDuration]    = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [status,  setStatus]  = useState<{
    visible: boolean;
    status: 'success' | 'error';
    title?: string;
    message?: string;
  } | null>(null);

  // ===== CRÉER LA COOPÉRATIVE DANS SUPABASE =====
  async function handleNext() {
    try {
      // Valide les données
      schema.parse({ name, description, objectif, duration });
      setLoading(true);

      // ===== CRÉER L'UTILISATEUR ADMIN (TEMPORAIRE) =====
      // En production, ce serait l'utilisateur connecté
      const adminData = await createUser(
        'Admin Coopérative',
        `admin-${Date.now()}@coop.local`,
        '+237 6XX XXX XXX',
        'admin'
      );

      const adminId = adminData[0]?.id;

      if (!adminId) {
        throw new Error('Erreur lors de la création de l\'utilisateur');
      }

      console.log('✅ Utilisateur admin créé :', adminId);

      // ===== CRÉER LA COOPÉRATIVE =====
      const coopData = await createCooperative(name, parseInt(objectif), adminId);

      const cooperativeId = coopData[0]?.id;

      if (!cooperativeId) {
        throw new Error('Erreur lors de la création de la coopérative');
      }

      console.log('✅ Coopérative créée :', cooperativeId);

      setStatus({
        visible: true,
        status: 'success',
        title: 'Succès !',
        message: 'Coopérative créée avec succès',
      });

      // Attends 1 seconde puis va à l'étape suivante
      setTimeout(() => {
        const qs = `?coopId=${cooperativeId}&name=${encodeURIComponent(name)}&objectif=${encodeURIComponent(
          objectif
        )}&duration=${encodeURIComponent(duration)}&description=${encodeURIComponent(description)}`;
        router.push(`../creation/02_invitation${qs}`);
      }, 1000);
    } catch (err) {
      console.error('❌ Erreur :', err);

      let errorMessage = 'Une erreur est survenue';

      if (err instanceof ZodError) {
        errorMessage = err.issues[0]?.message || 'Données invalides';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setLoading(false);
      setStatus({
        visible: true,
        status: 'error',
        title: 'Erreur',
        message: errorMessage,
      });
    }
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Hero banner ── */}
        <View style={styles.heroBanner}>
          <View style={styles.heroIconWrap}>
            <Ionicons name="people" size={40} color={ACCENT} />
          </View>
          <ThemedText style={styles.heroTitle}>Informations de la coopérative</ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            Renseignez les informations principales{'\n'}de votre coopérative.
          </ThemedText>
        </View>

        {/* ── Nom ── */}
        <FieldLabel label="Nom de la coopérative" />
        <TextInput
          style={styles.input}
          placeholder="Ex: Coopérative Soleil"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
          returnKeyType="next"
          editable={!loading}
        />

        {/* ── Description ── */}
        <FieldLabel label="Description" style={{ marginTop: 18 }} />
        <View style={styles.textareaWrap}>
          <TextInput
            style={styles.textarea}
            placeholder={"Décrivez la mission, les valeurs\net les objectifs de votre coopérative..."}
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={(t) => t.length <= 250 && setDescription(t)}
            multiline
            textAlignVertical="top"
            editable={!loading}
          />
          <ThemedText style={styles.charCount}>{description.length} / 250</ThemedText>
        </View>

        {/* ── Objectif de collecte ── */}
        <View style={styles.collectLabelRow}>
          <FieldLabel label="Objectif de collecte" />
          <TouchableOpacity style={styles.infoBtn}>
            <Ionicons name="information-circle-outline" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputWithSuffix}>
          <TextInput
            style={styles.inputSuffixed}
            placeholder="Ex: 200000"
            placeholderTextColor="#9CA3AF"
            value={objectif}
            onChangeText={setObjectif}
            keyboardType="numeric"
            returnKeyType="done"
            editable={!loading}
          />
          <View style={styles.suffixBox}>
            <ThemedText style={styles.suffixText}>FCFA</ThemedText>
          </View>
        </View>

        {/* ── Durée de l'objectif ── */}
        <FieldLabel label="Durée de l'objectif" style={{ marginTop: 18 }} />
        <TouchableOpacity
          style={styles.select}
          onPress={() => setShowDropdown((v) => !v)}
          activeOpacity={0.8}
        >
          <ThemedText style={[styles.selectText, !duration && styles.selectPlaceholder]}>
            {duration || 'Sélectionner une durée'}
          </ThemedText>
          <Ionicons
            name={showDropdown ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>
        {showDropdown && (
          <View style={styles.dropdown}>
            {DURATION_OPTIONS.map((d, idx) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.dropdownItem,
                  idx < DURATION_OPTIONS.length - 1 && styles.dropdownItemBorder,
                  duration === d && styles.dropdownItemActive,
                ]}
                onPress={() => { setDuration(d); setShowDropdown(false); }}
              >
                <ThemedText style={[styles.dropdownItemText, duration === d && styles.dropdownItemTextActive]}>
                  {d}
                </ThemedText>
                {duration === d && <Ionicons name="checkmark" size={16} color={ACCENT} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Conseil ── */}
        <View style={styles.tipCard}>
          <View style={styles.tipIconWrap}>
            <Ionicons name="bulb-outline" size={20} color={ACCENT} />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.tipTitle}>Conseil</ThemedText>
            <ThemedText style={styles.tipBody}>
              Fixez un objectif clair et réaliste pour mobiliser{'\n'}vos membres efficacement.
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.88} disabled={loading}>
          <ThemedText style={styles.nextBtnText}>Suivant</ThemedText>
        </TouchableOpacity>
      </View>

       <LoadingModal visible={loading} message="Création de la coopérative..." />
      {status && (
        <StatusModal
          visible={status.visible}
          status={status.status}
          title={status.title}
          message={status.message}
          onClose={() => setStatus((s) => s ? { ...s, visible: false } : s)}
        />
      )}
    </ThemedView>
  );
}

function FieldLabel({ label, style }: { label: string; style?: object }) {
  return (
    <ThemedText style={[fieldStyles.label, style]}>{label}</ThemedText>
  );
}
const fieldStyles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 8 },
});


const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: '#fff' },
  container: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 110 },

  // Hero
  heroBanner: {
    backgroundColor: '#F0FBF4',
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 28,
  },
  heroIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#D6F5E3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroTitle:    { fontSize: 17, fontWeight: '800', color: '#111827', marginBottom: 6, textAlign: 'center' },
  heroSubtitle: { fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 18 },

  // Inputs
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FAFAFA',
  },

  textareaWrap: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#FAFAFA',
  },
  textarea: {
    fontSize: 14,
    color: '#111827',
    minHeight: 80,
    lineHeight: 20,
  },
  charCount: { fontSize: 11, color: '#9CA3AF', textAlign: 'right', marginTop: 6 },

  // Objectif avec suffix
  collectLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 18, marginBottom: 8 },
  infoBtn: { padding: 2 },

  inputWithSuffix: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FAFAFA',
  },
  inputSuffixed: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 14,
    color: '#111827',
  },
  suffixBox: {
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderLeftWidth: 1,
    borderLeftColor: '#D1D5DB',
  },
  suffixText: { fontSize: 13, color: '#6B7280', fontWeight: '600' },

  // Select / Dropdown
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#FAFAFA',
  },
  selectText:        { fontSize: 14, color: '#111827' },
  selectPlaceholder: { color: '#9CA3AF' },

  dropdown: {
    marginTop: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 },
      android: { elevation: 4 },
    }),
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  dropdownItemBorder:     { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  dropdownItemActive:     { backgroundColor: '#F0FBF4' },
  dropdownItemText:       { fontSize: 14, color: '#374151' },
  dropdownItemTextActive: { color: '#1A8C3E', fontWeight: '600' },

  // Conseil
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F0FBF4',
    borderRadius: 14,
    padding: 14,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#BBF0CE',
  },
  tipIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#D6F5E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTitle: { fontSize: 14, fontWeight: '700', color: '#1A8C3E', marginBottom: 3 },
  tipBody:  { fontSize: 13, color: '#374151', lineHeight: 18 },

  // Footer
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
    backgroundColor: '#1A8C3E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      ios:     { shadowColor: '#1A8C3E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
      android: { elevation: 5 },
    }),
  },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});