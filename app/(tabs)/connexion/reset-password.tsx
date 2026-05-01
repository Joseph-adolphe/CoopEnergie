import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { z, ZodError } from 'zod';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';

const resetSchema = z
  .object({
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    confirm: z.string().min(6, 'Confirmation requise'),
  })
  .refine((data) => data.password === data.confirm, { message: "Les mots de passe ne correspondent pas", path: ['confirm'] });

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; status: 'success' | 'error'; title?: string; message?: string }>({ visible: false, status: 'success' });

  function submit() {
    try {
      resetSchema.parse({ password, confirm });
      setErrors({});
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStatus({ visible: true, status: 'success', title: 'Mot de passe réinitialisé', message: "Vous pouvez maintenant vous connecter." });
        setTimeout(() => {
          setStatus((s) => (s ? { ...s, visible: false } : s));
          router.replace('/connexion');
        }, 900);
      }, 1000);
    } catch (err) {
      if (err instanceof ZodError) {
        const parsed: any = {};
        for (const issue of err.issues) {
          parsed[issue.path?.[0] as string] = issue.message;
        }
        setErrors(parsed);
      }
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Nouveau mot de passe</ThemedText>
      <ThemedText style={styles.body}>Choisissez un nouveau mot de passe sécurisé.</ThemedText>

      <View style={{ marginTop: 18 }}>
        <Input placeholder="Nouveau mot de passe" secureTextEntry value={password} onChangeText={setPassword} />
        {errors.password ? <ThemedText style={{ color: '#c82323' }}>{errors.password}</ThemedText> : null}

        <Input placeholder="Confirmer le mot de passe" secureTextEntry value={confirm} onChangeText={setConfirm} />
        {errors.confirm ? <ThemedText style={{ color: '#c82323' }}>{errors.confirm}</ThemedText> : null}

        <Button title="Réinitialiser" variant="primary" onPress={submit} />
      </View>

      <LoadingModal visible={loading} message="Réinitialisation..." />
      <StatusModal visible={status.visible} status={status.status} title={status.title} message={status.message} onClose={() => setStatus((s) => (s ? { ...s, visible: false } : s))} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  body: { marginTop: 12 },
});
