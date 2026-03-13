import { Text, TextBold } from "@/components";
import { useGiftCardContext } from "@/contexts/GiftCardContext";
import { useUserContext } from "@/contexts/UserContext";
import { queryKeys } from "@/lib/api/queryClient";
import { useUserApi } from "@/lib/api/useApi";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { isNullOrWhitespace } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CARD_THEMES } from "@/components/GiftCardVisual";

export default function ProfileScreen() {
	const { user } = useUserContext();
	const { giftCards } = useGiftCardContext();
	const userApi = useUserApi();
	const insets = useSafeAreaInsets();

	const { data: restaurants } = useQuery({
		queryKey: [queryKeys.users.restaurants],
		queryFn: async () => {
			const data = await userApi.restaurants(user.id);
			return data;
		},
		enabled: !!user && !isNullOrWhitespace(user?.id),
	});

	const initials = useMemo(() => {
		if (!user) return "";
		return `${(user.firstName?.[0] ?? "").toUpperCase()}${(user.lastName?.[0] ?? "").toUpperCase()}`;
	}, [user]);

	const stats = useMemo(() => {
		if (!restaurants) return { visited: 0, remaining: 0 };
		const visited = restaurants.filter((r) => r.checkIns >= 1).length;
		return {
			visited,
			remaining: restaurants.length - visited,
		};
	}, [restaurants]);

	const topRestaurants = useMemo(() => {
		if (!restaurants) return [];
		return [...restaurants]
			.filter((r) => r.checkIns >= 1)
			.sort((a, b) => b.checkIns - a.checkIns)
			.slice(0, 3);
	}, [restaurants]);

	const groupedGiftCards = useMemo(() => {
		const allCards = giftCards ?? [];
		const groups: Record<string, { restaurantId: string; restaurantName: string; cards: typeof allCards; total: number }> = {};
		allCards.forEach((gc) => {
			if (!groups[gc.restaurantId]) {
				const restaurant = restaurants?.find((r) => r.id === gc.restaurantId);
				groups[gc.restaurantId] = { restaurantId: gc.restaurantId, restaurantName: restaurant?.name ?? "Restaurant", cards: [], total: 0 };
			}
			groups[gc.restaurantId].cards.push(gc);
			groups[gc.restaurantId].total += gc.amount ?? 0;
		});
		return Object.values(groups).sort((a, b) => b.cards.length - a.cards.length);
	}, [giftCards, restaurants]);

	if (!user) return null;

	return (
		<View style={styles.root}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: verticalScale(120) }}
			>
				{/* Red Header */}
				<View style={[styles.redHeader, { paddingTop: insets.top + verticalScale(16) }]}>
					{/* Settings gear */}
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={() => router.push("/settings")}
						hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
						style={{
							position: "absolute",
							top: insets.top + verticalScale(16),
							right: horizontalScale(16),
							width: moderateScale(40),
							height: moderateScale(40),
							borderRadius: moderateScale(20),
							backgroundColor: "rgba(255,255,255,0.2)",
							alignItems: "center",
							justifyContent: "center",
							zIndex: 10,
						}}
					>
						<Ionicons name="settings-outline" size={moderateScale(22)} color="#FFFFFF" />
					</TouchableOpacity>

					{/* Avatar */}
					<View style={styles.avatarCircle}>
						<TextBold style={styles.avatarText}>{initials}</TextBold>
					</View>

					{/* Name */}
					<TextBold style={styles.name}>
						{user.firstName} {user.lastName}
					</TextBold>
				</View>

				{/* Content */}
				<View style={styles.content}>
					{/* Info Card */}
					<View style={styles.card}>
						{user.email ? (
							<View style={styles.infoRow}>
								<Ionicons name="mail-outline" size={moderateScale(18)} color="#b42406" />
								<Text style={styles.infoText}>{user.email}</Text>
							</View>
						) : null}

						{user.phoneNumber ? (
							<View style={[styles.infoRow, styles.infoRowBorder]}>
								<Ionicons name="call-outline" size={moderateScale(18)} color="#b42406" />
								<Text style={styles.infoText}>{user.phoneNumber}</Text>
							</View>
						) : null}

						{user.birthDate ? (
							<View style={[styles.infoRow, styles.infoRowBorder]}>
								<Ionicons name="calendar-outline" size={moderateScale(18)} color="#b42406" />
								<Text style={styles.infoText}>
									{new Date(user.birthDate).toLocaleDateString("en-US", {
										month: "long",
										day: "numeric",
										year: "numeric",
									})}
								</Text>
							</View>
						) : null}
					</View>

					{/* Stats */}
					<View style={styles.statsCard}>
						<View style={styles.statsInner}>
							<TextBold style={styles.statVisited}>
								{String(stats.visited).padStart(2, "0")}
							</TextBold>
							<View style={styles.statDivider} />
							<Text style={styles.statTotal}>
								{restaurants?.length ?? 0}
							</Text>
							<Text style={styles.statDescription}>
								Restaurants you have{"\n"}visited
							</Text>
						</View>
					</View>

					{/* Top Restaurants */}
					<View style={styles.card}>
						<TextBold style={[styles.sectionTitle, { marginBottom: verticalScale(12) }]}>Top Restaurants</TextBold>
						{topRestaurants.length > 0 ? (
							topRestaurants.map((r, i) => (
								<TouchableOpacity
									key={r.id}
									activeOpacity={0.7}
									onPress={() =>
										router.push({
											pathname: "/restaurants/[id]",
											params: { id: r.id, name: r.name },
										})
									}
									style={[
										styles.topItem,
										i < topRestaurants.length - 1 && styles.topItemBorder,
									]}
								>
									<View style={styles.topRank}>
										<TextBold style={styles.topRankText}>{i + 1}</TextBold>
									</View>
									<View style={{ flex: 1 }}>
										<TextBold style={styles.topName}>{r.name}</TextBold>
										<Text style={styles.topVisits}>
											{r.checkIns} {r.checkIns === 1 ? "visit" : "visits"}
										</Text>
									</View>
									<Ionicons name="chevron-forward" size={18} color="#CCC" />
								</TouchableOpacity>
							))
						) : (
							<View style={styles.emptyTop}>
								<Ionicons
									name="restaurant-outline"
									size={moderateScale(32)}
									color="#CCC"
								/>
								<Text style={styles.emptyTopText}>
									Visit your first restaurant!
								</Text>
							</View>
						)}
					</View>

					{/* Suggest a Restaurant Banner */}
					<TouchableOpacity
						activeOpacity={0.85}
						onPress={() => router.push("/suggest-restaurant")}
						style={styles.banner}
					>
						<View style={[styles.bannerIcon, { backgroundColor: "#EEF7F7" }]}>
							<Ionicons
								name="add-circle-outline"
								size={moderateScale(24)}
								color="#438989"
							/>
						</View>
						<View style={{ flex: 1, marginLeft: horizontalScale(14) }}>
							<TextBold style={styles.bannerTitle}>Suggest a Restaurant</TextBold>
							<Text style={styles.bannerSub}>
								Tell us which restaurants you'd like to see
							</Text>
						</View>
						<Ionicons name="chevron-forward" size={moderateScale(18)} color="#CCC" />
					</TouchableOpacity>

					{/* My Gift Cards Wallet */}
					<View
						style={styles.walletContainer}
					>
						<TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/gift-cards")} style={styles.walletHeader}>
							<TextBold style={styles.sectionTitle}>My Gift Cards</TextBold>
							<Ionicons name="chevron-forward" size={moderateScale(18)} color="#CCC" />
						</TouchableOpacity>

						{groupedGiftCards.length > 0 ? (
							groupedGiftCards.map((group, gi) => (
								<View key={gi} style={styles.walletGroup}>
									<View style={styles.walletGroupHeader}>
										<TextBold style={styles.walletRestaurantName}>
											{group.restaurantName}
										</TextBold>
										<Text style={styles.walletCardCount}>
											{group.cards.length} {group.cards.length === 1 ? "card" : "cards"} · ${group.total}
										</Text>
									</View>
									<View
										style={{
											height: verticalScale(140) + (group.cards.length - 1) * verticalScale(32),
											marginTop: verticalScale(8),
										}}
									>
										{group.cards.map((gc, ci) => {
											const theme = CARD_THEMES[ci % CARD_THEMES.length];
											return (
												<TouchableOpacity
													key={gc.id}
													activeOpacity={0.85}
													onPress={() => router.push({ pathname: "/gift-cards/card-detail", params: { giftCardId: gc.id, themeIndex: String(ci), groupIds: group.cards.map((g) => g.id).join(",") } })}
													style={{
														position: ci === 0 ? "relative" : "absolute",
														top: ci * verticalScale(32),
														left: 0,
														right: 0,
														zIndex: group.cards.length - ci,
														height: verticalScale(140),
														borderRadius: moderateScale(14),
														backgroundColor: theme.bg,
														overflow: "hidden",
														padding: moderateScale(14),
														justifyContent: "space-between",
														shadowColor: "#000",
														shadowOffset: { width: 0, height: 2 },
														shadowOpacity: 0.15,
														shadowRadius: 6,
														elevation: 4,
													}}
												>
													<View style={{ position: "absolute", top: -20, right: -15, width: 90, height: 90, borderRadius: 45, backgroundColor: theme.blob1, opacity: 0.2 }} />
													<View style={{ position: "absolute", bottom: -15, left: -10, width: 70, height: 70, borderRadius: 35, backgroundColor: theme.blob2, opacity: 0.2 }} />
													<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
														<Text style={{ color: "rgba(255,255,255,0.7)", fontSize: moderateScale(11), textTransform: "uppercase", letterSpacing: 0.5 }}>
															{group.restaurantName}
														</Text>
														<TextBold style={{ color: "#FFFFFF", fontSize: moderateScale(22) }}>
															${gc.amount}
														</TextBold>
													</View>
													<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
														<TextBold style={{ color: "#FFFFFF", fontSize: moderateScale(20) }}>
															Gift Card
														</TextBold>
														<Text style={{ color: "rgba(255,255,255,0.6)", fontSize: moderateScale(10) }}>
															{gc.code}
														</Text>
													</View>
												</TouchableOpacity>
											);
										})}
									</View>
								</View>
							))
						) : (
							<View style={styles.walletEmpty}>
								<Ionicons name="gift-outline" size={moderateScale(32)} color="#CCC" />
								<Text style={styles.walletEmptyText}>No gift cards yet</Text>
							</View>
						)}
					</View>

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

	/* Red Header */
	redHeader: {
		backgroundColor: "#b42406",
		alignItems: "center",
		paddingBottom: verticalScale(40),
		borderBottomLeftRadius: moderateScale(30),
		borderBottomRightRadius: moderateScale(30),
	},
	avatarCircle: {
		width: moderateScale(80),
		height: moderateScale(80),
		borderRadius: moderateScale(40),
		backgroundColor: "#FFFFFF",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: verticalScale(12),
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	avatarText: {
		fontSize: moderateScale(28),
		color: "#b42406",
	},
	name: {
		fontSize: moderateScale(24),
		color: "#FFFFFF",
	},

	/* Content */
	content: {
		paddingHorizontal: horizontalScale(16),
		marginTop: -verticalScale(10),
	},

	/* Cards */
	card: {
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(16),
		borderWidth: 1,
		borderColor: "#EDEDED",
		padding: moderateScale(16),
		marginTop: verticalScale(16),
	},

	/* Info */
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: verticalScale(14),
	},
	infoRowBorder: {
		borderTopWidth: 1,
		borderTopColor: "#F0F0F0",
	},
	infoText: {
		fontSize: moderateScale(15),
		color: "#1A1A1A",
		marginLeft: horizontalScale(12),
	},

	/* Stats */
	statsCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(16),
		borderWidth: 1,
		borderColor: "#EDEDED",
		paddingVertical: verticalScale(24),
		paddingHorizontal: horizontalScale(20),
		marginTop: verticalScale(16),
	},
	statsInner: {
		flexDirection: "row",
		alignItems: "center",
	},
	statVisited: {
		fontSize: moderateScale(36),
		color: "#1A1A1A",
	},
	statDivider: {
		width: 1.5,
		height: moderateScale(36),
		backgroundColor: "#1A1A1A",
		marginHorizontal: horizontalScale(14),
	},
	statTotal: {
		fontSize: moderateScale(36),
		color: "#CCC",
	},
	statDescription: {
		fontSize: moderateScale(16),
		color: "#1A1A1A",
		marginLeft: horizontalScale(16),
		lineHeight: moderateScale(22),
	},

	/* Top Restaurants */
	sectionTitle: {
		fontSize: moderateScale(17),
		color: "#1A1A1A",
	},
	topItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: verticalScale(12),
	},
	topItemBorder: {
		borderBottomWidth: 1,
		borderBottomColor: "#F0F0F0",
	},
	topRank: {
		width: moderateScale(30),
		height: moderateScale(30),
		borderRadius: moderateScale(15),
		backgroundColor: "#FBF6F5",
		alignItems: "center",
		justifyContent: "center",
		marginRight: horizontalScale(12),
	},
	topRankText: {
		fontSize: moderateScale(13),
		color: "#b42406",
	},
	topName: {
		fontSize: moderateScale(15),
		color: "#1A1A1A",
	},
	topVisits: {
		fontSize: moderateScale(12),
		color: "#AAA",
		marginTop: verticalScale(2),
	},
	emptyTop: {
		alignItems: "center",
		paddingVertical: verticalScale(20),
	},
	emptyTopText: {
		fontSize: moderateScale(13),
		color: "#AAA",
		marginTop: verticalScale(8),
	},

	/* Banners */
	banner: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#EDEDED",
		borderRadius: moderateScale(16),
		padding: moderateScale(16),
		marginTop: verticalScale(10),
	},
	bannerIcon: {
		width: moderateScale(48),
		height: moderateScale(48),
		borderRadius: moderateScale(24),
		alignItems: "center",
		justifyContent: "center",
	},
	bannerTitle: {
		fontSize: moderateScale(16),
		color: "#1A1A1A",
	},
	bannerSub: {
		fontSize: moderateScale(13),
		color: "#888",
		marginTop: verticalScale(2),
	},

	/* Gift Card Wallet */
	walletContainer: {
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(16),
		borderWidth: 1,
		borderColor: "#EDEDED",
		padding: moderateScale(16),
		marginTop: verticalScale(10),
	},
	walletHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: verticalScale(4),
	},
	walletGroup: {
		marginTop: verticalScale(12),
	},
	walletGroupHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	walletRestaurantName: {
		fontSize: moderateScale(14),
		color: "#1A1A1A",
	},
	walletCardCount: {
		fontSize: moderateScale(12),
		color: "#888",
	},
	walletEmpty: {
		alignItems: "center",
		paddingVertical: verticalScale(24),
	},
	walletEmptyText: {
		fontSize: moderateScale(13),
		color: "#AAA",
		marginTop: verticalScale(8),
	},
});
