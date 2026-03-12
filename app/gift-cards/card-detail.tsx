import { Text, TextBold } from "@/components";
import GiftCardVisual, { CARD_THEMES } from "@/components/GiftCardVisual";
import { useGiftCardContext } from "@/contexts/GiftCardContext";
import {
	horizontalScale,
	moderateScale,
	verticalScale,
} from "@/lib/metrics";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { MotiView } from "moti";
import { useState } from "react";
import {
	Dimensions,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ARROW_SIZE = moderateScale(32);
const CARD_PADDING = horizontalScale(8);
const CARD_WIDTH = SCREEN_WIDTH - (ARROW_SIZE + CARD_PADDING) * 2;

export default function GiftCardDetail() {
	const { giftCardId, themeIndex, groupIds } = useLocalSearchParams<{
		giftCardId: string;
		themeIndex: string;
		groupIds?: string;
	}>();
	const { getGiftCardById } = useGiftCardContext();
	const insets = useSafeAreaInsets();

	const ids = groupIds ? groupIds.split(",") : [giftCardId ?? ""];
	const cards = ids.map((id) => getGiftCardById(id)).filter(Boolean);

	const initialIndex = Math.max(0, ids.indexOf(giftCardId ?? ""));
	const [activeIndex, setActiveIndex] = useState(initialIndex);

	if (cards.length === 0) {
		return (
			<View style={styles.root}>
				<View style={styles.centered}>
					<Text style={{ fontSize: moderateScale(15), color: "#888" }}>
						Gift card not found.
					</Text>
				</View>
			</View>
		);
	}

	const goToCard = (direction: number) => {
		const newIndex = activeIndex + direction;
		if (newIndex < 0 || newIndex >= cards.length) return;
		setActiveIndex(newIndex);
	};

	const currentCard = cards[activeIndex]!;
	const currentTheme = CARD_THEMES[activeIndex % CARD_THEMES.length];

	const expiryDate = new Date(currentCard.expiresAt).toLocaleDateString("en-US", {
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
				{/* Card Display */}
				<MotiView
					from={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ type: "spring", damping: 14, stiffness: 100 }}
					style={{ marginTop: verticalScale(16) }}
				>
					{cards.length > 1 ? (
						<View>
							<View style={styles.carouselRow}>
								{/* Left Arrow */}
								<TouchableOpacity
									activeOpacity={0.6}
									onPress={() => goToCard(-1)}
									style={[styles.arrowBtn, activeIndex === 0 && styles.arrowBtnDisabled]}
									disabled={activeIndex === 0}
								>
									<Ionicons name="chevron-back" size={moderateScale(22)} color={activeIndex === 0 ? "#DDD" : "#1A1A1A"} />
								</TouchableOpacity>

								{/* Card */}
								<View style={{ width: CARD_WIDTH, marginHorizontal: CARD_PADDING }}>
									<MotiView
										key={currentCard.id}
										from={{ opacity: 0.5, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ type: "timing", duration: 200 }}
									>
										<GiftCardVisual
											restaurantName={currentCard.restaurantName}
											amount={currentCard.value}
											size="large"
											theme={currentTheme}
										/>
									</MotiView>
								</View>

								{/* Right Arrow */}
								<TouchableOpacity
									activeOpacity={0.6}
									onPress={() => goToCard(1)}
									style={[styles.arrowBtn, activeIndex === cards.length - 1 && styles.arrowBtnDisabled]}
									disabled={activeIndex === cards.length - 1}
								>
									<Ionicons name="chevron-forward" size={moderateScale(22)} color={activeIndex === cards.length - 1 ? "#DDD" : "#1A1A1A"} />
								</TouchableOpacity>
							</View>

							{/* Dots */}
							<View style={styles.dotsRow}>
								{cards.map((_, i) => (
									<View
										key={i}
										style={[
											styles.dot,
											i === activeIndex && { backgroundColor: "#1A1A1A", width: moderateScale(18) },
										]}
									/>
								))}
							</View>
						</View>
					) : (
						<View style={{ paddingHorizontal: horizontalScale(20) }}>
							<GiftCardVisual
								restaurantName={currentCard.restaurantName}
								amount={currentCard.value}
								size="large"
								theme={currentTheme}
							/>
						</View>
					)}
				</MotiView>

				{/* Card Info Section */}
				<MotiView
					key={currentCard.id}
					from={{ opacity: 0, translateY: 15 }}
					animate={{ opacity: 1, translateY: 0 }}
					transition={{ type: "timing", duration: 250 }}
				>
					<View style={styles.infoSection}>
						<TextBold style={styles.infoSectionTitle}>Card Info</TextBold>

						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Card balance</Text>
							<TextBold style={styles.infoValueLarge}>
								${currentCard.value}.00
							</TextBold>
						</View>

						<View style={styles.divider} />

						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Gift card code</Text>
							<View style={styles.codeRow}>
								<TextBold style={styles.infoValue}>
									{currentCard.code}
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
							<Text style={styles.infoLabel}>From</Text>
							<TextBold style={styles.infoValue}>
								{currentCard.senderName}
							</TextBold>
						</View>

						<View style={styles.divider} />

						{currentCard.message ? (
							<>
								<View style={styles.infoRow}>
									<Text style={styles.infoLabel}>Message</Text>
									<Text style={styles.infoValue}>
										"{currentCard.message}"
									</Text>
								</View>
								<View style={styles.divider} />
							</>
						) : null}

						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Status</Text>
							<View
								style={[
									styles.statusBadge,
									{
										backgroundColor:
											currentCard.status === "Available"
												? "#D4EDDA"
												: currentCard.status === "Used"
													? "#E8E8E8"
													: "#FFF3CD",
									},
								]}
							>
								<TextBold
									style={{
										fontSize: moderateScale(12),
										color:
											currentCard.status === "Available"
												? "#2D6A3F"
												: currentCard.status === "Used"
													? "#666"
													: "#856404",
									}}
								>
									{currentCard.status}
								</TextBold>
							</View>
						</View>

						<View style={styles.divider} />

						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Expires</Text>
							<Text style={styles.infoValue}>{expiryDate}</Text>
						</View>
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

	/* Carousel */
	carouselRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	arrowBtn: {
		width: ARROW_SIZE,
		height: ARROW_SIZE,
		borderRadius: ARROW_SIZE / 2,
		backgroundColor: "#F5F5F5",
		alignItems: "center",
		justifyContent: "center",
	},
	arrowBtnDisabled: {
		opacity: 0.4,
	},
	dotsRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: verticalScale(14),
		gap: horizontalScale(6),
	},
	dot: {
		width: moderateScale(8),
		height: moderateScale(8),
		borderRadius: moderateScale(4),
		backgroundColor: "#DDD",
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
});
