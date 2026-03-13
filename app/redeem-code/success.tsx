import { Text, TextBold } from "@/components";
import { RedeemType } from "@/lib/types/giftcard";
import { Ionicons } from "@expo/vector-icons";
import {
	horizontalScale,
	moderateScale,
	verticalScale,
} from "@/lib/metrics";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { MotiView } from "moti";
import { useEffect } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RedeemCodeSuccess() {
	const router = useRouter();
	const insets = useSafeAreaInsets();

	const {
		type: typeStr,
		restaurantName,
		amount,
		senderName,
		code,
	} = useLocalSearchParams<{
		type: string;
		restaurantName: string;
		amount: string;
		senderName: string;
		code: string;
	}>();

	const redeemType = Number(typeStr) as RedeemType;
	const isGiftCard = redeemType === RedeemType.GiftCard;
	const typeLabel = isGiftCard ? "Gift Card" : "Referral Code";

	useEffect(() => {
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
	}, []);

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* ── Fun colored hero card ── */}
				<MotiView
					from={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{
						type: "spring",
						damping: 14,
						stiffness: 120,
						delay: 50,
					}}
				>
					<View style={[styles.heroCard, { backgroundColor: "#FED7AA" }]}>
						{/* Decorative sparkles */}
						<MotiView
							from={{ rotate: "0deg", scale: 0 }}
							animate={{ rotate: "20deg", scale: 1 }}
							transition={{
								type: "spring",
								damping: 8,
								stiffness: 80,
								delay: 300,
							}}
							style={styles.sparkle1}
						>
							<Ionicons name="sparkles" size={28} color="#F59E0B" />
						</MotiView>
						<MotiView
							from={{ rotate: "0deg", scale: 0 }}
							animate={{ rotate: "-15deg", scale: 1 }}
							transition={{
								type: "spring",
								damping: 8,
								stiffness: 80,
								delay: 450,
							}}
							style={styles.sparkle2}
						>
							<Ionicons name="star" size={22} color="#F59E0B" />
						</MotiView>
						<MotiView
							from={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{
								type: "spring",
								damping: 8,
								stiffness: 80,
								delay: 500,
							}}
							style={styles.sparkle3}
						>
							<Ionicons name="star-outline" size={18} color="#F59E0B" />
						</MotiView>

						{/* Main check icon */}
						<MotiView
							from={{ scale: 0, rotate: "-30deg" }}
							animate={{ scale: 1, rotate: "0deg" }}
							transition={{
								type: "spring",
								damping: 10,
								stiffness: 100,
								delay: 150,
							}}
						>
							<View style={[styles.checkCircle, { backgroundColor: "#F59E0B" }]}>
								<Ionicons
									name="checkmark-sharp"
									size={56}
									color="#FFFFFF"
								/>
							</View>
						</MotiView>

						{/* Big bold title inside card */}
						<MotiView
							from={{ opacity: 0, translateY: 10 }}
							animate={{ opacity: 1, translateY: 0 }}
							transition={{
								type: "timing",
								duration: 350,
								delay: 400,
							}}
						>
							<TextBold style={styles.heroTitle}>All Done!</TextBold>
						</MotiView>
					</View>
				</MotiView>

				{/* ── Subtitle ── */}
				<MotiView
					from={{ opacity: 0, translateY: 8 }}
					animate={{ opacity: 1, translateY: 0 }}
					transition={{
						type: "timing",
						duration: 300,
						delay: 500,
					}}
				>
					<Text style={styles.subtitle}>
						{isGiftCard
							? `A $${Number(amount).toFixed(2)} gift card for ${restaurantName}\nhas been added to your account.`
							: `Your referral code for ${restaurantName}\nhas been redeemed successfully!`}
					</Text>
				</MotiView>

				{/* ── Details card ── */}
				<MotiView
					from={{ opacity: 0, translateY: 10 }}
					animate={{ opacity: 1, translateY: 0 }}
					transition={{
						type: "timing",
						duration: 300,
						delay: 600,
					}}
				>
					<View style={styles.detailsCard}>
						<View style={styles.detailRow}>
							<Text style={styles.detailLabel}>Restaurant</Text>
							<TextBold style={styles.detailValue}>
								{restaurantName}
							</TextBold>
						</View>
						<View style={styles.divider} />
						<View style={styles.detailRow}>
							<Text style={styles.detailLabel}>Type</Text>
							<View style={[styles.badge, { backgroundColor: "#FEF3E2" }]}>
								<TextBold style={[styles.badgeText, { color: "#F59E0B" }]}>
									{typeLabel}
								</TextBold>
							</View>
						</View>
						{!!amount && (
							<>
								<View style={styles.divider} />
								<View style={styles.detailRow}>
									<Text style={styles.detailLabel}>Amount</Text>
									<TextBold style={styles.detailValue}>
										${Number(amount).toFixed(2)}
									</TextBold>
								</View>
							</>
						)}
						{!!senderName && (
							<>
								<View style={styles.divider} />
								<View style={styles.detailRow}>
									<Text style={styles.detailLabel}>From</Text>
									<TextBold style={styles.detailValue}>
										{senderName}
									</TextBold>
								</View>
							</>
						)}
						<View style={styles.divider} />
						<View style={styles.detailRow}>
							<Text style={styles.detailLabel}>Code</Text>
							<TextBold style={styles.detailValue}>
								{code}
							</TextBold>
						</View>
					</View>
				</MotiView>
			</ScrollView>

			{/* ── Buttons (pinned to bottom) ── */}
			<MotiView
				from={{ opacity: 0, translateY: 20 }}
				animate={{ opacity: 1, translateY: 0 }}
				transition={{
					type: "timing",
					duration: 300,
					delay: 750,
				}}
				style={[
					styles.bottomSection,
					{ paddingBottom: insets.bottom + verticalScale(16) },
				]}
			>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => router.replace("/(tabs)")}
					style={styles.primaryButton}
				>
					<TextBold style={styles.primaryButtonText}>Done</TextBold>
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => router.replace("/gift-cards")}
					style={styles.secondaryButton}
				>
					<Text style={styles.secondaryButtonText}>
						View My Cards
					</Text>
				</TouchableOpacity>
			</MotiView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	scrollContent: {
		paddingHorizontal: horizontalScale(20),
		paddingTop: verticalScale(12),
	},

	/* ── Hero card ── */
	heroCard: {
		borderRadius: moderateScale(28),
		paddingTop: verticalScale(48),
		paddingBottom: verticalScale(36),
		alignItems: "center",
		overflow: "hidden",
	},
	sparkle1: {
		position: "absolute",
		top: verticalScale(28),
		right: horizontalScale(40),
	},
	sparkle2: {
		position: "absolute",
		top: verticalScale(50),
		left: horizontalScale(35),
	},
	sparkle3: {
		position: "absolute",
		bottom: verticalScale(55),
		right: horizontalScale(55),
	},
	checkCircle: {
		width: moderateScale(100),
		height: moderateScale(100),
		borderRadius: moderateScale(50),
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 8,
	},
	heroTitle: {
		fontSize: moderateScale(38),
		color: "#1A1A1A",
		textAlign: "center",
		marginTop: verticalScale(20),
		letterSpacing: -0.5,
	},

	/* ── Subtitle ── */
	subtitle: {
		fontSize: moderateScale(15),
		color: "#888",
		textAlign: "center",
		marginTop: verticalScale(20),
		lineHeight: moderateScale(22),
		paddingHorizontal: horizontalScale(10),
	},

	/* ── Details card ── */
	detailsCard: {
		backgroundColor: "#F7F7F7",
		borderRadius: moderateScale(20),
		paddingHorizontal: horizontalScale(20),
		paddingVertical: verticalScale(8),
		marginTop: verticalScale(24),
	},
	detailRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: verticalScale(14),
	},
	detailLabel: {
		fontSize: moderateScale(14),
		color: "#999",
	},
	detailValue: {
		fontSize: moderateScale(15),
		color: "#1A1A1A",
		maxWidth: "60%",
		textAlign: "right",
	},
	divider: {
		height: 1,
		backgroundColor: "#EEEEEE",
	},
	badge: {
		paddingHorizontal: horizontalScale(14),
		paddingVertical: verticalScale(5),
		borderRadius: moderateScale(14),
	},
	badgeText: {
		fontSize: moderateScale(13),
	},

	/* ── Bottom buttons ── */
	bottomSection: {
		paddingHorizontal: horizontalScale(20),
		paddingTop: verticalScale(12),
		gap: verticalScale(12),
	},
	primaryButton: {
		backgroundColor: "#000000",
		height: verticalScale(54),
		borderRadius: moderateScale(30),
		alignItems: "center",
		justifyContent: "center",
	},
	primaryButtonText: {
		fontSize: moderateScale(15),
		color: "#FFFFFF",
	},
	secondaryButton: {
		height: verticalScale(48),
		borderRadius: moderateScale(30),
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1.5,
		borderColor: "#1A1A1A",
	},
	secondaryButtonText: {
		fontSize: moderateScale(14),
		color: "#1A1A1A",
	},
});
