import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { z, ZodError } from 'zod';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';

const phoneRegex = /^\+?[0-9]{6,15}$/;

const registerSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  phone: z.string().regex(phoneRegex, 'Téléphone invalide, inclure l\'indicatif'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court (6 caractères minimum)'),
});

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; status: 'success' | 'error'; title?: string; message?: string }>({ visible: false, status: 'success' });

  function onSubmit() {
    try {
      registerSchema.parse({ name, phone, email, password });
      setErrors({});
      setLoading(true);

      // Simulate API: if email contains "taken" treat as already used
      setTimeout(() => {
        setLoading(false);
        if (email.includes('taken')) {
          setStatus({ visible: true, status: 'error', title: "Email déjà utilisé", message: 'Veuillez utiliser un autre email ou vous connecter.' });
        } else if (password.length < 6) {
          setStatus({ visible: true, status: 'error', title: 'Mot de passe faible', message: 'Utilisez au moins 6 caractères.' });
        } else {
          // Navigate to OTP flow for registration
          router.push(`/inscription/otp?flow=register&identifier=${encodeURIComponent(email || phone)}`);
        }
      }, 900);
    } catch (err) {
      if (err instanceof ZodError) {
        const parsed: any = {};
        for (const issue of err.issues) {
          parsed[issue.path[0]] = issue.message;
        }
        setErrors(parsed);
      }
    }
  }

  return (
    <ThemedView style={styles.container}>
       <ScrollView contentContainerStyle={{ flexGrow: 1,  justifyContent: 'center' }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
               <Image source={require('@/assets/images/logo.jpg')} style={styles.logo} resizeMode="contain" />
      <ThemedText type="title">Créez votre compte</ThemedText>
      <ThemedText type='text' style={styles.subtitle}>Remplissez le formulaire pour commencer</ThemedText>

      <View style={styles.form}>
        <Input label='Nom'  placeholder="Nom complet" value={name} onChangeText={setName} />
        {errors.name ? <ThemedText style={styles.error}>{errors.name}</ThemedText> : null}

        <Input label='Telephone' placeholder="Téléphone (+237...)" value={phone} onChangeText={setPhone} />
        {errors.phone ? <ThemedText style={styles.error}>{errors.phone}</ThemedText> : null}

        <Input label='Email' placeholder="Email" value={email} onChangeText={setEmail} />
        {errors.email ? <ThemedText style={styles.error}>{errors.email}</ThemedText> : null}

        <Input label='Mot de passe' placeholder="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} />
        {errors.password ? <ThemedText style={styles.error}>{errors.password}</ThemedText> : null}

        <Button title="S'inscrire" variant="primary" onPress={onSubmit} />

        <Button title="Déjà un compte ? Se connecter" variant="ghost" onPress={() => router.push('/connexion')} />
      </View>
       </ScrollView>

      <LoadingModal visible={loading} message="Création de votre compte..." />

      <StatusModal visible={status.visible} status={status.status} title={status.title} message={status.message} onClose={() => setStatus((s) => (s ? { ...s, visible: false } : s))} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24  , alignContent: 'center' , justifyContent: 'center'  },
  subtitle: { marginTop: 8, marginBottom: 12 },
  form: { width: '100%', gap: 8 },
  error: { color: '#c82323', marginBottom: 4 },
  logo: { width: 90, height: 90, marginBottom: 12 },
});
