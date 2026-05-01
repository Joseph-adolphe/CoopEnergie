import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { z, ZodError } from 'zod';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';
import { useThemeColor } from '@/hooks/use-theme-color';

const phoneRegex = /^\+?[0-9]{6,15}$/;

const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email ou téléphone requis')
    .refine((v) => z.string().email().safeParse(v).success || phoneRegex.test(v), {
      message: 'Entrez un email ou un téléphone valide',
    }),
  password: z.string().min(6, 'Mot de passe trop court (min 6 caractères)'),
});

export default function Connexion() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; status: 'success' | 'error'; title?: string; message?: string }>({
    visible: false,
    status: 'success',
  });

  const primaryColor = useThemeColor({}, 'darkGreen') as string;

  function onSubmit() {
    try {
      loginSchema.parse({ identifier, password });
      setErrors({});
      setLoading(true);

      // simulate authentication
      setTimeout(() => {
        setLoading(false);
        // fake success for any password 'password123', else error
        if (password === 'password123') {
          setStatus({ visible: true, status: 'success', title: 'Connexion réussie', message: 'Redirection en cours...' });
          setTimeout(() => {
            setStatus((s) => ({ ...s, visible: false }));
            router.replace('/accueil');
          }, 900);
        } else {
          setStatus({ visible: true, status: 'error', title: 'Identifiants incorrects', message: 'Veuillez réessayer.' });
        }
      }, 900);
    } catch (err) {
      if (err instanceof ZodError) {
        const parsed: any = {};
        for (const issue of err.issues) {
          if (issue.path?.[0] === 'identifier') parsed.identifier = issue.message;
          if (issue.path?.[0] === 'password') parsed.password = issue.message;
        }
        setErrors(parsed);
      }
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Bienvenue !</ThemedText>
      <ThemedText style={styles.subtitle}>Connectez-vous à votre compte</ThemedText>

      <View style={styles.form}>
        <Input placeholder="Email ou téléphone" value={identifier} onChangeText={setIdentifier} />
        {errors.identifier ? <ThemedText style={styles.error}>{errors.identifier}</ThemedText> : null}

        <Input placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />
        {errors.password ? <ThemedText style={styles.error}>{errors.password}</ThemedText> : null}

        <Link href="/connexion/forgot-password" style={styles.forgotLink}>
          <ThemedText style={styles.forgotText}>Mot de passe oublié ?</ThemedText>
        </Link>

        <Button title="Se connecter" variant="primary" onPress={onSubmit} />

        <TouchableOpacity style={[styles.googleBtn, { borderColor: primaryColor }]}> 
          <ThemedText style={{ textAlign: 'center' }}>Continuer avec Google</ThemedText>
        </TouchableOpacity>
      </View>

      <LoadingModal visible={loading} message="Connexion en cours..." />

      <StatusModal
        visible={status.visible}
        status={status.status}
        title={status.title}
        message={status.message}
        onClose={() => setStatus((s) => ({ ...s, visible: false }))}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  subtitle: { marginTop: 8, marginBottom: 18 },
  form: { width: '100%', gap: 12 },
  error: { color: '#c82323', marginBottom: 6 },
  forgotLink: { alignSelf: 'flex-end', marginVertical: 6 },
  forgotText: { color: '#00450D' },
  googleBtn: { marginTop: 12, paddingVertical: 12, borderRadius: 12, borderWidth: 2 },
});
