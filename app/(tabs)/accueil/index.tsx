import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { spacing } from '@/constants/theme';

// Sample data — replace by API data in production
const MOCK_NONE: any[] = [];
const MOCK_ONE = [
	{
		id: 'c1',
		name: 'Coopérative Soleil',
		role: 'Admin',
		objective: 200000,
		collected: 75000,
		deadline: '12 jours',
	},
];
const MOCK_MULTI = [
	...MOCK_ONE,
	{
		id: 'c2',
		name: 'Énergie Verte',
		role: 'Membre',
		objective: 150000,
		collected: 45000,
		deadline: '18 jours',
	},
];

export default function AccueilIndex() {
	const router = useRouter();
	// Switch data here for preview: MOCK_NONE / MOCK_ONE / MOCK_MULTI
	const cooperatives = MOCK_ONE;

	const darkGreen = useThemeColor({}, 'darkGreen') as string;
	const accent = useThemeColor({}, 'accentGreen') as string;
	const cardBg = useThemeColor({}, 'white') as string;
	const border = useThemeColor({}, 'border') as string;

	function renderEmpty() {
		return (
			<View style={styles.emptyWrapper}>
				<View style={styles.emptyCard}>
					{/* Icône groupe */}
					<View style={styles.emptyIconWrap}>
						<Avatar size={72} name={''} />
					</View>

					<ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
						Vous n'êtes membre d'aucune coopérative pour le moment.
					</ThemedText>

					<ThemedText style={styles.emptySubtitle}>
						Rejoignez ou créez une coopérative pour participer à des projets, contribuer et prendre des décisions ensemble.
					</ThemedText>

					<Button
						title="+ Créer ou rejoindre une coopérative"
						variant="primary"
						onPress={() => router.push('/cooperative/creation/01_creation')}
						style={styles.emptyButton}
					/>
				</View>
			</View>
		);
	}

	function renderSingle(coop: any) {
		const percent = Math.round((coop.collected / coop.objective) * 100);

		return (
			<>
				<ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
					Ma coopérative
				</ThemedText>

				<TouchableOpacity
					activeOpacity={0.92}
					style={[styles.singleCard, { backgroundColor: darkGreen }]}
					onPress={() => router.push('/cooperative/dashboard')}
				>
					<View style={styles.singleCardHeader}>
						<Avatar size={48} name={coop.name} />
						<View style={{ flex: 1, marginLeft: 12 }}>
							<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
								<ThemedText style={styles.singleCardName}>{coop.name}</ThemedText>
								<View style={styles.roleBadge}>
									<ThemedText style={styles.roleBadgeText}>{coop.role}</ThemedText>
								</View>
							</View>
							<ThemedText style={styles.singleCardObjectif}>{`Objectif : ${coop.objective.toLocaleString()} FCFA`}</ThemedText>
						</View>
						<IconSymbol name={'chevron.right' as any} size={20} color="#fff" />
					</View>

					<ThemedText style={styles.singleCardAmount}>
						{`${coop.collected.toLocaleString()} `}
						<ThemedText style={styles.singleCardAmountSub}>{`/ ${coop.objective.toLocaleString()} FCFA`}</ThemedText>
					</ThemedText>

					<View style={styles.progressWrap}>
						<View style={[styles.progressBar, { width: `${percent}%`, backgroundColor: accent }]} />
					</View>

					<View style={styles.progressFooter}>
						<ThemedText style={styles.progressFooterText}>{`${percent}% atteint`}</ThemedText>
						<ThemedText style={styles.progressFooterText}>{`Objectif en ${coop.deadline}`}</ThemedText>
					</View>
				</TouchableOpacity>

				<View style={styles.activitiesHeader}>
					<ThemedText type="defaultSemiBold">Activités récentes</ThemedText>
					<TouchableOpacity>
						<ThemedText style={[styles.linkText, { color: darkGreen }]}>Voir tout</ThemedText>
					</TouchableOpacity>
				</View>

				<View style={[styles.activityItem, { borderColor: border }]}>
					<View style={[styles.activityIconWrap, { backgroundColor: '#FFF3E8' }]}>
						<IconSymbol name={'checkmark.square' as any} size={20} color="#F5813A" />
					</View>
					<View style={{ flex: 1, marginLeft: 12 }}>
						<View style={styles.activityItemHeader}>
							<ThemedText type="defaultSemiBold">Vote en cours</ThemedText>
							<ThemedText style={styles.activityBadge}>2 jours restants</ThemedText>
						</View>
						<ThemedText type='text' style={styles.activitySubtext}>Vote sur l'achat d'équipements solaires</ThemedText>
						<TouchableOpacity onPress={() => router.push('/vote')} style={{ marginTop: 6 }}>
							<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
								<ThemedText style={[styles.linkText, { color: darkGreen }]}>Voir le vote</ThemedText>
								<IconSymbol name={'chevron.right' as any} size={14} color={darkGreen} />
							</View>
						</TouchableOpacity>
					</View>
				</View>

				<View style={[styles.activityItem, { borderColor: border }]}>
					<View style={[styles.activityIconWrap, { backgroundColor: '#E8F5E9' }]}>
						<IconSymbol name={'arrow.up.circle.fill' as any} size={20} color={darkGreen} />
					</View>
					<View style={{ flex: 1, marginLeft: 12 }}>
						<View >
							<ThemedText type="defaultSemiBold">Dernière contribution</ThemedText>
							<ThemedText type="defaultSemiBold">10 000 FCFA</ThemedText>
						</View>
						<ThemedText style={styles.activitySubtext}>20 Mai 2024 - 10:30</ThemedText>
						<TouchableOpacity onPress={() => router.push('/cooperative/historique/1')} style={{ marginTop: 6 }}>
							<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
								<ThemedText style={[styles.linkText, { color: darkGreen }]}>Voir l'historique</ThemedText>
								<IconSymbol name={'chevron.right' as any} size={14} color={darkGreen} />
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</>
		);
	}

	function renderMultiple(list: any[]) {
		const CARD_COLORS = darkGreen

		return (
			<>

				<View style={styles.activitiesHeader}>
					<ThemedText type="defaultSemiBold">Mes coopératives</ThemedText>
					<TouchableOpacity>
						<ThemedText style={[styles.linkText, { color: darkGreen }]}>Voir tout</ThemedText>
					</TouchableOpacity>
				</View>

				<View style={{ gap: 12, marginTop: 8 }}>
					{list.map((c, i) => {
						const percent = Math.round((c.collected / c.objective) * 100);
						const bg = CARD_COLORS ;
						return (
							<TouchableOpacity
								key={c.id}
								activeOpacity={0.92}
								style={[styles.multiCard, { backgroundColor: bg }]}
								onPress={() => router.push('/cooperative/dashboard')}
							>
								<View style={styles.singleCardHeader}>
									<Avatar size={48} name={c.name} />
									<View style={{ flex: 1, marginLeft: 12 }}>
										<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
											<ThemedText style={styles.singleCardName}>{c.name}</ThemedText>
											<View style={styles.roleBadge}>
												<ThemedText style={styles.roleBadgeText}>{c.role}</ThemedText>
											</View>
										</View>
										<ThemedText style={styles.singleCardObjectif}>{`Objectif : ${c.objective.toLocaleString()} FCFA`}</ThemedText>
									</View>
									<IconSymbol name={'chevron.right' as any} size={20} color="#fff" />
								</View>

								<ThemedText style={styles.singleCardAmount}>
									{`${c.collected.toLocaleString()} `}
									<ThemedText style={styles.singleCardAmountSub}>{`/ ${c.objective.toLocaleString()} FCFA`}</ThemedText>
								</ThemedText>

								<View style={styles.progressWrap}>
									<View style={[styles.progressBar, { width: `${percent}%`, backgroundColor: accent }]} />
								</View>

								<View style={styles.progressFooter}>
									<ThemedText style={styles.progressFooterText}>{`${percent}% atteint`}</ThemedText>
									<ThemedText style={styles.progressFooterText}>{`Objectif en ${c.deadline}`}</ThemedText>
								</View>
							</TouchableOpacity>
						);
					})}
				</View>

				<View style={[styles.activitiesHeader, { marginTop: spacing.rLg }]}>
					<ThemedText type="defaultSemiBold">Activités récentes</ThemedText>
					<TouchableOpacity>
						<ThemedText style={[styles.linkText, { color: darkGreen }]}>Voir tout</ThemedText>
					</TouchableOpacity>
				</View>

				<View style={[styles.activityItemFlat, { borderColor: border }]}>
					<View style={[styles.activityIconWrap, { backgroundColor: '#FFF3E8' }]}>
						<IconSymbol name={'checkmark.square' as any} size={20} color="#F5813A" />
					</View>
					<View style={{ flex: 1, marginLeft: 12 }}>
						<View style={styles.activityItemHeader}>
							<ThemedText type="defaultSemiBold" style={{ flex: 1 }}>Vote en cours - Coopérative Soleil</ThemedText>
							<ThemedText style={styles.activityBadge}>2 jours restants</ThemedText>
						</View>
						<ThemedText type='text' style={styles.activitySubtext}>Vote sur l'achat d'équipements solaires</ThemedText>
					</View>
					<TouchableOpacity onPress={() => router.push('../cooperative/vote')} style={{ marginLeft: 8 }}>
						<IconSymbol name={'chevron.right' as any} size={18} color={darkGreen} />
					</TouchableOpacity>
				</View>

				<View style={[styles.activityItemFlat, { borderColor: border }]}>
					<View style={[styles.activityIconWrap, { backgroundColor: '#E8F5E9' }]}>
						<IconSymbol name={'arrow.up.circle.fill' } size={20} color={darkGreen} />
					</View>
					<View style={{ flex: 1, marginLeft: 12 }}>
						<View >
							<ThemedText type="defaultSemiBold" style={{ flex: 1 }}>Nouvelle contribution - Énergie Verte</ThemedText>
							<ThemedText type="defaultSemiBold">15 000 FCFA</ThemedText>
						</View>
						<ThemedText style={styles.activitySubtext}>19 Mai 2024 - 18:40</ThemedText>
					</View>
					<TouchableOpacity onPress={() => router.push('/cooperative/historique/2')} style={{ marginLeft: 8 }}>
						<IconSymbol name={'chevron.right' } size={18} color={darkGreen} />
					</TouchableOpacity>
				</View>
			</>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
				<View style={styles.headerRow}>
					<ThemedText type="title">Bonjour Alliance </ThemedText>
					<TouchableOpacity onPress={() => router.push('/compte/notifications')}>
						<IconSymbol name={'bell'} size={22} color={darkGreen} />
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
	scroll: { paddingHorizontal: 20, paddingBottom: 32 },

	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 24,
		marginBottom: 8,
	},


	emptyWrapper: {
		marginTop: 24,
	},
	emptyCard: {
		backgroundColor: '#F4FAF5',
		borderRadius: 16,
		paddingVertical: 40,
		paddingHorizontal: 24,
		alignItems: 'center',
	},
	emptyIconWrap: {
		marginBottom: 16,
	},
	emptyTitle: {
		textAlign: 'center',
		fontSize: 15,
		marginBottom: 8,
	},
	emptySubtitle: {
		textAlign: 'center',
		opacity: 0.65,
		fontSize: 13,
		lineHeight: 20,
		marginBottom: 24,
	},
	emptyButton: {
		width: '100%',
		borderRadius: 12,
	},


	singleCard: {
		marginTop: 10,
		padding: 18,
		borderRadius: 16,
	},
	singleCardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	singleCardName: {
		color: '#fff',
		fontWeight: '700',
		fontSize: 15,
	},
	singleCardObjectif: {
		color: '#fff',
		opacity: 0.9,
		fontSize: 12,
		marginTop: 2,
	},
	singleCardAmount: {
		color: '#fff',
		fontWeight: '700',
		fontSize: 26,
		marginTop: 14,
	},
	singleCardAmountSub: {
		color: '#fff',
		fontWeight: '400',
		fontSize: 15,
		opacity: 0.9,
	},
	roleBadge: {
		backgroundColor: '#fff',
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 20,
	},
	roleBadgeText: {
		fontSize: 11,
		fontWeight: '600',
		color: '#1B5E20',
	},

	progressWrap: {
		width: '100%',
		height: 8,
		backgroundColor: 'rgba(255,255,255,0.25)',
		borderRadius: 8,
		marginTop: 12,
		overflow: 'hidden',
	},
	progressBar: {
		height: '100%',
		borderRadius: 8,
	},
	progressFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 8,
	},
	progressFooterText: {
		color: '#fff',
		fontSize: 12,
		opacity: 0.9,
	},

	sectionTitle: {
		marginTop: 20,
		marginBottom: 4,
	},
	activitiesHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 20,
		marginBottom: 4,
	},
	linkText: {
		fontSize: 13,
		fontWeight: '600',
	},

	/* Carte activité avec détail (state 2) */
	activityItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		backgroundColor: '#fff',
		borderWidth: 1,
		borderRadius: 14,
		padding: 14,
		marginTop: 10,
	},
	/* Ligne activité compacte (state 3) */
	activityItemFlat: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderWidth: 1,
		borderRadius: 14,
		padding: 14,
		marginTop: 10,
	},
	activityIconWrap: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	activityItemHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: 8,
	},
	activityBadge: {
		fontSize: 11,
		color: '#E65100',
		fontWeight: '500',
	},
	activitySubtext: {
		fontSize: 12,
		opacity: 0.6,
		marginTop: 2,
	},

	multiCard: {
		padding: 18,
		borderRadius: 16,
	},
});