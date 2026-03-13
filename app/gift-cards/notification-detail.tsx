import { Text, TextBold } from "@/components";
import GiftCardVisual, { CARD_THEMES } from "@/components/GiftCardVisual";
import { useGiftCardContext } from "@/contexts/GiftCardContext";
import { useUserContext } from "@/contexts/UserContext";
import { queryKeys } from "@/lib/api/queryClient";
import { useUserApi } from "@/lib/api/useApi";
import {
	horizontalScale,
	moderateScale,
	verticalScale,
} from "@/lib/metrics";
import { isNullOrWhitespace } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useMemo } from "react";
import {
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GiftCardNotificationDetail() {
	const { giftCardId, notificationDescription } = useLocalSearchParams<{
		giftCardId: string;
		notificationDescription: string;
	}>();
	const { getGiftCardById, receivedGiftCards } = useGiftCardContext();
	const { user } = useUserContext();
	const userApi = useUserApi();
	const router = useRouter();
	const insets = useSafeAreaInsets();

	const { data: restaurants } = useQuery({
		queryKey: [queryKeys.users.restaurants],
		queryFn: async () => userApi.restaurants(user.id),
		enabled: !!user && !isNullOrWhitespace(user?.id),
	});

	const getRestaurantName = (rid: string) => {
		return restaurants?.find((r) => r.id === rid)?.name ?? "Restaurant";
	};

	// Match gift card: by ID, by restaurant name in description, or by notification order
	const card = useMemo(() => {
		// 1. Try exact ID match
		if (giftCardId) {
			const byId = getGiftCardById(giftCardId);
			if (byId) return byId;
		}

		// 2. Try matching restaurant name from the notification description
		if (notificationDescription && restaurants && receivedGiftCards.length > 0) {
			const descLower = notificationDescription.toLowerCase();
			for (const gc of receivedGiftCards) {
				const rName = getRestaurantName(gc.restaurantId).toLowerCase();
				if (rName !== "restaurant" && descLower.includes(rName)) {
					return gc;
				}
			}
		}

		// 3. Fallback: most recent received card
		if (receivedGiftCards.length > 0) {
			return receivedGiftCards[receivedGiftCards.length - 1];
		}

		return null;
	}, [giftCardId, notificationDescription, receivedGiftCards, restaurants]);

	if (!card) {
		return (
			<View style={styles.root}>
				<View style={styles.centered}>
					<Ionicons
						name="gift-outline"
						size={moderateScale(40)}
						color="#CCC"
					/>
					<Text style={styles.notFoundText}>
						Gift card not found
					</Text>
				</View>
			</View>
		);
	}

	const theme = CARD_THEMES[0];
	const displayName = getRestaurantName(card.restaurantId);
	const createdDate = new Date(card.createdAt).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	return (
		<View style={styles.root}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: insets.bottom + verticalScale(40),
				}}
			>
				{/* Gift Card Visual */}
				<MotiView
					from={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ type: "spring", damping: 14, stiffness: 100 }}
					style={{ marginTop: verticalScale(16), paddingHorizontal: horizontalScale(20) }}
				>
					<GiftCardVisual
						restaurantName={displayName}
						amount={card.amount}
						size="large"
						theme={theme}
					/>
				</MotiView>

				{/* Card Info Section */}
				<MotiView
					from={{ opacity: 0, translateY: 15 }}
					animate={{ opacity: 1, translateY: 0 }}
					transition={{ type: "timing", duration: 250 }}
				>
					<View style={styles.infoSection}>
						<TextBold style={styles.infoSectionTitle}>Card Info</TextBold>

						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Card balance</Text>
							<TextBold style={styles.infoValueLarge}>
								${card.amount}.00
							</TextBold>
						</View>

						<View style={styles.divider} />

						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Gift card code</Text>
							<View style={styles.codeRow}>
								<TextBold style={styles.infoValue}>
									{card.code}
								</TextBold>
								<Ionicons
									name="checkmark-circle"
									size={moderateScale(18)}
									color="#4CAF50"
									style={{ marginLeft: horizontalScale(6) }}
								/>
							</View>
						</View>

						<View style={styles.divider} />

						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Restaurant</Text>
							<TextBold style={styles.infoValue}>
								{displayName}
							</TextBold>
						</View>

						<View style={styles.divider} />

						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Status</Text>
							<View
								style={[
									styles.statusBadge,
									{
										backgroundColor: card.isActive
											? "#D4EDDA"
											: "#E8E8E8",
									},
								]}
							>
								<TextBold
									style={{
										fontSize: moderateScale(12),
										color: card.isActive
											? "#2D6A3F"
											: "#666",
									}}
								>
									{card.isActive ? "Active" : "Inactive"}
								</TextBold>
							</View>
						</View>

						<View style={styles.divider} />

						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Created</Text>
							<Text style={styles.infoValue}>{createdDate}</Text>
						</View>
					</View>

					{/* View Restaurant Button */}
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => {
								router.push({
									pathname: "/restaurants/[id]",
									params: { id: card.restaurantId },
								});
							}}
							style={styles.button}
						>
							<Ionicons
								name="restaurant-outline"
								size={moderateScale(18)}
								color="#FFFFFF"
								style={{ marginRight: horizontalScale(8) }}
							/>
							<TextBold
								style={{
									fontSize: moderateScale(15),
									color: "#FFFFFF",
								}}
							>
								View Restaurant
							</TextBold>
						</TouchableOpacity>
					</View>
				</MotiView>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	centered: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	notFoundText: {
		fontSize: moderateScale(15),
		color: "#888",
		marginTop: verticalScale(12),
	},

	/* Info */
	infoSection: {
		marginTop: verticalScale(28),
		paddingHorizontal: horizontalScale(20),
	},
	infoSectionTitle: {
		fontSize: moderateScale(20),
		color: "#1A1A1A",
		marginBottom: verticalScale(20),
	},
	infoRow: {
		paddingVertical: verticalScale(14),
	},
	infoLabel: {
		fontSize: moderateScale(12),
		color: "#999",
		marginBottom: verticalScale(4),
	},
	infoValue: {
		fontSize: moderateScale(15),
		color: "#1A1A1A",
	},
	infoValueLarge: {
		fontSize: moderateScale(28),
		color: "#1A1A1A",
	},
	codeRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	divider: {
		height: 1,
		backgroundColor: "#F0F0F0",
	},
	statusBadge: {
		alignSelf: "flex-start",
		paddingHorizontal: horizontalScale(10),
		paddingVertical: verticalScale(3),
		borderRadius: moderateScale(8),
	},

	/* Button */
	buttonContainer: {
		paddingHorizontal: horizontalScale(20),
		marginTop: verticalScale(28),
	},
	button: {
		flexDirection: "row",
		backgroundColor: "#000000",
		height: verticalScale(54),
		borderRadius: moderateScale(30),
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
});
