import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function CooperativeReport() {
  const { id } = useLocalSearchParams();
  const [shareOpen, setShareOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; status: 'success' | 'error'; title?: string; message?: string } | null>(null);

  const cyan = useThemeColor({}, 'cyanCard') as string;

  function download() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShareOpen(false);
      setStatus({ visible: true, status: 'success', title: 'Téléchargement', message: 'Le rapport a été téléchargé.' });
    }, 900);
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Rapport de la coopérative</ThemedText>

      <ThemedText style={{ marginTop: 8 }}>Rapport généré automatiquement</ThemedText>

      <View style={styles.table}>
        <View style={styles.row}><ThemedText>Coopérative</ThemedText><ThemedText>Alliance Énergie</ThemedText></View>
        <View style={styles.row}><ThemedText>Période</ThemedText><ThemedText>01 Mai - 21 Mai 2024</ThemedText></View>
        <View style={styles.row}><ThemedText>Objectif</ThemedText><ThemedText>200 000 FCFA</ThemedText></View>
        <View style={styles.row}><ThemedText>Total collecté</ThemedText><ThemedText>150 000 FCFA (75%)</ThemedText></View>
        <View style={styles.row}><ThemedText>Nombre de membres</ThemedText><ThemedText>10</ThemedText></View>
        <View style={styles.row}><ThemedText>Votes organisés</ThemedText><ThemedText>1</ThemedText></View>
        <View style={styles.row}><ThemedText>Dépenses effectuées</ThemedText><ThemedText>0 FCFA</ThemedText></View>
      </View>

      <View style={[styles.signed, { backgroundColor: cyan }]}>
        <ThemedText>Rapport signé et vérifié sur blockchain</ThemedText>
      </View>

      <View style={styles.actions}>
        <Button title="Aperçu PDF" variant="ghost" onPress={() => setStatus({ visible: true, status: 'success', title: 'Aperçu', message: 'Prévisualisation du PDF (simulée).' })} />
        <Button title="Télécharger PDF" variant="primary" onPress={() => setShareOpen(true)} />
      </View>

      <Dialog visible={shareOpen} title="Partager le rapport" onClose={() => setShareOpen(false)} actions={[{ label: 'Télécharger', onPress: download }, { label: 'Annuler', onPress: () => setShareOpen(false) }] }>
        <ThemedText>Choisissez comment partager ou sauvegarder le rapport :</ThemedText>
        <View style={{ marginTop: 12 }}>
          <ThemedText>• WhatsApp</ThemedText>
          <ThemedText>• Email</ThemedText>
          <ThemedText>• Enregistrer sur l'appareil</ThemedText>
          <ThemedText>• Imprimer</ThemedText>
        </View>
      </Dialog>

      <LoadingModal visible={loading} />
      {status ? <StatusModal visible={status.visible} status={status.status} title={status.title} message={status.message} onClose={() => setStatus(null)} /> : null}

      <Link href="../cooperative" style={styles.next}>Retour</Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  table: { marginTop: 12, borderRadius: 8, backgroundColor: '#fff', padding: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)' },
  signed: { marginTop: 12, padding: 12, borderRadius: 10 },
  actions: { marginTop: 16, flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
  next: { marginTop: 24, color: '#00450D' },
});
