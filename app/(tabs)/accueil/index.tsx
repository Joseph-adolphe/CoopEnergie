import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { spacing } from '@/constants/theme';

// ===== IMPORT SUPABASE =====
import { getAllCooperatives, getContributions } from '@/services/supabaseService';

export default function AccueilIndex() {
	const router = useRouter();
	const [cooperatives, setCooperatives] = useState<any[]>([]);
	const [contributions, setContributions] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const darkGreen = useThemeColor({}, 'darkGreen') as string;
	const accent = useThemeColor({}, 'accentGreen') as string;
	const cardBg = useThemeColor({}, 'white') as string;
	const border = useThemeColor({}, 'border') as string;

	// ===== RÉCUPÉRER LES DONNÉES DEPUIS SUPABASE =====
	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);

			// Récupère les coopératives
			const coopsData = await getAllCooperatives();
			console.log('✅ Coopératives :', coopsData);
			setCooperatives(coopsData || []);

			// Si une coopérative existe, récupère ses contributions
			if (coopsData && coopsData.length > 0) {
				const contribData = await getContributions(coopsData[0].id);
				console.log('✅ Contributions :', contribData);
				setContributions(contribData || []);
			}
		} catch (err: any) {
			console.error('❌ Erreur :', err.message);
			setError(err.message || 'Erreur lors du chargement');
		} finally {
			setLoading(false);
		}
	};

	// ===== RENDER EMPTY =====
	function renderEmpty() {
		return (
			<View style={{ marginTop: 20, flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
				<Card style={styles.emptyCard}>
					<View style={styles.emptyInner}>
						<Avatar size={72} name={''} />
						<ThemedText type="defaultSemiBold" style={{ marginTop: 12, textAlign: 'center' }}>
							Vous n'êtes membre d'aucune coopérative pour le moment.
						</ThemedText>
						<ThemedText style={{ marginTop: 8, textAlign: 'center' }}>
							Rejoignez ou créez une coopérative pour participer à des projets, contribuer et prendre des décisions ensemble.
						</ThemedText>

						<Button
							title="Créer une coopérative"
							variant="primary"
							onPress={() => router.push('../cooperative/creation/01_creation')}
							style={{ marginTop: 18 }}
						/>
					</View>
				</Card>
			</View>
		);
	}

	// ===== PROGRESS CARD =====
	function ProgressCard({ coop }: { coop: any }) {
		const percent = Math.round((coop.montant_actuel / coop.objectif_financier) * 100);
		return (
			<View style={[styles.progressCard, { backgroundColor: darkGreen }]}>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
					<View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
						<Avatar size={48} name={coop.nom} />
						<View>
							<ThemedText style={{ color: '#fff', fontWeight: '700' }}>{coop.nom}</ThemedText>
							<ThemedText style={{ color: '#fff', opacity: 0.9 }}>
								{`Objectif : ${coop.objectif_financier?.toLocaleString()} FCFA`}
							</ThemedText>
						</View>
					</View>
				</View>

				<View style={{ marginTop: 12 }}>
					<ThemedText style={{ color: '#fff', fontSize: 28, fontWeight: '700' }}>
						{`${coop.montant_actuel?.toLocaleString()} / ${coop.objectif_financier?.toLocaleString()} FCFA`}
					</ThemedText>
				</View>

				<View style={styles.progressWrap}>
					<View style={[styles.progressBar, { width: `${percent}%`, backgroundColor: accent }]} />
				</View>

				<View style={styles.progressFooter}>
					<ThemedText style={{ color: '#fff', opacity: 0.95 }}>{`${percent}% atteint`}</ThemedText>
					<ThemedText style={{ color: '#fff', opacity: 0.95 }}>Actif</ThemedText>
				</View>
			</View>
		);
	}

	// ===== RENDER SINGLE =====
	function renderSingle(coop: any) {
		return (
			<>
				<ProgressCard coop={coop} />

				<View style={[styles.activityCard, { borderColor: border, marginBottom: 12 }]}>
					<View style={{ flex: 1 }}>
						<ThemedText type="defaultSemiBold">Vote en cours</ThemedText>
						<ThemedText type="text">Vote sur l'achat d'équipements solaires</ThemedText>
					</View>
					<TouchableOpacity onPress={() => router.push('../cooperative/vote')}>
						<ThemedText style={{ color: darkGreen }}>Voir le vote</ThemedText>
					</TouchableOpacity>
				</View>

				<View style={styles.rowHeader}>
					<ThemedText type="defaultSemiBold">Contributions récentes</ThemedText>
					<TouchableOpacity onPress={() => router.push(`/cooperative/historique/${coop.id}`)}>
						<ThemedText style={{ color: darkGreen }}>Voir tout</ThemedText>
					</TouchableOpacity>
				</View>
				<View style={{ marginTop: 8 }}>
					{contributions.length > 0 ? (
						contributions.slice(0, 3).map((item) => (
							<View style={styles.row} key={item.id}>
								<Avatar name={item.user_id} size={44} />
								<View style={{ flex: 1, marginLeft: 12 }}>
									<ThemedText type="defaultSemiBold">Cotisation</ThemedText>
									<ThemedText type="text">
										{new Date(item.date).toLocaleDateString('fr-FR')}
									</ThemedText>
								</View>
								<ThemedText type="defaultSemiBold">{item.montant?.toLocaleString()} FCFA</ThemedText>
							</View>
						))
					) : (
						<ThemedText style={{ textAlign: 'center', opacity: 0.7 }}>Aucune contribution</ThemedText>
					)}
				</View>
			</>
		);
	}

	// ===== RENDER MULTIPLE =====
	function renderMultiple(list: any[]) {
		return (
			<>
				<View style={{ marginTop: 12 }}>
					<ThemedText type="defaultSemiBold">Mes coopératives</ThemedText>
				</View>

				<View style={{ marginTop: 8, gap: 12 }}>
					{list.map((c, i) => (
						<View key={c.id} style={[styles.multiCard, { backgroundColor: i === 0 ? darkGreen : cardBg, borderColor: border }]}>
							<View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
								<Avatar size={44} name={c.nom} />
								<View style={{ flex: 1 }}>
									<ThemedText style={i === 0 ? { color: '#fff', fontWeight: '700' } : undefined}>{c.nom}</ThemedText>
									<ThemedText style={i === 0 ? { color: '#fff', opacity: 0.95 } : undefined}>
										{`Objectif : ${c.objectif_financier?.toLocaleString()} FCFA`}
									</ThemedText>
								</View>
								<TouchableOpacity onPress={() => router.push(`/cooperative/dashboard?id=${c.id}`)}>
									<IconSymbol
										name={'chevron.right' as any}
										size={20}
										color={i === 0 ? '#fff' : darkGreen}
									/>
								</TouchableOpacity>
							</View>

							<View style={{ marginTop: 12 }}>
								<View style={styles.progressWrap}>
									<View
										style={[
											styles.progressBar,
											{
												width: `${Math.round((c.montant_actuel / c.objectif_financier) * 100)}%`,
												backgroundColor: accent,
											},
										]}
									/>
								</View>
							</View>
						</View>
					))}
				</View>

				<View style={{ marginTop: spacing.rLg }}>
					<ThemedText type="defaultSemiBold">Activités récentes</ThemedText>
					<Card style={{ marginTop: 8 }}>
						<View style={styles.row}>
							<IconSymbol name={'paperplane.fill' as any} size={20} color={darkGreen} />
							<View style={{ flex: 1, marginLeft: 12 }}>
								<ThemedText type="defaultSemiBold">Vote en cours</ThemedText>
								<ThemedText type="text">Vote sur l'achat d'équipements solaires</ThemedText>
							</View>
							<ThemedText>En cours</ThemedText>
						</View>
					</Card>
				</View>
			</>
		);
	}

	// ===== LOADING =====
	if (loading) {
		return (
			<ThemedView style={styles.container}>
				<ScrollView contentContainerStyle={{ padding: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<ActivityIndicator size="large" color={darkGreen} />
					<ThemedText style={{ marginTop: 12 }}>Chargement...</ThemedText>
				</ScrollView>
			</ThemedView>
		);
	}

	// ===== ERROR =====
	if (error) {
		return (
			<ThemedView style={styles.container}>
				<ScrollView contentContainerStyle={{ padding: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<ThemedText style={{ color: '#FF6B6B', textAlign: 'center' }}>❌ Erreur : {error}</ThemedText>
					<Button title="Réessayer" onPress={fetchData} style={{ marginTop: 12 }} />
				</ScrollView>
			</ThemedView>
		);
	}

	// ===== RENDER =====
	return (
		<ThemedView style={styles.container}>
			<ScrollView contentContainerStyle={{ padding: 20, flex: 1 }} showsVerticalScrollIndicator={false}>
				<View style={styles.headerRow}>
					<ThemedText type="title">Bonjour Alliance</ThemedText>
					<TouchableOpacity onPress={() => router.push('/compte/notifications')}>
						<IconSymbol name={'bell' as any} size={22} color={darkGreen} />
					</TouchableOpacity>
				</View>

				{cooperatives.length === 0 && renderEmpty()}
				{cooperatives.length === 1 && renderSingle(cooperatives[0])}
				{cooperatives.length > 1 && renderMultiple(cooperatives)}
			</ScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4, marginTop: 24 },
	emptyCard: { paddingVertical: 40, alignItems: 'center' },
	emptyInner: { alignItems: 'center' },
	progressCard: { marginTop: 12, padding: 18, borderRadius: 12 },
	roleBadge: { backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
	progressWrap: { width: '100%', height: 10, backgroundColor: '#e9f3ea', borderRadius: 8, marginTop: 12, overflow: 'hidden' },
	progressBar: { height: '100%', borderRadius: 8 },
	progressFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
	activityCard: { marginTop: 12, padding: 14, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1 },
	row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
	rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
	multiCard: { padding: 16, borderRadius: 12 },
});

