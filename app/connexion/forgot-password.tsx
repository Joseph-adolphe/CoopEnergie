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

const phoneRegex = /^\+?[0-9]{6,15}$/;
const identifierSchema = z
  .string()
  .min(1, 'Email ou téléphone requis')
  .refine((v) => z.string().email().safeParse(v).success || phoneRegex.test(v), { message: 'Entrez un email ou un téléphone valide' });

export default function ForgotPassword() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; status: 'success' | 'error'; title?: string; message?: string }>({ visible: false, status: 'success' });

  function send() {
    try {
      identifierSchema.parse(identifier);
      setError(undefined);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStatus({ visible: true, status: 'success', title: 'Code envoyé', message: 'Vérifiez votre email ou téléphone.' });
        setTimeout(() => {
          setStatus((s) => ({ ...s, visible: false }));
          router.push('/connexion/otp?flow=reset');
        }, 900);
      }, 800);
    } catch (err) {
      if (err instanceof ZodError) setError(err.issues[0]?.message);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Mot de passe oublié</ThemedText>
      <ThemedText style={styles.body}>Entrez votre email ou téléphone pour recevoir les instructions.</ThemedText>

      <View style={{ marginTop: 18 }}>
        <Input placeholder="Email ou téléphone" value={identifier} onChangeText={setIdentifier} />
        {error ? <ThemedText style={{ color: '#c82323' }}>{error}</ThemedText> : null}

        <Button style={{margin: 8}} title="Envoyer" variant="primary" onPress={send} />
      </View>

      <LoadingModal visible={loading} message="Envoi du code..." />
      <StatusModal visible={status.visible} status={status.status} title={status.title} message={status.message} onClose={() => setStatus((s) => ({ ...s, visible: false }))} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 , paddingTop: 48 },
  body: { marginTop: 12 },
});
