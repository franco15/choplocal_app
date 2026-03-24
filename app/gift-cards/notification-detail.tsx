import { Text, TextBold } from "@/components";
import GiftCardVisual, { CARD_THEMES } from "@/components/GiftCardVisual";
import { useUserContext } from "@/contexts/UserContext";
import { queryClient, queryKeys } from "@/lib/api/queryClient";
import { useGiftCardApi, useNotificationsApi } from "@/lib/api/useApi";
import { INotification } from "@/lib/types/notification";
import {
	horizontalScale,
	moderateScale,
	verticalScale,
} from "@/lib/metrics";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useEffect, useRef } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GiftCardNotificationDetail() {
	const { giftCardId, notificationId } = useLocalSearchParams<{
		giftCardId: string;
		notificationId?: string;
	}>();
	const giftCardApi = useGiftCardApi();
	const notificationsApi = useNotificationsApi();
	const { user } = useUserContext();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const markedRef = useRef(false);

	// Mark notification as read when screen loads (optimistic update)
	useEffect(() => {
		if (notificationId && notificationId.length > 0 && user?.id && !markedRef.current) {
			markedRef.current = true;
			queryClient.setQueryData<INotification[]>(
				queryKeys.notifications.byUser(user.id),
				(old) =>
					old?.map((n) =>
						n.id === notificationId ? { ...n, read: true, isRead: true } : n,
					),
			);
			notificationsApi.markAsRead(notificationId).then(() => {
				queryClient.invalidateQueries({
					queryKey: queryKeys.notifications.byUser(user!.id),
				});
			}).catch(() => {});
		}
	}, [notificationId, user?.id]);

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
					paddingBottom: insets.bottom + verticalScale(100),
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

				{/* Card Info */}
				<MotiView
					from={{ opacity: 0, translateY: 15 }}
					animate={{ opacity: 1, translateY: 0 }}
					transition={{ type: "timing", duration: 250 }}
					style={styles.infoContainer}
				>
					{/* Message */}
					{card.message ? (
						<View style={styles.messageCard}>
							<Text style={styles.messageText}>"{card.message}"</Text>
						</View>
					) : null}

					{/* Info Grid */}
					<View style={styles.infoGrid}>
						<View style={styles.infoItem}>
							<Text style={styles.infoLabel}>Code</Text>
							<TextBold style={styles.infoValue}>{card.code}</TextBold>
						</View>

						<View style={styles.gridDivider} />

						<View style={styles.infoItem}>
							<Text style={styles.infoLabel}>Sent by</Text>
							<TextBold style={styles.infoValue}>{card.senderName || "Unknown"}</TextBold>
						</View>

						<View style={styles.gridDivider} />

						<View style={styles.infoItem}>
							<Text style={styles.infoLabel}>Restaurant</Text>
							<TextBold style={styles.infoValue}>{displayName}</TextBold>
						</View>

						<View style={styles.gridDivider} />

						<View style={styles.infoItem}>
							<Text style={styles.infoLabel}>Status</Text>
							<View style={[styles.statusBadge, { backgroundColor: card.isActive ? "#D4EDDA" : "#E8E8E8" }]}>
								<TextBold style={{ fontSize: moderateScale(12), color: card.isActive ? "#2D6A3F" : "#666" }}>
									{card.isActive ? "Active" : "Inactive"}
								</TextBold>
							</View>
						</View>

						<View style={styles.gridDivider} />

						<View style={styles.infoItem}>
							<Text style={styles.infoLabel}>Created</Text>
							<TextBold style={styles.infoValue}>{createdDate}</TextBold>
						</View>
					</View>
				</MotiView>
			</ScrollView>

			{/* Sticky Footer Button */}
			<View style={[styles.footer, { paddingBottom: insets.bottom + verticalScale(16) }]}>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						router.dismissAll();
						router.push({
							pathname: "/restaurants/[id]",
							params: { id: card.restaurantId },
						});
					}}
					style={styles.button}
				>
					<TextBold style={styles.buttonText}>View Restaurant</TextBold>
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

	/* Info Container */
	infoContainer: {
		paddingHorizontal: horizontalScale(20),
		marginTop: verticalScale(20),
	},

	/* Message Card */
	messageCard: {
		flexDirection: "row",
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(18),
		paddingVertical: verticalScale(16),
		paddingHorizontal: horizontalScale(16),
		marginBottom: verticalScale(12),
		alignItems: "flex-start",
	},
	messageText: {
		flex: 1,
		fontSize: moderateScale(14),
		color: "#555",
		fontStyle: "italic",
		lineHeight: moderateScale(20),
	},

	/* Info Grid */
	infoGrid: {
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(18),
		paddingHorizontal: horizontalScale(16),
	},
	infoItem: {
		paddingVertical: verticalScale(14),
	},
	infoLabel: {
		fontSize: moderateScale(11),
		color: "#999",
		marginBottom: verticalScale(4),
	},
	infoValue: {
		fontSize: moderateScale(15),
		color: "#1A1A1A",
	},
	statusBadge: {
		alignSelf: "flex-start",
		paddingHorizontal: horizontalScale(10),
		paddingVertical: verticalScale(3),
		borderRadius: moderateScale(8),
	},
	gridDivider: {
		height: 1,
		backgroundColor: "#F0F0F0",
	},

	/* Footer */
	footer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "#FFFFFF",
		paddingTop: verticalScale(12),
		paddingHorizontal: horizontalScale(20),
		borderTopWidth: 1,
		borderTopColor: "#F0F0F0",
	},
	button: {
		backgroundColor: "#000000",
		height: verticalScale(54),
		borderRadius: moderateScale(30),
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
	buttonText: {
		fontSize: moderateScale(15),
		color: "#FFFFFF",
	},
});
