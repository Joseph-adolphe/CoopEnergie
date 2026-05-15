import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/config/supabase';


type VoteChoice = 'oui' | 'non' | 'abstention';
const PLACEHOLDER = require('@/assets/images/placeholder.png');


export default function Vote() {
 const imageUri = '';
 const darkGreen = useThemeColor({}, 'darkGreen') as string;
  const [proposal, setProposal] = useState<any>(null);
  const [votes, setVotes] = useState<any[]>([]);
  const [userVoted, setUserVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<{
    visible: boolean;
    status: 'success' | 'error';
    title?: string;
    message?: string;
  } | null>(null);

  const router = useRouter();
  const accentGreen = '#1A8C3E';

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

    const countVotes = () => {
    const yesCount = votes.filter((v: any) => v.choix === 'oui').length;
    const noCount = votes.filter((v: any) => v.choix === 'non').length;
    const abstainCount = votes.filter((v: any) => v.choix === 'abstention').length;
    return { yesCount, noCount, abstainCount };
  };

    const { yesCount, noCount, abstainCount } = countVotes();


  const cast = async (choice: VoteChoice) => {
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
          router.replace(`/vote-details?yes=${yesCount}&no=${noCount}&abstain=${abstainCount}`);
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

 if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={darkGreen} />
        <ThemedText style={{ marginTop: 12 }}>Chargement de la proposition...</ThemedText>
      </ThemedView>
    );
  }

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

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ── En-tête ── */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <ThemedText style={styles.badgeText}>Vote en cours · 6 jours restants</ThemedText>
          </View>
          <ThemedText style={styles.title}>
           {proposal.description}
          </ThemedText>
                {userVoted && (
        <View style={{ marginTop: 12, padding: 12, backgroundColor: '#EEF7EF', borderRadius: 8 }}>
          <ThemedText style={{ color: accentGreen }}> Vous avez déjà voté</ThemedText>
        </View>
              )}
          <ThemedText style={styles.subtitle}>
            Proposé par Marie Claire (Admin) · 20 Mai 2024
          </ThemedText>
        </View>

        {/* ── Résumé ── */}
        <View style={styles.card}>
          <ThemedText style={styles.sectionLabel}>Résumé de la proposition</ThemedText>
          <ThemedText style={styles.cardBody}>
            L'objectif est d'équiper 10 foyers membres de la coopérative avec des kits solaires
            résidentiels 3kW pour améliorer l'accès à une énergie propre et réduire les coûts
            énergétiques.
          </ThemedText>
        </View>

        {/* ── Produit ── */}
        <View style={[styles.card, styles.productCard]}>
          <View style={styles.productIcon}>
             <Image source={imageUri ? { uri: imageUri } : PLACEHOLDER} style={styles.image} resizeMode="cover" />
          </View>
          <View style={styles.productInfo}>
            <ThemedText style={styles.productName}>Kit solaire résidentiel 3kW</ThemedText>
            <ThemedText style={styles.productPrice}>850 000 FCFA</ThemedText>
            <ThemedText style={styles.productSpec}>Puissance : 3kW · Batterie : 5kWh · Garantie : 2 ans</ThemedText>
          </View>
        </View>

        {/* ── Détails ── */}
        <View style={styles.card}>
          <ThemedText style={styles.sectionLabel}>Détails du vote</ThemedText>
          <VoteDetail label="Date de début" value="20 Mai 2024 à 10:00" />
          <VoteDetail label="Date de fin" value="27 Mai 2024 à 23:59" />
          <VoteDetail label="Approbation requise" value='60 % des votes "Oui"' />
          <VoteDetail label="Organisé par" value="Coopérative Soleil" last />
        </View>


{ !userVoted && (
        <>
        <ThemedText style={styles.votePrompt}>
          Lisez attentivement la proposition et répondez.
        </ThemedText>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.voteBtn, styles.voteBtnYes]}
            onPress={() => cast('oui')}
            activeOpacity={0.85}
            disabled={voting}
          >
            <IconSymbol name="checkmark.circle.fill" size={22} color="#fff" />
            <ThemedText style={styles.voteBtnText}>Oui</ThemedText>
            <ThemedText style={styles.voteBtnSub}>J'approuve cette proposition</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.voteBtn, styles.voteBtnNo]}
            onPress={() => cast('non')}
            activeOpacity={0.85}
            disabled={voting}
          >
            <IconSymbol name="xmark" size={22} color="#fff" />
            <ThemedText style={styles.voteBtnText}>Non</ThemedText>
            <ThemedText style={styles.voteBtnSub}>Je ne suis pas d'accord</ThemedText>
          </TouchableOpacity>
        </View>
        </>
)}
      </ScrollView>

      {error && (
        <View style={{ marginTop: 12, padding: 12, backgroundColor: '#FFE8E8', borderRadius: 8 }}>
          <ThemedText style={{ color: '#FF6B6B' }}> {error}</ThemedText>
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

function VoteDetail({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[detailStyles.row, last && detailStyles.rowLast]}>
      <ThemedText style={detailStyles.label}>{label}</ThemedText>
      <ThemedText style={detailStyles.value}>{value}</ThemedText>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rowLast: { borderBottomWidth: 0 },
  label: { fontSize: 13, color: '#6B7280', flex: 1 },
  value: { fontSize: 13, fontWeight: '600', textAlign: 'right', flex: 1 },
});


const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { padding: 20,  paddingBottom: 40 },

  header: { marginBottom: 20 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: { fontSize: 12, fontWeight: '600' },

  title: { fontSize: 22, fontWeight: '700', lineHeight: 28, marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#6B7280' },

  card: {
    backgroundColor: '#F9FAF9',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardBody: { fontSize: 14, color: '#4B5563', lineHeight: 20 },

  productCard: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  productIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#EEF8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: { flex: 1 },
  productName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  productPrice: { fontSize: 14, color: '#1A8C3E', fontWeight: '700', marginBottom: 4 },
  productSpec: { fontSize: 12, color: '#6B7280', lineHeight: 16 },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF8F0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: { fontSize: 13, color: '#1A8C3E' },

  votePrompt: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
  },

  actions: { flexDirection: 'row', gap: 12 },
  voteBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
  },
  voteBtnYes: { backgroundColor: '#1A8C3E' },
  voteBtnNo: { backgroundColor: '#DC2626' },
  voteBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  voteBtnSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    textAlign: 'center',
  },
  image: { width: 65, height: 65, borderRadius: 8, marginRight: 12 },
});