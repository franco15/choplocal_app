import { Text, TextBold } from "@/components";
import GiftCardVisual, { CARD_THEMES } from "@/components/GiftCardVisual";
import { queryKeys } from "@/lib/api/queryClient";
import { useGiftCardApi } from "@/lib/api/useApi";
import {
	horizontalScale,
	moderateScale,
	verticalScale,
} from "@/lib/metrics";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GiftCardNotificationDetail() {
	const { giftCardId } = useLocalSearchParams<{
		giftCardId: string;
	}>();
	const giftCardApi = useGiftCardApi();
	const router = useRouter();
	const insets = useSafeAreaInsets();

	const { data: card, isPending, isError } = useQuery({
		queryKey: queryKeys.giftCards.byId(giftCardId ?? ""),
		queryFn: () => giftCardApi.byId(giftCardId!),
		enabled: !!giftCardId && giftCardId.length > 0,
	});

	const isLoading = !!giftCardId && giftCardId.length > 0 && isPending;

	if (isLoading) {
		return (
			<View style={styles.root}>
				<View style={styles.centered}>
					<ActivityIndicator size="large" color="#b42406" />
				</View>
			</View>
		);
	}

	if (!card || isError || !giftCardId) {
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
	const displayName = card.restaurantName ?? "Restaurant";
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
							<Text style={styles.infoLabel}>Sent by</Text>
							<TextBold style={styles.infoValue}>
								{card.senderName || "Unknown"}
							</TextBold>
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
