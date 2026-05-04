import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { z, ZodError } from 'zod';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';
import { Dialog } from '@/components/ui/dialog';
import { useThemeColor } from '@/hooks/use-theme-color';

const voteSchema = z.object({
  title: z.string().min(3, 'Titre trop court'),
  question: z.string().min(6, 'Question trop courte'),
  deadline: z.string().min(3, 'Date limite requise'),
});

export default function KitDetail() {
  const { id } = useLocalSearchParams();
  const [voteOpen, setVoteOpen] = useState(false);
  const [title, setTitle] = useState('Achat du kit solaire 200W');
  const [question, setQuestion] = useState("Approuvez-vous l'achat du kit solaire autonome 200W proposé par SolarPlus Cameroun pour 180 000 FCFA ?");
  const [deadline, setDeadline] = useState('23 Mai 2024 à 10:00');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; status: 'success' | 'error'; title?: string; message?: string } | null>(null);

  const progress = 150000;
  const total = 180000;
  const percent = Math.round((progress / total) * 100);
  const accent = useThemeColor({}, 'accentGreen') as string;

  function openVote() {
    setVoteOpen(true);
  }

  function launchVote() {
    try {
      voteSchema.parse({ title, question, deadline });
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setVoteOpen(false);
        setStatus({ visible: true, status: 'success', title: 'Vote lancé', message: 'Le vote a bien été créé.' });
      }, 900);
    } catch (err) {
      if (err instanceof ZodError) {
        setStatus({ visible: true, status: 'error', title: 'Erreur', message: err.issues[0]?.message });
      }
    }
  }

  return (
    <ThemedView style={styles.container}>
      <Image source={require('../../../../assets/images/placeholder.png')} style={styles.image} resizeMode="contain" />

      <ThemedText type="title">Kit solaire autonome 200W</ThemedText>

      <View style={styles.row}><ThemedText type='text'>Prix total</ThemedText><ThemedText type="defaultSemiBold">180 000 FCFA</ThemedText></View>
      <View style={styles.description}><ThemedText type='text'>Description :</ThemedText>
       <ThemedText type='text' style={{maxWidth: '100%' , textOverflow:'break-word' }}> 1 panneau 200W , 1 batterie 12V,  1 régulateur,  câbles et accessoires</ThemedText>
      </View>
      <View style={styles.row}><ThemedText type='text'>Garantie</ThemedText><ThemedText type='defaultSemiBold'>2 ans</ThemedText></View>
      <View style={styles.row}><ThemedText type='text'>Livraison estimée</ThemedText><ThemedText type='defaultSemiBold'>7 jours</ThemedText></View>

      <View style={styles.divider} />

      <ThemedText type="defaultSemiBold">Fonds disponibles</ThemedText>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: accent }]} />
      </View>
      <ThemedText type='text' style={{ marginTop: 6 }}>{progress.toLocaleString()} / {total.toLocaleString()} FCFA</ThemedText>
      {/* <ThemedText type='text' style={{ marginTop: 6 }}>{percent}%</ThemedText> */}

      <View style={{ marginTop: 20 }}>
        <Button title="Soumettre au vote" variant="primary" onPress={openVote} />
      </View>

      <Dialog visible={voteOpen} title="Lancer un vote (Admin)" onClose={() => setVoteOpen(false)} actions={[{ label: 'Lancer le vote', onPress: launchVote }, { label: 'Annuler', onPress: () => setVoteOpen(false) }] }>
        <Input label="Titre du vote" value={title} onChangeText={setTitle} />
        <Input label="Question" value={question} onChangeText={setQuestion} />
        <Input label="Date limite du vote" value={deadline} onChangeText={setDeadline} />
      </Dialog>

      <LoadingModal visible={loading} />
      {status ? <StatusModal visible={status.visible} status={status.status} title={status.title} message={status.message} onClose={() => setStatus((s) => (s ? { ...s, visible: false } : s))} /> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
   container: { flex: 1, padding: 16  , alignContent: 'center' , justifyContent: 'center' },
  image: { width: '100%', height: 220, borderRadius: 12, backgroundColor: '#f4f4f4', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  description : {
    flexDirection: 'column', justifyContent: 'space-between', marginTop: 8 , gap : 4
  },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginVertical: 12 },
  progressBar: { height: 12, backgroundColor: '#eee', borderRadius: 8, overflow: 'hidden', marginTop: 8 },
  progressFill: { height: '100%' },
});
