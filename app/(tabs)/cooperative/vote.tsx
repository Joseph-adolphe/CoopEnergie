import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { PieChart } from '@/components/ui/chart-pie';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';

// ===== IMPORT SUPABASE =====
import { supabase } from '@/config/supabase';

export default function Vote() {
  const [proposal, setProposal] = useState<any>(null);
  const [votes, setVotes] = useState<any[]>([]);
  const [userVoted, setUserVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ visible: boolean; status: 'success' | 'error'; title?: string; message?: string } | null>(null);

  const router = useRouter();
  const accent = useThemeColor({}, 'accentGreen') as string;
  const darkGreen = useThemeColor({}, 'darkGreen') as string;

  // ===== RÉCUPÉRER LES PROPOSITIONS ET VOTES =====
  useEffect(() => {
    fetchProposalAndVotes();
  }, []);

  const fetchProposalAndVotes = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupère les propositions en attente
      const { data: proposals, error: proposalError } = await supabase
        .from('proposals')
        .select('*')
        .eq('status', 'en_attente')
        .limit(1)
        .single();

      if (proposalError && proposalError.code !== 'PGRST116') {
        throw proposalError;
      }

      if (!proposals) {
        setProposal(null);
        setVotes([]);
        setLoading(false);
        return;
      }

      console.log('✅ Proposition récupérée :', proposals);
      setProposal(proposals);

      // Récupère les votes pour cette proposition
      const { data: votesData, error: votesError } = await supabase
        .from('votes')
        .select('*')
        .eq('proposal_id', proposals.id);

      if (votesError) {
        throw votesError;
      }

      console.log('✅ Votes récupérés :', votesData);
      setVotes(votesData || []);

      // Vérifie si l'utilisateur a déjà voté (TEMPORAIRE : utilise un ID test)
      const userId = 'b3c965b9-7df6-45c2-92c3-809c6c8c3741';
      const userVote = votesData?.some((v: any) => v.user_id === userId);
      setUserVoted(!!userVote);
    } catch (err: any) {
      console.error('❌ Erreur :', err.message);
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  // ===== COMPTER LES VOTES =====
  const countVotes = () => {
    const yesCount = votes.filter((v: any) => v.choix === 'oui').length;
    const noCount = votes.filter((v: any) => v.choix === 'non').length;
    const abstainCount = votes.filter((v: any) => v.choix === 'abstention').length;
    return { yesCount, noCount, abstainCount };
  };

  const { yesCount, noCount, abstainCount } = countVotes();

  // ===== ENREGISTRER UN VOTE =====
  const cast = async (choice: 'oui' | 'non' | 'abstention') => {
    try {
      setVoting(true);

      // TEMPORAIRE : ID utilisateur test
      const userId = 'b3c965b9-7df6-45c2-92c3-809c6c8c3741';

      // Enregistre le vote dans Supabase
      const { data, error } = await supabase
        .from('votes')
        .insert([
          {
            proposal_id: proposal.id,
            user_id: userId,
            choix: choice,
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      console.log('✅ Vote enregistré :', data);

      setVoting(false);
      setUserVoted(true);
      setStatus({
        visible: true,
        status: 'success',
        title: 'Merci',
        message: `Votre vote (${
          choice === 'oui' ? 'Oui' : choice === 'non' ? 'Non' : 'Abstention'
        }) a été pris en compte.`,
      });

      // Recharge les votes
      setTimeout(() => {
        fetchProposalAndVotes();
        setTimeout(() => {
          router.replace('/cooperative/dashboard');
        }, 1000);
      }, 1000);
    } catch (err: any) {
      console.error('❌ Erreur vote :', err.message);
      setVoting(false);
      setStatus({
        visible: true,
        status: 'error',
        title: 'Erreur',
        message: err.message || 'Erreur lors du vote',
      });
    }
  };

  // ===== LOADING =====
  if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={darkGreen} />
        <ThemedText style={{ marginTop: 12 }}>Chargement de la proposition...</ThemedText>
      </ThemedView>
    );
  }

  // ===== PAS DE PROPOSITION =====
  if (!proposal) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ThemedText style={{ textAlign: 'center', opacity: 0.7, marginBottom: 12 }}>
          Aucune proposition en attente de vote
        </ThemedText>
        <Button
          title="Retour au dashboard"
          variant="primary"
          onPress={() => router.replace('/cooperative/dashboard')}
        />
      </ThemedView>
    );
  }

  // ===== RENDER =====
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{proposal.description}</ThemedText>

      {/* Message si déjà voté */}
      {userVoted && (
        <View style={{ marginTop: 12, padding: 12, backgroundColor: '#EEF7EF', borderRadius: 8 }}>
          <ThemedText style={{ color: accent }}>✅ Vous avez déjà voté</ThemedText>
        </View>
      )}

      {/* Boutons de vote */}
      {!userVoted && (
        <>
          <View style={{ marginTop: 24 }}>
            <Button
              title="✓  Oui, valider"
              variant="primary"
              onPress={() => cast('oui')}
              disabled={voting}
              style={{ paddingVertical: 14, borderRadius: 12, height: 64 }}
            />
          </View>

          <View style={{ marginTop: 12 }}>
            <Button
              title="✕  Non, refuser"
              variant="secondary"
              onPress={() => cast('non')}
              disabled={voting}
              style={{
                paddingVertical: 14,
                borderRadius: 12,
                height: 64,
                backgroundColor: '#c82323',
              }}
            />
          </View>

          <View style={{ marginTop: 12 }}>
            <Button
              title="⊘  Abstention"
              variant="secondary"
              onPress={() => cast('abstention')}
              disabled={voting}
              style={{ paddingVertical: 14, borderRadius: 12, height: 64 }}
            />
          </View>
        </>
      )}

      {/* Résultats */}
      <View style={styles.results}>
        <ThemedText type="defaultSemiBold">Résultats actuels</ThemedText>
        <View style={{ marginTop: 12 }}>
          {yesCount + noCount + abstainCount > 0 ? (
            <>
              <PieChart
                segments={[
                  { value: yesCount, color: accent, label: `Oui (${yesCount})` },
                  { value: noCount, color: '#d9534f', label: `Non (${noCount})` },
                  { value: abstainCount, color: '#FFA500', label: `Abstention (${abstainCount})` },
                ].filter((s) => s.value > 0)}
              />
              <ThemedText style={{ textAlign: 'center', marginTop: 12, opacity: 0.7 }}>
                Total : {yesCount + noCount + abstainCount} vote
                {yesCount + noCount + abstainCount > 1 ? 's' : ''}
              </ThemedText>
            </>
          ) : (
            <ThemedText style={{ textAlign: 'center', opacity: 0.7 }}>
              Aucun vote pour le moment
            </ThemedText>
          )}
        </View>
      </View>

      <View style={styles.infoBox}>
        <ThemedText>Chaque membre a 1 voix. Votre vote compte !</ThemedText>
      </View>

      {/* Messages d'erreur */}
      {error && (
        <View style={{ marginTop: 12, padding: 12, backgroundColor: '#FFE8E8', borderRadius: 8 }}>
          <ThemedText style={{ color: '#FF6B6B' }}>⚠️ {error}</ThemedText>
        </View>
      )}

      <LoadingModal visible={voting} message="Enregistrement du vote..." />
      {status ? (
        <StatusModal
          visible={status.visible}
          status={status.status}
          title={status.title}
          message={status.message}
          onClose={() => setStatus(null)}
        />
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 64 },
  results: { marginTop: 18 },
  infoBox: { marginTop: 18, padding: 14, borderRadius: 12, backgroundColor: '#eef8f0' },
});
