import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';

export default function Informations() {
  const [firstName, setFirstName] = useState('Marie');
  const [lastName, setLastName] = useState('Dupont');
  const [phone, setPhone] = useState('+237 6 12 34 56 78');
  const [email, setEmail] = useState('marie@gmail.com');
  const [paymentMethod, setPaymentMethod] = useState('Mobile money');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; kind?: 'success' | 'error'; title?: string; message?: string }>({ visible: false });

  function handleSave() {
    if (!firstName || !lastName || !phone || !email) {
      setStatus({ visible: true, kind: 'error', title: 'Erreur', message: 'Complétez tous les champs.' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatus({ visible: true, kind: 'success', title: 'Informations enregistrées', message: "Vos informations ont été mises à jour." });
    }, 900);
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Informations personnelles</ThemedText>

      <View style={styles.form}>
        <Input label="Prénom" value={firstName} onChangeText={setFirstName} />
        <Input label="Nom" value={lastName} onChangeText={setLastName} />
        <Input label="Téléphone" value={phone} onChangeText={setPhone} />
        <Input label="Email" value={email} onChangeText={setEmail} />
        <Input label="Méthode de paiement" value={paymentMethod} onChangeText={setPaymentMethod} />

        <Button title="Sauvegarder" variant="primary" onPress={handleSave} style={{ marginTop: 12 }} />
      </View>

      <LoadingModal visible={loading} message="Sauvegarde en cours..." />

      <StatusModal visible={status.visible} status={status.kind === 'success' ? 'success' : 'error'} title={status.title} message={status.message} onClose={() => setStatus({ visible: false })} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20  , justifyContent: 'center'},
  form: { marginTop: 12 },
});
