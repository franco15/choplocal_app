import { CARD_THEMES, GiftCardVisual, Text, TextBold } from "@/components";
import { useGiftCardContext } from "@/contexts/GiftCardContext";
import { useUserContext } from "@/contexts/UserContext";
import { queryClient, queryKeys } from "@/lib/api/queryClient";
import { useRestaurantApi } from "@/lib/api/useApi";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";

import { ERestaurantStatus, IRestaurant } from "@/lib/types/restaurant";
import { isNullOrWhitespace } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import {
	Link,
	useFocusEffect,
	useLocalSearchParams,
	useRouter,
} from "expo-router";
import { useCallback, useState } from "react";
import {
	Alert,
	Platform,
	RefreshControl,
	ScrollView,
	Share,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RestaurantSkeleton from "../skeletons/restaurant";

export default function Restaurant() {
	const { id, name: paramName } = useLocalSearchParams<{
		id: string;
		name?: string;
	}>();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { user } = useUserContext();
	const { getGiftCardsByRestaurant } = useGiftCardContext();
	const restaurantApi = useRestaurantApi();
	const [refreshing, setRefreshing] = useState(false);

	const { data: rawRestaurant, isPending } = useQuery({
		queryKey: [queryKeys.restaurants.byId(id as string)],
		queryFn: () => restaurantApi.byId(id as string, user.id),
		enabled: !!id && !!user,
	});

	const restaurant = rawRestaurant;

	const { data: transactions } = useQuery({
		queryKey: [queryKeys.restaurants.transactions(id as string)],
		queryFn: () => restaurantApi.transactions(id as string, user.id),
		enabled: !!id && !!user,
	});

	// Refresh gift cards every time screen gains focus (e.g. after notification)
	useFocusEffect(
		useCallback(() => {
			if (user?.id) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.giftCards.byUser(user.id),
				});
			}
		}, [user?.id]),
	);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await Promise.all([
			queryClient.invalidateQueries({
				queryKey: [queryKeys.restaurants.byId(id as string)],
			}),
			queryClient.invalidateQueries({
				queryKey: [queryKeys.restaurants.transactions(id as string)],
			}),
			queryClient.invalidateQueries({
				queryKey: queryKeys.giftCards.byUser(user?.id ?? ""),
			}),
		]);
		setRefreshing(false);
	}, [id, user?.id]);

	const recentTransactions = [...(transactions ?? [])]
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.slice(0, 2);
	const restaurantGiftCards = getGiftCardsByRestaurant?.(id as string) ?? [];
	const displayName = rawRestaurant?.name || paramName || "";

	const onRecommend = useCallback(async () => {
		if (!restaurant || (restaurant.checkIns ?? 0) < 1) {
			Alert.alert(
				"You haven't visited yet!",
				"Visit this restaurant at least once before recommending it to your friends.",
				[{ text: "Got it" }],
			);
			return;
		}
		// referralCode might not come from the byId endpoint,
		// so fallback to the cached user restaurants list
		let code = restaurant.referralCode;
		if (!code) {
			const cachedList = queryClient.getQueryData<IRestaurant[]>([
				queryKeys.users.restaurants,
			]);
			const cached = cachedList?.find((r) => r.id === id);
			code = cached?.referralCode ?? "";
		}
		if (isNullOrWhitespace(code)) return;
		try {
			const url =
				Platform.OS === "ios"
					? "https://apps.apple.com/co/app/chop-local/id6754047000"
					: "https://play.google.com/store/apps/details?id=com.choplocal";
			await Share.share({
				message: `Check out ${displayName} on Chop Local! Use my recommendation code: ${code}.\nDownload the app now at ${url}`,
			});
		} catch {
			// User cancelled share
		}
	}, [restaurant, displayName, id]);

	if (isPending) return <RestaurantSkeleton />;

	const isRecommended = restaurant?.status === ERestaurantStatus.Recommended;
	const hasVisits = (restaurant?.checkIns ?? 0) > 0;
	const totalBalance = restaurant?.balance ?? 0;

	return (
		<View style={styles.root}>
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
					paddingBottom: insets.bottom + verticalScale(100),
				}}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor="#b42406"
						progressViewOffset={100}
					/>
				}
			>
				<View style={[styles.cardList, { paddingTop: verticalScale(8) }]}>
					{/* ═══════════════════════════════════════════
					    CARD 1 — Restaurant Info
					    ═══════════════════════════════════════════ */}
					<View style={styles.card}>
						<View style={styles.cardBody}>
							<TextBold style={styles.restaurantName}>{displayName}</TextBold>

							{isRecommended && (
								<View style={styles.recommendedTag}>
									<Ionicons name="star" size={12} color="#b42406" />
									<Text style={styles.recommendedText}>Recommended</Text>
								</View>
							)}

							{/* Stats row */}
							<View style={styles.infoStatsRow}>
								<View style={styles.infoStat}>
									<Text style={styles.infoStatLabel}>Balance</Text>
									<TextBold style={styles.infoStatValue}>
										${totalBalance.toFixed(2)}
									</TextBold>
								</View>
								<View style={styles.infoStatDivider} />
								<View style={styles.infoStat}>
									<Text style={styles.infoStatLabel}>Visits</Text>
									<TextBold style={styles.infoStatValue}>
										{restaurant?.checkIns ?? 0}
									</TextBold>
								</View>
							</View>
						</View>
					</View>

					{/* ═══════════════════════════════════════════
					    CARD 2 — Gift Cards Wallet
					    ═══════════════════════════════════════════ */}
					<View style={styles.card}>
						<View style={styles.cardBody}>
							<View style={styles.cardSectionHeader}>
								<View>
									<TextBold style={styles.cardSectionTitle}>
										My Gift Cards
									</TextBold>
									{restaurantGiftCards.length > 0 && (
										<Text style={styles.cardSectionMeta}>
											{restaurantGiftCards.length}{" "}
											{restaurantGiftCards.length === 1 ? "card" : "cards"} · $
											{restaurantGiftCards.reduce(
												(sum, gc) => sum + (gc.amount ?? 0),
												0,
											)}
										</Text>
									)}
								</View>
								{restaurantGiftCards.length > 3 && (
									<TouchableOpacity
										activeOpacity={0.7}
										onPress={() =>
											router.push({
												pathname: "/gift-cards/card-detail",
												params: {
													giftCardId: restaurantGiftCards[0].id,
													themeIndex: "0",
													groupIds: restaurantGiftCards
														.map((g) => g.id)
														.join(","),
												},
											})
										}
									>
										<Text style={styles.seeAllLink}>See all</Text>
									</TouchableOpacity>
								)}
							</View>

							{restaurantGiftCards.length > 0 ? (
								<View
									style={{
										height:
											verticalScale(210) +
											(restaurantGiftCards.slice(0, 3).length - 1) *
												verticalScale(38),
										marginTop: verticalScale(4),
									}}
								>
									{restaurantGiftCards.slice(0, 3).map((gc, ci) => {
										const theme = CARD_THEMES[ci % CARD_THEMES.length];
										const cardAmount = gc.amount ?? 0;
										return (
											<TouchableOpacity
												key={gc.id}
												activeOpacity={0.85}
												onPress={() =>
													router.push({
														pathname: "/gift-cards/card-detail",
														params: {
															giftCardId: gc.id,
															themeIndex: String(ci),
															groupIds: restaurantGiftCards
																.map((g) => g.id)
																.join(","),
														},
													})
												}
												style={{
													position: ci === 0 ? "relative" : "absolute",
													top: ci * verticalScale(38),
													left: 0,
													right: 0,
													zIndex: restaurantGiftCards.slice(0, 3).length - ci,
													height: verticalScale(200),
													borderRadius: moderateScale(16),
													overflow: "hidden",
													shadowColor: "#000",
													shadowOffset: { width: 0, height: 2 },
													shadowOpacity: 0.15,
													shadowRadius: 6,
													elevation: 4,
												}}
											>
												<GiftCardVisual
													restaurantName={displayName}
													amount={cardAmount}
													theme={theme}
													fill
												/>
											</TouchableOpacity>
										);
									})}
								</View>
							) : (
								<View style={styles.emptyCardContent}>
									<Ionicons
										name="gift-outline"
										size={moderateScale(32)}
										color="#D0D0D0"
									/>
									<Text style={styles.emptyCardText}>
										No gift cards yet — maybe someone will surprise you!
									</Text>
								</View>
							)}
						</View>
					</View>

					{/* ═══════════════════════════════════════════
					    CARD 3 — Recent Activity
					    ═══════════════════════════════════════════ */}
					<View style={styles.card}>
						<View style={styles.cardBody}>
							<View style={styles.cardSectionHeader}>
								<TextBold style={styles.cardSectionTitle}>
									Recent Activity
								</TextBold>
								{(transactions ?? []).length > 2 && (
									<Link
										href={{
											pathname: "/restaurants/transactions",
											params: { restaurantId: id },
										}}
									>
										<Text style={styles.seeAllLink}>See all</Text>
									</Link>
								)}
							</View>

							{hasVisits ? (
								recentTransactions.map((tx, i) => {
									const spent = (tx.cashback * 20).toFixed(2);
									return (
										<View
											key={i}
											style={[styles.txRow, i > 0 && styles.txRowBorder]}
										>
											<View style={styles.txIconCircle}>
												<Ionicons
													name="receipt-outline"
													size={moderateScale(16)}
													color="#888"
												/>
											</View>
											<View style={styles.txInfo}>
												<Text style={styles.txDate}>
													{new Date(tx.date).toLocaleDateString("en-US", {
														month: "short",
														day: "numeric",
														year: "numeric",
													})}
												</Text>
												<Text style={styles.txSpent}>${spent} spent</Text>
											</View>
											<TextBold style={styles.txCashback}>
												+${tx.cashback.toFixed(2)}
											</TextBold>
										</View>
									);
								})
							) : (
								<View style={styles.emptyCardContent}>
									<Ionicons
										name="time-outline"
										size={moderateScale(32)}
										color="#D0D0D0"
									/>
									<Text style={styles.emptyCardText}>
										Nothing here yet — your first visit will be legendary!
									</Text>
								</View>
							)}
						</View>
					</View>
				</View>
			</ScrollView>

			{/* ── Sticky Footer ── */}
			<View
				style={[
					styles.footer,
					{ paddingBottom: insets.bottom + verticalScale(12) },
				]}
			>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={onRecommend}
					style={styles.footerBtnOutline}
				>
					<TextBold style={styles.footerBtnOutlineText}>Recommend</TextBold>
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() =>
						router.push({
							pathname: "/gift-cards/choose-amount",
							params: {
								restaurantId: id as string,
								restaurantName: displayName,
							},
						})
					}
					style={styles.footerBtnFilled}
				>
					<TextBold style={styles.footerBtnFilledText}>Send Gift Card</TextBold>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: "#F2F2F7",
	},

	cardList: {
		paddingHorizontal: horizontalScale(16),
		gap: verticalScale(14),
	},

	/* ── Card base ── */
	card: {
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(22),
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 10,
		elevation: 3,
	},
	cardBody: {
		padding: moderateScale(20),
	},

	/* ── Card 1 — Restaurant info ── */
	restaurantName: {
		fontSize: moderateScale(24),
		color: "#1A1A1A",
		lineHeight: moderateScale(30),
	},
	recommendedTag: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "flex-start",
		backgroundColor: "rgba(180, 36, 6, 0.08)",
		paddingHorizontal: horizontalScale(10),
		paddingVertical: verticalScale(4),
		borderRadius: moderateScale(20),
		gap: horizontalScale(4),
		marginTop: verticalScale(10),
	},
	recommendedText: {
		fontSize: moderateScale(12),
		color: "#b42406",
	},

	/* Stats inside card 1 */
	infoStatsRow: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: verticalScale(20),
		paddingTop: verticalScale(18),
		borderTopWidth: 1,
		borderTopColor: "#F0F0F0",
	},
	infoStat: {
		flex: 1,
		alignItems: "center",
	},
	infoStatLabel: {
		fontSize: moderateScale(11),
		color: "#999",
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	infoStatValue: {
		fontSize: moderateScale(26),
		color: "#1A1A1A",
		marginTop: verticalScale(4),
	},
	infoStatDivider: {
		width: 1,
		height: moderateScale(36),
		backgroundColor: "#F0F0F0",
	},

	/* Empty card state */
	emptyCardContent: {
		alignItems: "center",
		paddingVertical: verticalScale(24),
		gap: verticalScale(10),
	},
	emptyCardText: {
		fontSize: moderateScale(13),
		color: "#BBB",
		textAlign: "center",
		lineHeight: moderateScale(19),
		paddingHorizontal: horizontalScale(12),
	},

	/* ── Card section headers (cards 2 & 3) ── */
	cardSectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: verticalScale(14),
	},
	cardSectionTitle: {
		fontSize: moderateScale(18),
		color: "#1A1A1A",
	},
	cardSectionMeta: {
		fontSize: moderateScale(12),
		color: "#999",
		marginTop: verticalScale(3),
	},
	seeAllLink: {
		fontSize: moderateScale(13),
		color: "#b42406",
	},

	/* ── Card 3 — Transactions ── */
	txRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: verticalScale(14),
	},
	txRowBorder: {
		borderTopWidth: 1,
		borderTopColor: "#F5F5F5",
	},
	txIconCircle: {
		width: moderateScale(38),
		height: moderateScale(38),
		borderRadius: moderateScale(19),
		backgroundColor: "#F5F5F5",
		alignItems: "center",
		justifyContent: "center",
		marginRight: horizontalScale(12),
	},
	txInfo: {
		flex: 1,
	},
	txDate: {
		fontSize: moderateScale(14),
		color: "#1A1A1A",
	},
	txSpent: {
		fontSize: moderateScale(12),
		color: "#999",
		marginTop: verticalScale(2),
	},
	txCashback: {
		fontSize: moderateScale(15),
		color: "#22C55E",
	},

	/* ── Footer ── */
	footer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		flexDirection: "row",
		paddingHorizontal: horizontalScale(20),
		paddingTop: verticalScale(12),
		backgroundColor: "#FFFFFF",
		borderTopWidth: 1,
		borderTopColor: "#F0F0F0",
		gap: horizontalScale(12),
	},
	footerBtnOutline: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		height: verticalScale(50),
		borderRadius: moderateScale(28),
		borderWidth: 1.5,
		borderColor: "#1A1A1A",
	},
	footerBtnOutlineText: {
		fontSize: moderateScale(14),
		color: "#1A1A1A",
	},
	footerBtnFilled: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		height: verticalScale(50),
		borderRadius: moderateScale(28),
		backgroundColor: "#1A1A1A",
	},
	footerBtnFilledText: {
		fontSize: moderateScale(14),
		color: "#FFFFFF",
	},
});
