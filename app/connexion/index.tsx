import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { z, ZodError } from 'zod';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/context/AuthContext';

// ===== IMPORT SUPABASE =====
import { supabase } from '@/config/supabase';

const phoneRegex = /^\+?[0-9]{6,15}$/;

const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email ou tÃ©lÃ©phone requis')
    .refine((v) => z.email().safeParse(v).success || phoneRegex.test(v), {
      message: 'Entrez un email ou un tÃ©lÃ©phone valide',
    }),
  password: z.string().min(6, 'Mot de passe trop court (min 6 caractÃ¨res)'),
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

  const { loginAsSupplier } = useAuth();
  const primaryColor = useThemeColor({}, 'darkGreen') as string;

  // ===== AUTHENTIFICATION AVEC SUPABASE =====
  async function onSubmit() {
    try {
      loginSchema.parse({ identifier, password });
      setErrors({});
      setLoading(true);

      // Cherche l'utilisateur par email ou tÃ©lÃ©phone dans Supabase
      const { data: users, error: searchError } = await supabase
        .from('users')
        .select('*')
        .or(`email.eq.${identifier},telephone.eq.${identifier}`)
        .limit(1);

      if (searchError) {
        throw searchError;
      }

      if (!users || users.length === 0) {
        setLoading(false);
        setStatus({
          visible: true,
          status: 'error',
          title: 'Utilisateur non trouvÃ©',
          message: 'Cet email ou tÃ©lÃ©phone n\'existe pas. CrÃ©ez un compte.',
        });
        return;
      }

      const user = users[0];
      console.log('âœ… Utilisateur trouvÃ© :', user);

      // TEMPORAIRE : Validation simple du mot de passe
      // En production, vous devriez utiliser Supabase Auth ou bcrypt
      if (password !== 'password123') {
        setLoading(false);
        setStatus({
          visible: true,
          status: 'error',
          title: 'Mot de passe incorrect',
          message: 'Veuillez vÃ©rifier votre mot de passe.',
        });
        return;
      }

      // VÃ©rifie si c'est un fournisseur
      if (user.role === 'fournisseur') {
        setStatus({
          visible: true,
          status: 'success',
          title: 'Connexion fournisseur',
          message: "Redirection vers l'interface fournisseur...",
        });

        setTimeout(() => {
          setLoading(false);
          setStatus((s) => (s ? { ...s, visible: false } : s));
          router.replace('/fournisseur_dashboard');
        }, 900);
        return;
      }

      // Connexion rÃ©ussie pour adhÃ©rent/admin
      setStatus({
        visible: true,
        status: 'success',
        title: 'Connexion rÃ©ussie',
        message: `Bienvenue ${user.nom} !`,
      });

      // Sauvegarde l'ID utilisateur (Ã  passer Ã  AuthContext)
      console.log('âœ… Connexion rÃ©ussie pour :', user.nom);

      setTimeout(() => {
        setLoading(false);
        setStatus((s) => (s ? { ...s, visible: false } : s));
        router.replace('/accueil');
      }, 900);
    } catch (err) {
      setLoading(false);

      if (err instanceof ZodError) {
        const parsed: any = {};
        for (const issue of err.issues) {
          if (issue.path?.[0] === 'identifier') parsed.identifier = issue.message;
          if (issue.path?.[0] === 'password') parsed.password = issue.message;
        }
        setErrors(parsed);
      } else if (err instanceof Error) {
        setStatus({
          visible: true,
          status: 'error',
          title: 'Erreur de connexion',
          message: err.message,
        });
      }
    }
  }

  return (
    <ThemedView style={styles.container}>
      <Image source={require('@/assets/images/logo.jpg')} style={styles.logo} resizeMode="contain" />
      <ThemedText type="title">Bienvenue !</ThemedText>
      <ThemedText style={styles.subtitle}>Connectez-vous Ã  votre compte</ThemedText>

      <View style={styles.form}>
        <Input
          label="Email/Telephone"
          placeholder="Email ou tÃ©lÃ©phone"
          value={identifier}
          onChangeText={setIdentifier}
          editable={!loading}
        />
        {errors.identifier ? <ThemedText style={styles.error}>{errors.identifier}</ThemedText> : null}

        <Input
          label="Mot de passe"
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />
        {errors.password ? <ThemedText style={styles.error}>{errors.password}</ThemedText> : null}

        <Link href="/connexion/forgot-password" style={styles.forgotLink}>
          <ThemedText style={styles.forgotText}>Mot de passe oubliÃ© ?</ThemedText>
        </Link>

        <Button
          title="Se connecter"
          variant="primary"
          onPress={onSubmit}
          disabled={loading}
        />

        <TouchableOpacity
          style={[styles.googleBtn, { borderColor: primaryColor }]}
          disabled={loading}
        >
          <ThemedText style={{ textAlign: 'center' }}>Continuer avec Google</ThemedText>
        </TouchableOpacity>

        <Button
          title="Pas de compte ? Inscrivez-vous"
          variant="ghost"
          onPress={() => router.push('/inscription')}
          disabled={loading}
        />

        {/* Info pour tester */}
        <View style={{ marginTop: 16, padding: 12, backgroundColor: '#EEF7EF', borderRadius: 8 }}>
          <ThemedText style={{ fontSize: 12, opacity: 0.7 }}>
            ðŸ§ª Compte test : sam.admin@test.com / password123
          </ThemedText>
        </View>
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
  container: { flex: 1, padding: 24, alignContent: 'center', justifyContent: 'center' },
  subtitle: { marginTop: 8, marginBottom: 18 },
  form: { width: '100%', gap: 12 },
  error: { color: '#c82323', marginBottom: 6 },
  logo: { width: 90, height: 90, marginBottom: 12 },
  forgotLink: { alignSelf: 'flex-end', marginVertical: 6 },
  forgotText: { color: '#00450D' },
  googleBtn: { marginTop: 8, paddingVertical: 8, borderRadius: 12, borderWidth: 2 },
});
