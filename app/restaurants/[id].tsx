import { Text, TextBold } from "@/components";
import GiftCardVisual, { CARD_THEMES } from "@/components/GiftCardVisual";
import { useGiftCardContext } from "@/contexts/GiftCardContext";
import { useRedeemCodeContext } from "@/contexts/RedeemCodeContext";
import { useUserContext } from "@/contexts/UserContext";
import { queryKeys } from "@/lib/api/queryClient";
import { useRestaurantApi } from "@/lib/api/useApi";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { EGiftCardStatus } from "@/lib/types/giftcard";
import { ERestaurantStatus } from "@/lib/types/restaurant";
import { isImage } from "@/lib/utils";
import { EmptyPlates } from "@/constants/svgs";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
	ActivityIndicator,
	Alert,
	Image,
	ScrollView,
	Share,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RestaurantSkeleton from "../skeletons/restaurant";

export default function Restaurant() {
	const { id, name: paramName } = useLocalSearchParams<{ id: string; name?: string }>();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { user } = useUserContext();
	const { getGiftCardsByRestaurant } = useGiftCardContext();
	const { getRecommendationReward } = useRedeemCodeContext();
	const restaurantApi = useRestaurantApi();
	const [imageLoaded, setImageLoaded] = useState(false);

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

	const recentTransactions = (transactions ?? []).slice(0, 2);
	const restaurantGiftCards = (getGiftCardsByRestaurant?.(id as string) ?? []).filter(
		(gc) => gc.status === EGiftCardStatus.Available,
	);
	const displayName = rawRestaurant?.name || paramName || "";

	const onRecommend = async () => {
		// Must have at least 1 visit to recommend
		if (!restaurant || (restaurant.checkIns ?? 0) < 1) {
			Alert.alert(
				"You haven't visited yet!",
				"Visit this restaurant at least once before recommending it to your friends.",
				[{ text: "Got it" }],
			);
			return;
		}

		const code = restaurant.referralCode;
		if (!code) return;

		try {
			await Share.share({
				message: `Come visit ${displayName} on Chop Local! Use my code: ${code}`,
			});
		} catch {
			// User cancelled share
		}
	};

	if (isPending) return <RestaurantSkeleton />;

	const hasImageUrl = restaurant?.image && isImage(restaurant.image);
	const showHero = hasImageUrl && imageLoaded;
	const isRecommended = restaurant?.status === ERestaurantStatus.Recommended;
	const hasVisits = (restaurant?.checkIns ?? 0) > 0;
	const recommendationReward = getRecommendationReward?.(id as string) ?? 0;
	const totalBalance = (restaurant?.balance ?? 0) + recommendationReward;
	const hasBalance = totalBalance > 0;

	return (
	<>
		<View style={styles.root}>
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
					paddingBottom: insets.bottom + verticalScale(90),
				}}
				showsVerticalScrollIndicator={false}
			>
				{/* ── Hero: glass blur + image (only if image actually loads) ── */}
				{showHero && (
					<View style={styles.heroContainer}>
						<Image
							source={{ uri: restaurant.image }}
							style={styles.heroBg}
							blurRadius={25}
							resizeMode="cover"
						/>
						<BlurView
							intensity={60}
							tint="light"
							style={styles.heroBg}
						/>
						<View style={styles.heroImageWrapper}>
							<Image
								source={{ uri: restaurant.image }}
								style={styles.heroImage}
								resizeMode="cover"
							/>
						</View>
					</View>
				)}

				{/* Hidden image to test if it loads */}
				{hasImageUrl && !imageLoaded && (
					<Image
						source={{ uri: restaurant.image }}
						style={{ width: 0, height: 0 }}
						onLoad={() => setImageLoaded(true)}
						onError={() => setImageLoaded(false)}
					/>
				)}

				{/* ── Content ── */}
				<View style={[styles.content, !showHero && { paddingTop: insets.top + verticalScale(12) }]}>
					{/* Name */}
					<TextBold style={styles.name}>
						{displayName}
					</TextBold>

					{/* Recommended tag */}
					{isRecommended && (
						<View style={styles.recommendedTag}>
							<Ionicons
								name="star"
								size={12}
								color="#856404"
							/>
							<Text style={styles.recommendedText}>
								Recommended
							</Text>
						</View>
					)}

					{/* ── Stats row (full: balance + visits) ── */}
					{hasVisits && (
						<>
							<View style={styles.statsRow}>
								<View style={styles.statCard}>
									<Text style={styles.statLabel}>Balance</Text>
									<TextBold style={styles.statNumber}>
										${totalBalance.toFixed(2)}
									</TextBold>
								</View>
								<View style={styles.statCard}>
									<Text style={styles.statLabel}>Visits</Text>
									<TextBold style={styles.statNumber}>
										{restaurant?.checkIns ?? 0}
									</TextBold>
								</View>
							</View>
						</>
					)}

					{/* ── Balance only (recommended, no visits yet) ── */}
					{!hasVisits && hasBalance && (
						<View style={styles.statsRow}>
							<View style={styles.statCard}>
								<Text style={styles.statLabel}>Balance</Text>
								<TextBold style={styles.statNumber}>
									${totalBalance.toFixed(2)}
								</TextBold>
							</View>
						</View>
					)}

								{/* ── No visits placeholder ── */}
				{!hasVisits && restaurantGiftCards.length === 0 && (
					<View style={{ alignItems: "center", paddingVertical: verticalScale(24) }}>
						<EmptyPlates
							width={horizontalScale(140)}
							height={verticalScale(110)}
						/>
						<TextBold style={styles.emptyTitle}>
							You haven't visited yet
						</TextBold>
						<Text style={styles.emptySubtitle}>
							Show your QR code at {displayName} to start earning cashback on every visit.
						</Text>
						<Link href="/qr" asChild>
							<TouchableOpacity
								activeOpacity={0.8}
								style={styles.emptyQrButton}
							>
								<TextBold style={styles.emptyQrText}>
									Show QR Code
								</TextBold>
							</TouchableOpacity>
						</Link>
					</View>
				)}

				{/* ── Gift Cards Wallet ── */}
				{restaurantGiftCards.length > 0 && (
					<View style={styles.section}>
						<View style={styles.sectionHeader}>
							<TextBold style={styles.sectionTitle}>
								My Gift Cards
							</TextBold>
							<Text style={styles.sectionCount}>
								{restaurantGiftCards.length}{" "}
								{restaurantGiftCards.length === 1
									? "card"
									: "cards"} · ${restaurantGiftCards.reduce((sum, gc) => sum + gc.value, 0)}
							</Text>
						</View>
						<View
							style={{
								height: verticalScale(200) + (restaurantGiftCards.length - 1) * verticalScale(42),
							}}
						>
							{restaurantGiftCards.map((gc, ci) => {
								const theme = CARD_THEMES[ci % CARD_THEMES.length];
								return (
									<TouchableOpacity
										key={gc.id}
										activeOpacity={0.85}
										onPress={() => router.push({
											pathname: "/gift-cards/card-detail",
											params: {
												giftCardId: gc.id,
												themeIndex: String(ci),
												groupIds: restaurantGiftCards.map((g) => g.id).join(","),
											},
										})}
										style={{
											position: ci === 0 ? "relative" : "absolute",
											top: ci * verticalScale(42),
											left: 0,
											right: 0,
											zIndex: restaurantGiftCards.length - ci,
											height: verticalScale(170),
											borderRadius: moderateScale(16),
											backgroundColor: theme.bg,
											overflow: "hidden",
											padding: moderateScale(16),
											justifyContent: "space-between",
											shadowColor: "#000",
											shadowOffset: { width: 0, height: 2 },
											shadowOpacity: 0.15,
											shadowRadius: 6,
											elevation: 4,
										}}
									>
										<View style={{ position: "absolute", top: -20, right: -15, width: 100, height: 100, borderRadius: 50, backgroundColor: theme.blob1, opacity: 0.2 }} />
										<View style={{ position: "absolute", bottom: -15, left: -10, width: 80, height: 80, borderRadius: 40, backgroundColor: theme.blob2, opacity: 0.2 }} />
										<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
											<View>
												<Text style={{ color: "rgba(255,255,255,0.7)", fontSize: moderateScale(11), textTransform: "uppercase", letterSpacing: 0.5 }}>
													{gc.restaurantName}
												</Text>
												<Text style={{ color: "rgba(255,255,255,0.5)", fontSize: moderateScale(10), marginTop: verticalScale(2) }}>
													from {gc.senderName}
												</Text>
											</View>
											<TextBold style={{ color: "#FFFFFF", fontSize: moderateScale(24) }}>
												${gc.value}
											</TextBold>
										</View>
										<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
											<TextBold style={{ color: "#FFFFFF", fontSize: moderateScale(22) }}>
												Gift Card
											</TextBold>
											<Text style={{ color: "rgba(255,255,255,0.5)", fontSize: moderateScale(10) }}>
												Expires {new Date(gc.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
											</Text>
										</View>
									</TouchableOpacity>
								);
							})}
						</View>
					</View>
				)}



					{/* ── Recent Activity (only if visited) ── */}
					{hasVisits && (
						<View style={styles.section}>
							<View style={styles.sectionHeader}>
								<TextBold style={styles.sectionTitle}>
									Recent Activity
								</TextBold>
								{(transactions ?? []).length > 2 && (
									<Link
										href={{
											pathname:
												"/restaurants/transactions",
											params: { restaurantId: id },
										}}
									>
										<Text style={styles.seeAll}>
											See all
										</Text>
									</Link>
								)}
							</View>

							<View style={styles.activityCard}>
								{recentTransactions.map((tx, i) => {
									const spent = (
										tx.cashback * 20
									).toFixed(2);
									return (
										<View key={i}>
											{i > 0 && (
												<View
													style={styles.divider}
												/>
											)}
											<View
												style={styles.activityRow}
											>
												<View
													style={
														styles.activityDateCol
													}
												>
													<Text
														style={
															styles.activityDate
														}
													>
														{new Date(
															tx.date,
														).toLocaleDateString(
															"en-US",
															{
																month: "short",
																day: "numeric",
															},
														)}
													</Text>
												</View>
												<View
													style={
														styles.activitySpentCol
													}
												>
													<Text
														style={
															styles.activitySpent
														}
													>
														${spent}
													</Text>
													<Text
														style={
															styles.activitySpentLabel
														}
													>
														spent
													</Text>
												</View>
												<View
													style={
														styles.activityCashbackCol
													}
												>
													<TextBold
														style={
															styles.activityCashback
														}
													>
														+$
														{tx.cashback.toFixed(
															2,
														)}
													</TextBold>
													<Text
														style={
															styles.activityCashbackLabel
														}
													>
														cashback
													</Text>
												</View>
											</View>
										</View>
									);
								})}
							</View>
						</View>
					)}
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
					<TextBold style={styles.footerBtnOutlineText}>
						Recommend
					</TextBold>
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
					<TextBold style={styles.footerBtnFilledText}>
						Send Gift Card
					</TextBold>
				</TouchableOpacity>
			</View>
		</View>

	</>
	);
}

const HERO_HEIGHT = verticalScale(350);
const IMAGE_MARGIN = horizontalScale(20);

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},

	/* ── Hero with glass blur ── */
	heroContainer: {
		width: "100%",
		height: HERO_HEIGHT,
		overflow: "hidden",
	},
	heroBg: {
		...StyleSheet.absoluteFillObject,
	},
	heroImageWrapper: {
		position: "absolute",
		top: verticalScale(16),
		left: IMAGE_MARGIN,
		right: IMAGE_MARGIN,
		bottom: verticalScale(16),
		borderRadius: moderateScale(16),
		overflow: "hidden",
	},
	heroImage: {
		width: "100%",
		height: "100%",
	},

	/* ── Content ── */
	content: {
		paddingHorizontal: horizontalScale(20),
		paddingTop: verticalScale(20),
	},

	/* ── Name ── */
	name: {
		fontSize: moderateScale(26),
		color: "#1A1A1A",
		lineHeight: moderateScale(32),
		marginBottom: verticalScale(12),
	},
	recommendedTag: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "flex-start",
		backgroundColor: "#FFF3CD",
		paddingHorizontal: horizontalScale(10),
		paddingVertical: verticalScale(3),
		borderRadius: moderateScale(12),
		gap: horizontalScale(4),
		marginBottom: verticalScale(16),
	},
	recommendedText: {
		fontSize: moderateScale(11),
		color: "#856404",
		fontWeight: "600",
	},

	/* ── Stats ── */
	statsRow: {
		flexDirection: "row",
		gap: horizontalScale(12),
		marginBottom: verticalScale(16),
	},
	statCard: {
		flex: 1,
		paddingVertical: verticalScale(8),
	},
	statLabel: {
		fontSize: moderateScale(12),
		color: "#999",
		marginBottom: verticalScale(4),
	},
	statNumber: {
		fontSize: moderateScale(22),
		color: "#1A1A1A",
	},

	/* ── QR Button ── */
	qrButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(28),
		borderWidth: 1.5,
		borderColor: "#1A1A1A",
		paddingVertical: verticalScale(14),
		paddingHorizontal: horizontalScale(16),
		marginBottom: verticalScale(24),
	},
	qrButtonText: {
		flex: 1,
		fontSize: moderateScale(15),
		color: "#1A1A1A",
	},

	/* ── Sections ── */
	section: {
		marginBottom: verticalScale(24),
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: verticalScale(12),
	},
	sectionTitle: {
		fontSize: moderateScale(18),
		color: "#1A1A1A",
	},
	sectionCount: {
		fontSize: moderateScale(12),
		color: "#999",
	},
	seeAll: {
		fontSize: moderateScale(13),
		color: "#438989",
		fontWeight: "600",
	},

	/* ── Gift Cards ── */
	gcScroll: {
		gap: horizontalScale(12),
	},
	gcCardWrapper: {
		width: horizontalScale(220),
	},
	gcCardFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: verticalScale(8),
		paddingHorizontal: horizontalScale(2),
	},
	gcExpiry: {
		fontSize: moderateScale(11),
		color: "#999",
	},
	gcBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#E6F9E6",
		paddingHorizontal: horizontalScale(8),
		paddingVertical: verticalScale(2),
		borderRadius: moderateScale(8),
		gap: horizontalScale(4),
	},
	gcDot: {
		width: moderateScale(6),
		height: moderateScale(6),
		borderRadius: moderateScale(3),
		backgroundColor: "#22C55E",
	},
	gcBadgeText: {
		fontSize: moderateScale(10),
		color: "#2D6A3F",
		fontWeight: "600",
	},

	/* ── Empty placeholder ── */
	emptyPlaceholder: {
		flex: 1,
		paddingHorizontal: horizontalScale(24),
		marginBottom: verticalScale(24),
	},
	emptyCentered: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	emptyTitle: {
		fontSize: moderateScale(18),
		color: "#1A1A1A",
		marginTop: verticalScale(12),
		marginBottom: verticalScale(6),
	},
	emptySubtitle: {
		fontSize: moderateScale(13),
		color: "#999",
		textAlign: "center",
		lineHeight: moderateScale(18),
		marginBottom: verticalScale(24),
	},
	emptyQrButton: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FFFFFF",
		paddingHorizontal: horizontalScale(28),
		paddingVertical: verticalScale(14),
		borderRadius: moderateScale(28),
		borderWidth: 1.5,
		borderColor: "#1A1A1A",
		width: "100%",
	},
	emptyQrText: {
		fontSize: moderateScale(15),
		color: "#1A1A1A",
	},

	/* ── Activity ── */
	activityCard: {
		backgroundColor: "#F8F8F8",
		borderRadius: moderateScale(14),
		overflow: "hidden",
	},
	divider: {
		height: 1,
		backgroundColor: "#EEEEEE",
		marginHorizontal: moderateScale(16),
	},
	activityRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: verticalScale(14),
		paddingHorizontal: moderateScale(16),
	},
	activityDateCol: {
		flex: 1,
	},
	activityDate: {
		fontSize: moderateScale(14),
		color: "#1A1A1A",
	},
	activitySpentCol: {
		alignItems: "center",
		marginRight: horizontalScale(20),
	},
	activitySpent: {
		fontSize: moderateScale(14),
		color: "#1A1A1A",
	},
	activitySpentLabel: {
		fontSize: moderateScale(10),
		color: "#BBB",
	},
	activityCashbackCol: {
		alignItems: "flex-end",
	},
	activityCashback: {
		fontSize: moderateScale(14),
		color: "#22C55E",
	},
	activityCashbackLabel: {
		fontSize: moderateScale(10),
		color: "#BBB",
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
