import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';
import { useThemeColor } from '@/hooks/use-theme-color';

const SAMPLE_MEMBERS = [
  { id: '1', name: 'Sophie Dubois', role: 'Administrateur', online: true },
  { id: '2', name: 'Marc Durand', role: 'Membre', online: true },
  { id: '3', name: 'Isabelle Moreau', role: 'Membre', online: false },
  { id: '4', name: 'Thomas Bernard', role: 'Technicien', online: true },
  { id: '5', name: 'Claire Lefevre', role: 'Membre', online: false },
];

export default function MembersScreen() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteText, setInviteText] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; status: 'success' | 'error'; title?: string; message?: string } | null>(null);

  const border = useThemeColor({}, 'border') as string;

  function sendInvite() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setInviteOpen(false);
      setInviteText('');
      setStatus({ visible: true, status: 'success', title: 'Invitation envoyée', message: "Un lien d'invitation a été envoyé." });
    }, 900);
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Membres</ThemedText>

      <ThemedText style={styles.meta}>10 Membres • 5 En ligne</ThemedText>

      <FlatList
        data={SAMPLE_MEMBERS}
        keyExtractor={(i) => i.id}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.row, { borderBottomColor: border }]}> 
            <Avatar name={item.name} size={48} />
            <View style={styles.info}>
              <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
              <ThemedText type="subtitle">{item.role}</ThemedText>
            </View>
            <ThemedText style={[styles.status, { color: item.online ? useThemeColor({}, 'darkGreen') : useThemeColor({}, 'textMuted') }]}>
              {item.online ? 'En ligne' : 'Hors ligne'}
            </ThemedText>
          </TouchableOpacity>
        )}
      />

      <View style={styles.footer}> 
        <Button title="Inviter un membre" variant="primary" onPress={() => setInviteOpen(true)} />
      </View>

      <Dialog
        visible={inviteOpen}
        title="Inviter un membre"
        onClose={() => setInviteOpen(false)}
        actions={[{ label: 'Inviter', onPress: sendInvite }, { label: 'Annuler', onPress: () => setInviteOpen(false) }]}
      >
        <Input placeholder="Téléphone ou email" value={inviteText} onChangeText={setInviteText} />
      </Dialog>

      <LoadingModal visible={loading} message="Envoi de l'invitation..." />

      {status ? (
        <StatusModal visible={status.visible} status={status.status} title={status.title} message={status.message} onClose={() => setStatus(null)} />
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  meta: { marginTop: 8, marginBottom: 12 },
  list: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12, borderBottomWidth: 1 },
  info: { flex: 1 },
  status: { minWidth: 80, textAlign: 'right' },
  footer: { paddingVertical: 16 },
});
