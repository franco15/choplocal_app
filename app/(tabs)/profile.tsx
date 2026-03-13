import { Text, TextBold } from "@/components";
import HomeRestaurantCard from "@/components/HomeRestaurantCard";
import { useUserContext } from "@/contexts/UserContext";
import { queryClient, queryKeys } from "@/lib/api/queryClient";
import { useUserApi } from "@/lib/api/useApi";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { isNullOrWhitespace } from "@/lib/utils";
import { IRestaurant } from "@/lib/types/restaurant";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "choplocal-favorites";

export default function ProfileScreen() {
	const { user } = useUserContext();
	const userApi = useUserApi();
	const insets = useSafeAreaInsets();
	const [refreshing, setRefreshing] = useState(false);
	const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

	const { data: restaurants } = useQuery({
		queryKey: [queryKeys.users.restaurants],
		queryFn: async () => {
			const data = await userApi.restaurants(user.id);
			return data;
		},
		enabled: !!user && !isNullOrWhitespace(user?.id),
	});

	useFocusEffect(
		useCallback(() => {
			AsyncStorage.getItem(FAVORITES_KEY).then((val) => {
				if (val) setFavoriteIds(JSON.parse(val));
				else setFavoriteIds([]);
			});
		}, []),
	);

	const toggleFavorite = useCallback((id: string) => {
		setFavoriteIds((prev) => {
			const next = prev.includes(id)
				? prev.filter((fid) => fid !== id)
				: [...prev, id];
			AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
			return next;
		});
	}, []);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await queryClient.invalidateQueries({ queryKey: [queryKeys.users.restaurants] });
		setRefreshing(false);
	}, []);

	const initials = useMemo(() => {
		if (!user) return "";
		return `${(user.firstName?.[0] ?? "").toUpperCase()}${(user.lastName?.[0] ?? "").toUpperCase()}`;
	}, [user]);

	const stats = useMemo(() => {
		if (!restaurants) return { visited: 0, remaining: 0, total: 0 };
		const visited = restaurants.filter((r) => r.checkIns >= 1).length;
		return { visited, remaining: restaurants.length - visited, total: restaurants.length };
	}, [restaurants]);

	const topRestaurants = useMemo(() => {
		if (!restaurants) return [];
		return [...restaurants]
			.filter((r) => r.checkIns >= 1)
			.sort((a, b) => b.checkIns - a.checkIns)
			.slice(0, 3);
	}, [restaurants]);

	if (!user) return null;

	return (
		<View style={styles.root}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: verticalScale(120) }}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#b42406" progressViewOffset={100} />
				}
			>
				{/* ── Header ── */}
				<View style={[styles.header, { paddingTop: insets.top + verticalScale(8) }]}>
					<TextBold style={styles.screenTitle}>Profile</TextBold>
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={() => router.push("/settings")}
						hitSlop={12}
						style={styles.settingsBtn}
					>
						<Ionicons name="settings-outline" size={moderateScale(22)} color="#1A1A1A" />
					</TouchableOpacity>
				</View>

				{/* ── Profile Card ── */}
				<View style={styles.profileCard}>
					{/* Avatar */}
					<View style={styles.avatarCircle}>
						<TextBold style={styles.avatarText}>{initials}</TextBold>
					</View>

					<TextBold style={styles.name}>
						{user.firstName} {user.lastName}
					</TextBold>

					{user.email ? (
						<Text style={styles.email}>{user.email}</Text>
					) : null}

					{/* Info pills */}
					<View style={styles.pillsRow}>
						{user.phoneNumber ? (
							<View style={styles.pill}>
								<Ionicons name="call-outline" size={moderateScale(13)} color="#888" />
								<Text style={styles.pillText}>{user.phoneNumber}</Text>
							</View>
						) : null}
						{user.birthDate ? (
							<View style={styles.pill}>
								<Ionicons name="calendar-outline" size={moderateScale(13)} color="#888" />
								<Text style={styles.pillText}>
									{new Date(user.birthDate).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
									})}
								</Text>
							</View>
						) : null}
					</View>

					</View>

				{/* ── Stats ── */}
				<View style={styles.statsRow}>
					<View style={styles.statItem}>
						<TextBold style={styles.statNumber}>{stats.visited}</TextBold>
						<Text style={styles.statLabel}>Visited</Text>
					</View>

					<View style={styles.statDivider} />

					<View style={styles.statItem}>
						<TextBold style={styles.statNumber}>{stats.remaining}</TextBold>
						<Text style={styles.statLabel}>To Explore</Text>
					</View>

					<View style={styles.statDivider} />

					<View style={styles.statItem}>
						<TextBold style={styles.statNumber}>{stats.total}</TextBold>
						<Text style={styles.statLabel}>Total</Text>
					</View>
				</View>

				{/* ── Suggest a Restaurant ── */}
				<TouchableOpacity
					activeOpacity={0.85}
					onPress={() => router.push("/suggest-restaurant")}
					style={styles.suggestBtn}
				>
					<Ionicons name="add-circle-outline" size={moderateScale(22)} color="#b42406" />
					<View style={{ flex: 1, marginLeft: horizontalScale(12) }}>
						<TextBold style={styles.suggestTitle}>Know a great spot?</TextBold>
						<Text style={styles.suggestSub}>Suggest a restaurant</Text>
					</View>
					<View style={styles.suggestArrow}>
						<Ionicons name="arrow-forward" size={moderateScale(16)} color="#b42406" />
					</View>
				</TouchableOpacity>

				{/* ── Top Spots (horizontal carousel) ── */}
				<View style={styles.topSection}>
					<TextBold style={styles.topTitle}>Your Top Spots</TextBold>

					{topRestaurants.length > 0 ? (
						<FlatList
							data={topRestaurants}
							horizontal
							showsHorizontalScrollIndicator={false}
							keyExtractor={(item) => `top_${item.id}`}
							contentContainerStyle={styles.carouselContent}
							renderItem={({ item }: { item: IRestaurant }) => (
								<HomeRestaurantCard
									restaurant={item}
									isFavorited={favoriteIds.includes(item.id)}
									onToggleFavorite={toggleFavorite}
								/>
							)}
						/>
					) : (
						<View style={styles.emptyTop}>
							<Ionicons name="restaurant-outline" size={moderateScale(32)} color="#DDD" />
							<Text style={styles.emptyTopText}>Visit your first restaurant!</Text>
						</View>
					)}
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},

	/* ── Header ── */
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: horizontalScale(20),
		paddingBottom: verticalScale(8),
	},
	settingsBtn: {
		padding: moderateScale(8),
	},
	screenTitle: {
		fontSize: moderateScale(30),
		color: "#1A1A1A",
	},

	/* ── Profile Card ── */
	profileCard: {
		alignItems: "center",
		marginTop: verticalScale(16),
		marginHorizontal: horizontalScale(20),
		paddingVertical: verticalScale(28),
		paddingHorizontal: horizontalScale(20),
		backgroundColor: "#FAFAFA",
		borderRadius: moderateScale(24),
	},
	avatarCircle: {
		width: moderateScale(80),
		height: moderateScale(80),
		borderRadius: moderateScale(40),
		backgroundColor: "#FFFFFF",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: verticalScale(14),
		borderWidth: 2,
		borderColor: "#F0F0F0",
	},
	avatarText: {
		fontSize: moderateScale(28),
		color: "#b42406",
	},
	name: {
		fontSize: moderateScale(20),
		color: "#1A1A1A",
	},
	email: {
		fontSize: moderateScale(13),
		color: "#999",
		marginTop: verticalScale(4),
	},
	pillsRow: {
		flexDirection: "row",
		marginTop: verticalScale(14),
		gap: horizontalScale(10),
	},
	pill: {
		flexDirection: "row",
		alignItems: "center",
		gap: horizontalScale(5),
		paddingVertical: verticalScale(5),
		paddingHorizontal: horizontalScale(10),
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(20),
	},
	pillText: {
		fontSize: moderateScale(12),
		color: "#888",
	},
	/* ── Stats ── */
	statsRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: verticalScale(28),
		marginHorizontal: horizontalScale(20),
		paddingVertical: verticalScale(6),
	},
	statItem: {
		flex: 1,
		alignItems: "center",
	},
	statNumber: {
		fontSize: moderateScale(34),
		color: "#1A1A1A",
		lineHeight: moderateScale(40),
	},
	statLabel: {
		fontSize: moderateScale(11),
		color: "#BBB",
		marginTop: verticalScale(2),
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	statDivider: {
		width: 1,
		height: moderateScale(32),
		backgroundColor: "#EDEDED",
	},

	/* ── Suggest ── */
	suggestBtn: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(180, 36, 6, 0.08)",
		borderWidth: 1,
		borderColor: "#b42406",
		borderRadius: moderateScale(18),
		paddingVertical: verticalScale(18),
		paddingHorizontal: horizontalScale(20),
		marginTop: verticalScale(28),
		marginHorizontal: horizontalScale(20),
	},
	suggestTitle: {
		fontSize: moderateScale(16),
		color: "#b42406",
	},
	suggestSub: {
		fontSize: moderateScale(12),
		color: "rgba(180, 36, 6, 0.5)",
		marginTop: verticalScale(2),
	},
	suggestArrow: {
		width: moderateScale(34),
		height: moderateScale(34),
		borderRadius: moderateScale(17),
		backgroundColor: "rgba(180, 36, 6, 0.1)",
		alignItems: "center",
		justifyContent: "center",
		marginLeft: horizontalScale(10),
	},

	/* ── Top Spots ── */
	topSection: {
		marginTop: verticalScale(28),
	},
	topTitle: {
		fontSize: moderateScale(17),
		color: "#1A1A1A",
		marginBottom: verticalScale(14),
		paddingHorizontal: horizontalScale(20),
	},
	carouselContent: {
		paddingHorizontal: horizontalScale(20),
		gap: horizontalScale(12),
	},
	emptyTop: {
		alignItems: "center",
		paddingVertical: verticalScale(32),
	},
	emptyTopText: {
		fontSize: moderateScale(13),
		color: "#BBB",
		marginTop: verticalScale(8),
	},
});
