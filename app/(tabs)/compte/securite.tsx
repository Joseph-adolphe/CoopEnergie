import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';

export default function Securite() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; kind?: 'success' | 'error'; title?: string; message?: string }>({ visible: false });

  function handleSave() {
    if (!currentPassword || !newPassword) {
      setStatus({ visible: true, kind: 'error', title: "Erreur", message: 'Veuillez remplir tous les champs.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ visible: true, kind: 'error', title: "Erreur", message: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatus({ visible: true, kind: 'success', title: 'Mot de passe modifié', message: "Votre mot de passe a été mis à jour." });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 900);
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Sécurité</ThemedText>

      <View style={styles.form}>
        <Input label="Mot de passe actuel" secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} />
        <Input label="Nouveau mot de passe" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
        <Input label="Confirmer mot de passe" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

        <Button title="Enregistrer" variant="primary" onPress={handleSave} style={{ marginTop: 12 }} />
      </View>

      <LoadingModal visible={loading} message="Modification en cours..." />

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
  container: { flex: 1, padding: 20 ,justifyContent: 'center' },
  form: { marginTop: 12 },
});
