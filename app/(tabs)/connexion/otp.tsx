import React, { useRef, useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { z, ZodError } from 'zod';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';

const codeSchema = z.string().length(6, 'Code invalide').regex(/^[0-9]{6}$/, 'Le code doit contenir 6 chiffres');

export default function ConnexionOTP() {
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
          setStatus({ visible: true, status: 'success', title: 'Code validé', message: 'Redirection...'});
          setTimeout(() => {
            setStatus((s) => (s ? { ...s, visible: false } : s));
            if (flow === 'reset') router.replace('/connexion/reset-password');
            else router.replace('/accueil');
          }, 900);
      }, 800);
    } catch (err) {
      if (err instanceof ZodError) {
        setStatus({ visible: true, status: 'error', title: 'Code invalide', message: err.issues[0]?.message });
      }
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Code envoyé !</ThemedText>
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
        <ThemedText>Vous n'avez pas reçu le code ?</ThemedText>
        <ThemedText style={{ color: '#00450D', marginTop: 8 }} onPress={() => {/* resend logic placeholder */}}>Renvoyer le code (00:45)</ThemedText>
      </View>

      <LoadingModal visible={loading} message="Vérification du code..." />
      <StatusModal visible={status.visible} status={status.status} title={status.title} message={status.message} onClose={() => setStatus((s) => ({ ...s, visible: false }))} />
        <LoadingModal visible={loading} message="Vérification du code..." />
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
