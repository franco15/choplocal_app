import { Container, Text, TextBold } from "@/components";
import GiftCardVisual, {
	CARD_THEMES,
	CardTheme,
} from "@/components/GiftCardVisual";
import {
	horizontalScale,
	moderateScale,
	verticalScale,
} from "@/lib/metrics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useState } from "react";
import {
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PRESET_AMOUNTS = [15, 20, 50, 100];

export default function ChooseAmount() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { restaurantId, restaurantName } = useLocalSearchParams<{
		restaurantId: string;
		restaurantName: string;
	}>();

	const [selectedPreset, setSelectedPreset] = useState<number | null>(50);
	const [customAmount, setCustomAmount] = useState("");
	const [isCustom, setIsCustom] = useState(false);
	const [selectedTheme, setSelectedTheme] = useState<CardTheme>(
		CARD_THEMES[0],
	);

	const effectiveAmount = isCustom
		? Number(customAmount) || 0
		: selectedPreset ?? 0;

	const onSelectPreset = (amount: number) => {
		setSelectedPreset(amount);
		setIsCustom(false);
		setCustomAmount("");
	};

	const onToggleCustom = () => {
		setIsCustom(true);
		setSelectedPreset(null);
	};

	const onContinue = () => {
		if (effectiveAmount <= 0) return;
		router.push({
			pathname: "/gift-cards/recipient",
			params: {
				restaurantId,
				restaurantName,
				value: String(effectiveAmount),
				colorThemeId: selectedTheme.id,
			},
		});
	};

	return (
		<Container style={{ paddingTop: 0 }}>
			<View style={{ flex: 1 }}>
				<ScrollView
					contentContainerStyle={styles.content}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
				>
					{/* Header */}
					<TextBold
						style={{
							fontSize: moderateScale(26),
							color: "#1A1A1A",
						}}
					>
						How much?
					</TextBold>
					<Text
						style={{
							fontSize: moderateScale(14),
							color: "#888",
							marginTop: verticalScale(4),
						}}
					>
						{restaurantName}
					</Text>

					{/* Live Gift Card Preview */}
					<MotiView
						from={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{
							type: "timing",
							duration: 350,
							delay: 100,
						}}
						style={{ marginTop: verticalScale(20) }}
					>
						<MotiView
							key={`${effectiveAmount}-${selectedTheme.id}`}
							from={{ scale: 0.97, opacity: 0.7 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{
								type: "spring",
								damping: 14,
								stiffness: 150,
							}}
						>
							<GiftCardVisual
								restaurantName={restaurantName ?? ""}
								amount={
									effectiveAmount > 0 ? effectiveAmount : 0
								}
								theme={selectedTheme}
							/>
						</MotiView>
					</MotiView>

					{/* Color Theme Picker */}
					<View style={styles.colorPickerRow}>
						{CARD_THEMES.map((t) => (
							<TouchableOpacity
								key={t.id}
								onPress={() => setSelectedTheme(t)}
								activeOpacity={0.7}
								style={[
									styles.colorDot,
									{ backgroundColor: t.bg },
									selectedTheme.id === t.id &&
										styles.colorDotSelected,
								]}
							/>
						))}
					</View>

					{/* Preset Amounts - Single Horizontal Row */}
					<View style={styles.amountRow}>
						{PRESET_AMOUNTS.map((amount) => {
							const isSelected =
								!isCustom && selectedPreset === amount;
							return (
								<Pressable
									key={amount}
									onPress={() => onSelectPreset(amount)}
									style={styles.amountItem}
								>
									<TextBold
										style={{
											fontSize: moderateScale(18),
											color: isSelected
												? "#1A1A1A"
												: "#AAAAAA",
										}}
									>
										${amount}
									</TextBold>
									{/* Selection indicator dot */}
									<View
										style={[
											styles.amountDot,
											isSelected &&
												styles.amountDotActive,
										]}
									/>
								</Pressable>
							);
						})}
					</View>

					{/* Custom Amount */}
					{!isCustom ? (
						<Pressable
							onPress={onToggleCustom}
							style={{
								alignSelf: "center",
								marginTop: verticalScale(14),
							}}
						>
							<Text
								style={{
									fontSize: moderateScale(14),
									color: "#888",
									textDecorationLine: "underline",
								}}
							>
								Enter custom amount
							</Text>
						</Pressable>
					) : (
						<View style={styles.customInputContainer}>
							<Text
								style={{
									fontSize: moderateScale(22),
									color: "#1A1A1A",
									marginRight: horizontalScale(4),
								}}
							>
								$
							</Text>
							<TextInput
								value={customAmount}
								onChangeText={(t) =>
									setCustomAmount(
										t.replace(/[^0-9]/g, ""),
									)
								}
								placeholder="0"
								placeholderTextColor="#CCC"
								keyboardType="number-pad"
								autoFocus
								style={styles.customInput}
								maxLength={4}
							/>
						</View>
					)}
				</ScrollView>

				{/* Fixed Bottom Button */}
				<View
					style={[
						styles.bottomBar,
						{
							paddingBottom:
								insets.bottom > 0
									? insets.bottom
									: verticalScale(16),
						},
					]}
				>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={onContinue}
						disabled={effectiveAmount <= 0}
						style={[
							styles.button,
							{
								opacity: effectiveAmount > 0 ? 1 : 0.4,
							},
						]}
					>
						<TextBold
							style={{
								fontSize: moderateScale(15),
								color: "#FFFFFF",
							}}
						>
							Continue · $
							{effectiveAmount > 0 ? effectiveAmount : "0"}
						</TextBold>
					</TouchableOpacity>
				</View>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	content: {
		paddingHorizontal: horizontalScale(8),
		paddingTop: verticalScale(10),
		paddingBottom: verticalScale(20),
	},
	colorPickerRow: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: horizontalScale(12),
		marginTop: verticalScale(18),
	},
	colorDot: {
		width: moderateScale(28),
		height: moderateScale(28),
		borderRadius: moderateScale(14),
	},
	colorDotSelected: {
		borderWidth: 3,
		borderColor: "#FFFFFF",
		...Platform.select({
			ios: {
				shadowColor: "#000000",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.3,
				shadowRadius: 4,
			},
			android: {
				elevation: 6,
			},
		}),
	},
	amountRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginTop: verticalScale(28),
	},
	amountItem: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: verticalScale(8),
		paddingHorizontal: horizontalScale(12),
	},
	amountDot: {
		width: moderateScale(6),
		height: moderateScale(6),
		borderRadius: moderateScale(3),
		marginTop: verticalScale(6),
		backgroundColor: "transparent",
	},
	amountDotActive: {
		backgroundColor: "#1A1A1A",
	},
	customInputContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(14),
		paddingHorizontal: horizontalScale(20),
		paddingVertical: verticalScale(12),
		marginTop: verticalScale(14),
		alignSelf: "center",
		minWidth: horizontalScale(160),
		...Platform.select({
			ios: {
				shadowColor: "#000000",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.08,
				shadowRadius: 8,
			},
			android: {
				elevation: 3,
			},
		}),
	},
	customInput: {
		fontSize: moderateScale(22),
		color: "#1A1A1A",
		fontWeight: "700",
		minWidth: horizontalScale(60),
		padding: 0,
		textAlign: "center",
	},
	bottomBar: {
		paddingHorizontal: horizontalScale(8),
		paddingTop: verticalScale(12),
		backgroundColor: "transparent",
	},
	button: {
		backgroundColor: "#000000",
		height: verticalScale(54),
		borderRadius: moderateScale(30),
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
});
