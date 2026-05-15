import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';
import { IconSymbol } from '@/components/ui/icon-symbol';


const ACCENT  = '#1A8C3E';
const GRAY_BG = '#F9FAF9';
const BORDER  = '#E5E7EB';

const VOTE_TYPES = [
  { id: 'purchase',    label: "Achat d'un produit" },
  { id: 'investment',  label: "Investissement" },
  { id: 'rule',        label: "Modification de règle" },
  { id: 'other',       label: "Autre" },
];

interface SelectedProduct {
  id: string;
  name: string;
  price: string;
  image?: string;
}

interface FormState {
  title: string;
  description: string;
  voteType: string;
  startDate: string;
  endDate: string;
  threshold: number;
  product: SelectedProduct | null;
}

export default function CreateVote() {
  const router = useRouter();
  const imageUri = '';
  const PLACEHOLDER = require('@/assets/images/placeholder.png');

  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    voteType: 'purchase',
    startDate: '20 Mai 2024 à 10:00',
    endDate: '27 Mai 2024 à 23:59',
    threshold: 60,
    product: null,
  });

  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [status,  setStatus]    = useState<{
    visible: boolean;
    status: 'success' | 'error';
    title?: string;
    message?: string;
  } | null>(null);

  const MOCK_PRODUCT: SelectedProduct = {
    id: '1',
    name: 'Kit solaire résidentiel 3kW',
    price: '850 000 FCFA',
  };

  function decreaseThreshold() {
    setForm((f) => ({ ...f, threshold: Math.max(10, f.threshold - 5) }));
  }
  function increaseThreshold() {
    setForm((f) => ({ ...f, threshold: Math.min(100, f.threshold + 5) }));
  }

  function selectProduct() {
    setForm((f) => ({ ...f, product: MOCK_PRODUCT }));
  }
  function removeProduct() {
    setForm((f) => ({ ...f, product: null }));
  }

  function validate(): string | null {
    if (!form.title.trim())       return 'Le titre du vote est requis.';
    if (!form.description.trim()) return 'La description est requise.';
    return null;
  }

  function handleSubmit() {
    const err = validate();
    if (err) {
      setStatus({ visible: true, status: 'error', title: 'Champ manquant', message: err });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatus({
        visible: true,
        status: 'success',
        title: 'Vote créé !',
        message: 'Le vote a été soumis aux membres de la coopérative.',
      });
    }, 1000);
  }

  const selectedTypeLabel =
    VOTE_TYPES.find((t) => t.id === form.voteType)?.label ?? 'Choisir un type';

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        <View style={styles.pageHeader}>
          <ThemedText style={styles.pageTitle}>Créer un vote</ThemedText>
          <ThemedText style={styles.pageSubtitle}>
            Proposez une décision à la coopérative et laissez les membres voter.
          </ThemedText>
        </View>

        <SectionHeader number="1" label="Détails du vote" />

        <FieldLabel label="Titre du vote" />
        <TextInput
          style={styles.input}
          placeholder="Ex: Achat d'un kit solaire résidentiel 3kW"
          placeholderTextColor="#9CA3AF"
          value={form.title}
          onChangeText={(t) => setForm((f) => ({ ...f, title: t }))}
          returnKeyType="next"
        />

        {/* Description */}
        <FieldLabel label="Description de la proposition" style={{ marginTop: 16 }} />
        <View style={styles.textareaWrapper}>
          <TextInput
            style={styles.textarea}
            placeholder="Décrivez la proposition en détail, ses objectifs et les bénéfices pour la coopérative..."
            placeholderTextColor="#9CA3AF"
            value={form.description}
            onChangeText={(t) => setForm((f) => ({ ...f, description: t }))}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          <ThemedText style={styles.charCount}>
            {form.description.length} / 500
          </ThemedText>
        </View>

        {/* Type de vote */}
        <FieldLabel label="Type de vote" style={{ marginTop: 16 }} />
        <TouchableOpacity
          style={styles.select}
          onPress={() => setShowTypeDropdown((v) => !v)}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.selectText}>{selectedTypeLabel}</ThemedText>
          <IconSymbol
            name={showTypeDropdown ? 'chevron.up' : 'chevron.down'}
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>
        {showTypeDropdown && (
          <View style={styles.dropdown}>
            {VOTE_TYPES.map((type, idx) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.dropdownItem,
                  idx < VOTE_TYPES.length - 1 && styles.dropdownItemBorder,
                  form.voteType === type.id && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  setForm((f) => ({ ...f, voteType: type.id }));
                  setShowTypeDropdown(false);
                }}
              >
                <ThemedText
                  style={[
                    styles.dropdownItemText,
                    form.voteType === type.id && styles.dropdownItemTextActive,
                  ]}
                >
                  {type.label}
                </ThemedText>
                {form.voteType === type.id && (
                  <IconSymbol name="checkmark.circle.fill" size={16} color={ACCENT} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Produit concerné */}
        <FieldLabel label="Produit concerné (optionnel)" style={{ marginTop: 16 }} />
        {form.product ? (
          <View style={styles.productCard}>
            <View style={styles.productIcon}>
               <Image source={imageUri ? { uri: imageUri } : PLACEHOLDER} style={styles.image} resizeMode="cover" />
            </View>
            <View style={styles.productInfo}>
              <ThemedText style={styles.productName}>{form.product.name}</ThemedText>
              <ThemedText style={styles.productPrice}>{form.product.price}</ThemedText>
            </View>
            <View style={styles.productActions}>
              <TouchableOpacity style={styles.viewProductBtn} activeOpacity={0.8}>
                <ThemedText style={styles.viewProductText}>Voir le produit</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={removeProduct} style={styles.removeProductBtn}>
                <IconSymbol name="xmark" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.addProductBtn} onPress={selectProduct} activeOpacity={0.8}>
            <IconSymbol name="plus.circle" size={20} color={ACCENT} />
            <ThemedText style={styles.addProductText}>Sélectionner un produit</ThemedText>
          </TouchableOpacity>
        )}

        <SectionHeader number="2" label="Paramètres du vote" style={{ marginTop: 28 }} />

        {/* Dates */}
        <View style={styles.dateRow}>
          <View style={{ flex: 1 }}>
            <FieldLabel label="Date de début" />
            <TouchableOpacity style={styles.dateInput} activeOpacity={0.8}>
              <ThemedText style={styles.dateText}>{form.startDate}</ThemedText>
              <IconSymbol name="calendar" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <FieldLabel label="Date de fin" />
            <TouchableOpacity style={styles.dateInput} activeOpacity={0.8}>
              <ThemedText style={styles.dateText}>{form.endDate}</ThemedText>
              <IconSymbol name="calendar" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Taux d'approbation */}
        <View style={styles.thresholdCard}>
          <View style={styles.thresholdHeader}>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.thresholdTitle}>Votes requis pour validation</ThemedText>
              <ThemedText style={styles.thresholdSub}>
                Nombre minimum de votes "Oui" requis pour que le vote soit validé.
              </ThemedText>
            </View>
            <View style={styles.thresholdControl}>
              <TouchableOpacity style={styles.thresholdBtn} onPress={decreaseThreshold}>
                <IconSymbol name="plus" size={18} color="#374151" />
              </TouchableOpacity>
              <ThemedText style={styles.thresholdValue}>{form.threshold} %</ThemedText>
              <TouchableOpacity style={styles.thresholdBtn} onPress={increaseThreshold}>
                <IconSymbol name="minus" size={18} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Barre de visualisation */}
          <View style={styles.thresholdBarBg}>
            <View style={[styles.thresholdBarFill, { width: `${form.threshold}%` }]} />
          </View>
          <ThemedText style={styles.thresholdCaption}>
            Le vote sera validé si au moins {form.threshold} % des membres votent "Oui".
          </ThemedText>
        </View>

        {/* ── Bouton soumettre ── */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.88}
        >
          <IconSymbol name="checkmark.circle.fill" size={20} color="#fff" />
          <ThemedText style={styles.submitBtnText}>Créer le vote</ThemedText>
        </TouchableOpacity>
      </ScrollView>

      <LoadingModal visible={loading} />
      {status && (
        <StatusModal
          visible={status.visible}
          status={status.status}
          title={status.title}
          message={status.message}
          onClose={() => {
            setStatus(null);
            if (status.status === 'success') router.back();
          }}
        />
      )}
    </ThemedView>
  );
}


function SectionHeader({
  number,
  label,
  style,
}: {
  number: string;
  label: string;
  style?: object;
}) {
  return (
    <View style={[sectionStyles.row, style]}>
      <View style={sectionStyles.badge}>
        <ThemedText style={sectionStyles.badgeText}>{number}</ThemedText>
      </View>
      <ThemedText style={sectionStyles.label}>{label}</ThemedText>
    </View>
  );
}
const sectionStyles = StyleSheet.create({
  row:       { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  badge:     { width: 26, height: 26, borderRadius: 13, backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  label:     { fontSize: 16, fontWeight: '700', color: '#111827' },
});

function FieldLabel({ label, style }: { label: string; style?: object }) {
  return (
    <ThemedText style={[fieldStyles.label, style]}>{label}</ThemedText>
  );
}
const fieldStyles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
});


const styles = StyleSheet.create({
  screen:    { flex: 1 },
  container: { padding: 20, paddingTop: 56, paddingBottom: 48 },

  pageHeader:   { marginBottom: 16 },
  pageTitle:    { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 6 },
  pageSubtitle: { fontSize: 14, color: '#6B7280', lineHeight: 20 },


  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#EEF8F0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#BBF0CE',
  },
  infoBannerText: { fontSize: 13, color: '#1A8C3E', flex: 1, lineHeight: 18 },

  input: {
    backgroundColor: GRAY_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 14,
    color: '#111827',
  },

  textareaWrapper: {
    backgroundColor: GRAY_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 14,
  },
  textarea: {
    fontSize: 14,
    color: '#111827',
    minHeight: 96,
    lineHeight: 20,
  },
  charCount: { fontSize: 11, color: '#9CA3AF', textAlign: 'right', marginTop: 6 },

  select: {
    backgroundColor: GRAY_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: { fontSize: 14, color: '#111827' },

  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    marginTop: 4,
    overflow: 'hidden',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 },
      android: { elevation: 4 },
    }),
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownItemBorder:      { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  dropdownItemActive:      { backgroundColor: '#F0FBF4' },
  dropdownItemText:        { fontSize: 14, color: '#374151' },
  dropdownItemTextActive:  { color: ACCENT, fontWeight: '600' },

  addProductBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#BBF0CE',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#F0FBF4',
  },
  addProductText: { fontSize: 14, color: ACCENT, fontWeight: '600' },

  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: GRAY_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 12,
  },
  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#EEF8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo:  { flex: 1 },
  productName:  { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  productPrice: { fontSize: 12, color: ACCENT, fontWeight: '600' },
  productActions: { alignItems: 'flex-end', gap: 6 },
  viewProductBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ACCENT,
  },
  viewProductText:  { fontSize: 11, color: ACCENT, fontWeight: '600' },
  removeProductBtn: { padding: 4 },

  dateRow:  { flexDirection: 'row', gap: 12, marginBottom: 16 },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: GRAY_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 13,
  },
  dateText: { fontSize: 12, color: '#374151', flex: 1, marginRight: 4 },

  thresholdCard: {
    backgroundColor: GRAY_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 16,
    marginBottom: 28,
  },
  thresholdHeader:  { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  thresholdTitle:   { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4 },
  thresholdSub:     { fontSize: 12, color: '#6B7280', lineHeight: 16 },
  thresholdControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    padding: 4,
  },
  thresholdBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thresholdValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    minWidth: 50,
    textAlign: 'center',
  },
  thresholdBarBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  thresholdBarFill: {
    height: '100%',
    backgroundColor: ACCENT,
    borderRadius: 6,
  },
  thresholdCaption: { fontSize: 12, color: '#6B7280', lineHeight: 16 },

  submitBtn: {
    backgroundColor: ACCENT,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      ios:     { shadowColor: ACCENT, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
      android: { elevation: 5 },
    }),
  },
  image: { width: 88, height: 88, borderRadius: 8, marginRight: 12 },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});