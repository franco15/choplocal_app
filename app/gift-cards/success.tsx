import { Container, Text, TextBold } from "@/components";
import GiftCardVisual, { CARD_THEMES } from "@/components/GiftCardVisual";
import {
	horizontalScale,
	moderateScale,
	verticalScale,
} from "@/lib/metrics";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { MotiView } from "moti";
import { useEffect, useMemo } from "react";
import {
	ScrollView,
	Share,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CONFETTI_COLORS = [
	"#FF6B6B",
	"#4ECDC4",
	"#FFE66D",
	"#95E1D3",
	"#F38181",
	"#AA96DA",
	"#FF9A9E",
	"#A8E6CF",
	"#FFD93D",
	"#6C5CE7",
	"#FD79A8",
	"#00B894",
];

export default function GiftCardSuccess() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const {
		restaurantName,
		value,
		recipientPhone,
		colorThemeId,
		code,
		message,
	} = useLocalSearchParams<{
		restaurantName: string;
		value: string;
		recipientPhone: string;
		colorThemeId: string;
		code: string;
		message: string;
	}>();

	const selectedTheme = useMemo(
		() =>
			CARD_THEMES.find((t) => t.id === colorThemeId) ??
			CARD_THEMES[0],
		[colorThemeId],
	);

	useEffect(() => {
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
	}, []);

	const confettiPieces = useMemo(
		() =>
			Array.from({ length: 14 }).map((_, i) => {
				const angle = (i / 14) * Math.PI * 2;
				const radius = 120 + Math.random() * 60;
				return {
					x: Math.cos(angle) * radius,
					y: Math.sin(angle) * radius - 40,
					color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
					size: 6 + Math.random() * 6,
					delay: 200 + i * 30,
					isCircle: i % 3 !== 0,
				};
			}),
		[],
	);

	const onCopyCode = async () => {
		await Share.share({ message: code ?? "" });
	};

	const onShare = async () => {
		const shareMsg = message
			? `I sent you a $${value} gift card for ${restaurantName}! "${message}" \nRedeem it with code: ${code}`
			: `I sent you a $${value} gift card for ${restaurantName}! Redeem it with code: ${code}`;
		await Share.share({ message: shareMsg });
	};

	return (
		<Container style={{ paddingTop: insets.top }}>
			<ScrollView
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* Confetti burst */}
				<View style={styles.confettiContainer}>
					{confettiPieces.map((piece, i) => (
						<MotiView
							key={i}
							from={{
								opacity: 1,
								translateX: 0,
								translateY: 0,
								scale: 0,
							}}
							animate={{
								opacity: 0,
								translateX: piece.x,
								translateY: piece.y,
								scale: 1.5,
							}}
							transition={{
								type: "timing",
								duration: 900,
								delay: piece.delay,
							}}
							style={[
								styles.confettiPiece,
								{
									width: piece.size,
									height: piece.size,
									borderRadius: piece.isCircle
										? piece.size / 2
										: 2,
									backgroundColor: piece.color,
								},
							]}
						/>
					))}
				</View>

				{/* Gift Card Visual */}
				<MotiView
					from={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{
						type: "spring",
						damping: 12,
						stiffness: 100,
						delay: 100,
					}}
					style={{ zIndex: 2 }}
				>
					<GiftCardVisual
						restaurantName={restaurantName ?? ""}
						amount={value ?? "0"}
						size="large"
						theme={selectedTheme}
					/>
				</MotiView>

				{/* Title */}
				<MotiView
					from={{ opacity: 0, translateY: 10 }}
					animate={{ opacity: 1, translateY: 0 }}
					transition={{
						type: "timing",
						duration: 350,
						delay: 350,
					}}
					style={{ alignItems: "center" }}
				>
					<TextBold
						style={{
							fontSize: moderateScale(30),
							color: "#1A1A1A",
							marginTop: verticalScale(24),
							textAlign: "center",
						}}
					>
						Gift Card Sent!
					</TextBold>
					<Text
						style={{
							fontSize: moderateScale(14),
							color: "#888",
							marginTop: verticalScale(8),
							textAlign: "center",
							lineHeight: moderateScale(21),
						}}
					>
						Share this code with your friend{"\n"}so they can
						redeem it.
					</Text>
				</MotiView>

				{/* ── Code Card ── */}
				<MotiView
					from={{ opacity: 0, translateY: 10 }}
					animate={{ opacity: 1, translateY: 0 }}
					transition={{
						type: "timing",
						duration: 300,
						delay: 500,
					}}
				>
					<View style={styles.codeCard}>
						<Text style={styles.codeLabel}>GIFT CARD CODE</Text>
						<TextBold style={styles.codeText}>
							{code ?? "---"}
						</TextBold>
						<TouchableOpacity
							onPress={onCopyCode}
							activeOpacity={0.7}
							style={styles.copyButton}
						>
							<Ionicons
								name="copy-outline"
								size={18}
								color="#1A1A1A"
							/>
							<Text style={styles.copyButtonText}>
								Copy Code
							</Text>
						</TouchableOpacity>
					</View>
				</MotiView>

				{/* Details card */}
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
						{recipientPhone ? (
							<View style={styles.detailRow}>
								<Text style={styles.detailLabel}>To</Text>
								<TextBold style={styles.detailValue}>
									{recipientPhone}
								</TextBold>
							</View>
						) : null}
						{recipientPhone && value ? (
							<View style={styles.divider} />
						) : null}
						<View style={styles.detailRow}>
							<Text style={styles.detailLabel}>Amount</Text>
							<TextBold style={styles.detailValue}>
								${Number(value).toFixed(2)}
							</TextBold>
						</View>
						<View style={styles.divider} />
						<View style={styles.detailRow}>
							<Text style={styles.detailLabel}>
								Restaurant
							</Text>
							<TextBold style={styles.detailValue}>
								{restaurantName}
							</TextBold>
						</View>
					</View>
				</MotiView>
			</ScrollView>

			{/* ── Bottom Buttons (pinned) ── */}
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
					onPress={onShare}
					style={styles.shareButton}
				>
					<Ionicons
						name="share-outline"
						size={20}
						color="#FFFFFF"
					/>
					<TextBold style={styles.shareButtonText}>
						Share with Friend
					</TextBold>
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => router.replace("/(tabs)")}
					style={styles.secondaryButton}
				>
					<Text style={styles.secondaryButtonText}>Done</Text>
				</TouchableOpacity>
			</MotiView>
		</Container>
	);
}

const styles = StyleSheet.create({
	content: {
		paddingHorizontal: horizontalScale(2),
		paddingTop: verticalScale(20),
		paddingBottom: verticalScale(20),
	},
	confettiContainer: {
		position: "absolute",
		alignSelf: "center",
		top: verticalScale(120),
		zIndex: 1,
	},
	confettiPiece: {
		position: "absolute",
	},

	/* ── Code card ── */
	codeCard: {
		backgroundColor: "#F7F7F7",
		borderRadius: moderateScale(16),
		padding: moderateScale(22),
		marginTop: verticalScale(20),
		alignItems: "center",
		borderWidth: 1.5,
		borderColor: "#E0E0E0",
		borderStyle: "dashed",
	},
	codeLabel: {
		fontSize: moderateScale(11),
		color: "#999",
		letterSpacing: 1.5,
		marginBottom: verticalScale(8),
	},
	codeText: {
		fontSize: moderateScale(30),
		color: "#1A1A1A",
		letterSpacing: 4,
	},
	copyButton: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: verticalScale(14),
		paddingHorizontal: horizontalScale(18),
		paddingVertical: verticalScale(8),
		borderRadius: moderateScale(20),
		backgroundColor: "#EDEDED",
		gap: horizontalScale(6),
	},
	copyButtonText: {
		fontSize: moderateScale(13),
		color: "#1A1A1A",
	},

	/* ── Details card ── */
	detailsCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(16),
		borderWidth: 1,
		borderColor: "#EDEDED",
		paddingHorizontal: moderateScale(18),
		paddingVertical: moderateScale(6),
		marginTop: verticalScale(16),
	},
	detailRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: verticalScale(12),
	},
	detailLabel: {
		fontSize: moderateScale(13),
		color: "#999",
	},
	detailValue: {
		fontSize: moderateScale(14),
		color: "#1A1A1A",
		maxWidth: "60%",
		textAlign: "right",
	},
	divider: {
		height: 1,
		backgroundColor: "#F0F0F0",
	},

	/* ── Bottom buttons ── */
	bottomSection: {
		paddingHorizontal: horizontalScale(2),
		paddingTop: verticalScale(12),
		gap: verticalScale(12),
	},
	shareButton: {
		flexDirection: "row",
		backgroundColor: "#000000",
		height: verticalScale(54),
		borderRadius: moderateScale(30),
		alignItems: "center",
		justifyContent: "center",
		gap: horizontalScale(10),
	},
	shareButtonText: {
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
