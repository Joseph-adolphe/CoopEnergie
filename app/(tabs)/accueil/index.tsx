import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
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
	const cooperatives =  MOCK_ONE;

	const darkGreen = useThemeColor({}, 'darkGreen') as string;
	const accent = useThemeColor({}, 'accentGreen') as string;
	const cardBg = useThemeColor({}, 'white') as string;
	const border = useThemeColor({}, 'border') as string;

	function renderEmpty() {
		return (
			<View style={{ marginTop: 20 , flex: 1 , justifyContent: 'center' , alignItems: 'center' , width: '100%' }}>
				<Card style={styles.emptyCard}>
					<View style={styles.emptyInner}>
						<Avatar size={72} name={''} />
						<ThemedText type="defaultSemiBold" style={{ marginTop: 12 , textAlign: 'center'}}>
							Vous n'êtes membre d'aucune coopérative pour le moment.
						</ThemedText>
						<ThemedText style={{ marginTop: 8, textAlign: 'center' }}>
							Rejoignez ou créez une coopérative pour participer à des projets, contribuer et prendre des décisions ensemble.
						</ThemedText>

						<Button title="Créer  une coopérative" variant="primary" onPress={() => router.push('../cooperative/creation/01_creation')} style={{ marginTop: 18 }} />
					</View>
				</Card>
			</View>
		);
	}

	function ProgressCard({ coop }: { coop: any }) {
		const percent = Math.round((coop.collected / coop.objective) * 100);
		return (
			<View style={[styles.progressCard, { backgroundColor: darkGreen }] }>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
					<View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
						<Avatar size={48} name={coop.name} />
						<View>
							<ThemedText style={{ color: '#fff', fontWeight: '700' }}>{coop.name}</ThemedText>
							<ThemedText style={{ color: '#fff', opacity: 0.9 }}>{`Objectif : ${coop.objective.toLocaleString()} FCFA`}</ThemedText>
						</View>
					</View>
					{/* <View style={styles.roleBadge}>
						<ThemedText style={{ color: darkGreen }}>{coop.role}</ThemedText>
					</View> */}
				</View>

				<View style={{ marginTop: 12 }}>
					<ThemedText style={{ color: '#fff', fontSize: 28, fontWeight: '700' }}>{`${coop.collected.toLocaleString()} / ${coop.objective.toLocaleString()} FCFA`}</ThemedText>
				</View>

				<View style={styles.progressWrap}>
					<View style={[styles.progressBar, { width: `${percent}%`, backgroundColor: accent }]} />
				</View>

				<View style={styles.progressFooter}>
					<ThemedText style={{ color: '#fff', opacity: 0.95 }}>{`${percent}% atteint`}</ThemedText>
					<ThemedText style={{ color: '#fff', opacity: 0.95 }}>{`Objectif en ${coop.deadline}`}</ThemedText>
				</View>
			</View>
		);
	}

	function renderSingle(coop: any) {
		const contributions = [
			{ id: '1', name: 'Marie', date: '20 Mai 2024 - 10:30', amount: '10 000 FCFA' },
			{ id: '2', name: 'Paul', date: '20 Mai 2024 - 09:15', amount: '5 000 FCFA' },
			{ id: '3', name: 'Amina', date: '19 Mai 2024 - 18:40', amount: '20 000 FCFA' },
		];

		return (
			<>
				<ProgressCard coop={coop} />

				<View style={[styles.activityCard, { borderColor: border , marginBottom : 12}]}> 
					<View style={{ flex: 1 }}>
						<ThemedText type="defaultSemiBold">Vote en cours</ThemedText>
						<ThemedText type="text">Vote sur l'achat d'équipements solaires</ThemedText>
					</View>
					<TouchableOpacity onPress={() => router.push('../cooperative/vote') }>
						<ThemedText style={{ color: darkGreen }}>Voir le vote</ThemedText>
					</TouchableOpacity>
				</View>

				
					<View style={styles.rowHeader}>
						<ThemedText type="defaultSemiBold">Contributions récentes</ThemedText>
						<TouchableOpacity onPress={() => router.push('/cooperative/historique/1')}>
							<ThemedText style={{ color: darkGreen }}>Voir tout</ThemedText>
						</TouchableOpacity>
					</View>
                   <View style={{ marginTop: 8 }}>
					{contributions.map((item) => {
					return (
                         <View style={styles.row} key={item.id}>
							<Avatar name={item.name} size={44} />
							<View style={{ flex: 1, marginLeft: 12 }}>
								<ThemedText type="defaultSemiBold">{item.name}</ThemedText>
								<ThemedText type="text">{item.date}</ThemedText>
							</View>
							<ThemedText type="defaultSemiBold">{item.amount}</ThemedText>
						</View>
						)
					})}
				   </View>
			</>
		);
	}

	function renderMultiple(list: any[]) {
		return (
			<>
				<View style={{ marginTop: 12 }}>
					<ThemedText type="defaultSemiBold">Mes coopératives</ThemedText>
				</View>

				<View style={{ marginTop: 8, gap: 12 }}>
					{list.map((c, i) => (
						<View key={c.id} style={[styles.multiCard, { backgroundColor: i === 0 ? darkGreen : cardBg, borderColor: border }] }>
							<View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
								<Avatar size={44} name={c.name} />
								<View style={{ flex: 1 }}>
									<ThemedText style={i === 0 ? { color: '#fff', fontWeight: '700' } : undefined}>{c.name}</ThemedText>
									<ThemedText style={i === 0 ? { color: '#fff', opacity: 0.95 } : undefined}>{`Objectif : ${c.objective.toLocaleString()} FCFA`}</ThemedText>
								</View>
								<TouchableOpacity onPress={() => router.push('/cooperative/dashboard') }>
									<IconSymbol name={'chevron.right' as any} size={20} color={i === 0 ? '#fff' : darkGreen} />
								</TouchableOpacity>
							</View>

							<View style={{ marginTop: 12 }}>
								<View style={styles.progressWrap}>
									<View style={[styles.progressBar, { width: `${Math.round((c.collected/c.objective)*100)}%`, backgroundColor: accent }]} />
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
								<ThemedText type="defaultSemiBold">Vote en cours - Coopérative Soleil</ThemedText>
								<ThemedText type="text">Vote sur l'achat d'équipements solaires</ThemedText>
							</View>
							<ThemedText>2 jours restants</ThemedText>
						</View>
					</Card>
				</View>
			</>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<ScrollView contentContainerStyle={{ padding: 20 , flex: 1 }} showsVerticalScrollIndicator={false}>
				<View style={styles.headerRow}>
					<ThemedText type="title">Bonjour Alliance </ThemedText>
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
	container: { flex: 1  },
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

