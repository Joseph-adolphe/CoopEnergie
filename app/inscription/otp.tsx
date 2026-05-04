import React, { useRef, useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { z, ZodError } from 'zod';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';

const codeSchema = z.string().length(6, 'Code invalide').regex(/^[0-9]{6}$/, 'Le code doit contenir 6 chiffres');

export default function InscriptionOTP() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const flow = (params as any).flow as string | undefined;

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; status: 'success' | 'error'; title?: string; message?: string }>({ visible: false, status: 'success' });

  function setDigit(i: number, value: string) {
    const v = value.replace(/[^0-9]/g, '');
    const next = [...digits];
    next[i] = v.slice(-1);
    setDigits(next);
    if (v && i < 5) inputs.current[i + 1]?.focus();
  }

  async function submit() {
    const code = digits.join('');
    try {
      codeSchema.parse(code);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // fake valid code '123456'
        if (code === '123456') {
          setStatus({ visible: true, status: 'success', title: 'Compte créé avec succès', message: 'Bienvenue dans la communauté.' });
          setTimeout(() => {
            setStatus((s) => (s ? { ...s, visible: false } : s));
            router.replace('/accueil');
          }, 900);
        } else {
          setStatus({ visible: true, status: 'error', title: 'Code invalide', message: 'Veuillez vérifier et réessayer.' });
        }
      }, 900);
    } catch (err) {
      if (err instanceof ZodError) {
        setStatus({ visible: true, status: 'error', title: 'Code invalide', message: err.issues[0]?.message });
      }
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Vérification OTP</ThemedText>
      <ThemedText style={styles.body}>Entrez le code à 6 chiffres reçu.</ThemedText>

      <View style={styles.codeRow}>
        {digits.map((d, i) => (
          <TextInput
            key={i}
            ref={(el: TextInput | null) => { inputs.current[i] = el; }}
            value={d}
            onChangeText={(t) => setDigit(i, t)}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.codeInput}
            onSubmitEditing={() => { if (i === 5) submit(); }}
          />
        ))}
      </View>

      <View style={{ marginTop: 18 }}>
        <ThemedText>Code envoyé au contact fourni.</ThemedText>
      </View>

      <LoadingModal visible={loading} message="Vérification..." />
      <StatusModal visible={status.visible} status={status.status} title={status.title} message={status.message} onClose={() => setStatus((s) => (s ? { ...s, visible: false } : s))} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  body: { marginTop: 12 },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  codeInput: { width: 44, height: 56, borderRadius: 8, borderWidth: 1, borderColor: '#e0ddd6', textAlign: 'center', fontSize: 20 },
});
