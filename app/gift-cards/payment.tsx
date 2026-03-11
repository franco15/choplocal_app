import { Container, Text, TextBold } from "@/components";
import { Lock } from "@/constants/svgs";
import { useGiftCardContext } from "@/contexts/GiftCardContext";
import {
	horizontalScale,
	moderateScale,
	verticalScale,
} from "@/lib/metrics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useState } from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Modal,
	Platform,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const formatCardNumber = (text: string) => {
	const cleaned = text.replace(/\D/g, "").slice(0, 16);
	return cleaned.replace(/(.{4})/g, "$1 ").trim();
};

const formatExpiry = (text: string) => {
	const cleaned = text.replace(/\D/g, "").slice(0, 4);
	if (cleaned.length >= 3)
		return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
	return cleaned;
};

export default function Payment() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { processPayment, sendGiftCard } = useGiftCardContext();

	const {
		restaurantId,
		restaurantName,
		value,
		recipientPhone,
		message,
		colorThemeId,
	} = useLocalSearchParams<{
		restaurantId: string;
		restaurantName: string;
		value: string;
		recipientPhone: string;
		message: string;
		colorThemeId: string;
	}>();

	const [cardholderName, setCardholderName] = useState("");
	const [cardNumber, setCardNumber] = useState("");
	const [expiry, setExpiry] = useState("");
	const [cvv, setCvv] = useState("");
	const [processing, setProcessing] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const amount = Number(value) || 0;

	const validate = (): boolean => {
		const newErrors: Record<string, string> = {};
		if (cardholderName.trim().length < 2)
			newErrors.name = "Enter cardholder name";
		if (cardNumber.replace(/\s/g, "").length < 16)
			newErrors.card = "Enter a valid card number";
		if (expiry.length < 5) newErrors.expiry = "Enter valid expiry";
		if (cvv.length < 3) newErrors.cvv = "Enter valid CVV";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const onPay = async () => {
		if (!validate()) return;
		setProcessing(true);
		try {
			await processPayment(
				{
					cardNumber,
					expiryDate: expiry,
					cvv,
					cardholderName,
				},
				amount,
			);
			const giftCard = await sendGiftCard({
				restaurantId: Number(restaurantId),
				restaurantName: restaurantName ?? "",
				value: amount,
				recipientPhone: recipientPhone ?? "",
				message: message ?? "",
			});
			router.replace({
				pathname: "/gift-cards/success",
				params: {
					restaurantName,
					value,
					recipientPhone,
					colorThemeId,
					code: giftCard.code,
					message: message ?? "",
				},
			});
		} catch {
			setErrors({ general: "Payment failed. Please try again." });
		} finally {
			setProcessing(false);
		}
	};

	return (
		<Container style={{ paddingTop: 0 }}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<View style={{ flex: 1 }}>
					<ScrollView
						contentContainerStyle={styles.content}
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps="handled"
					>
						{/* Header */}
						<MotiView
							from={{ opacity: 0, translateY: -10 }}
							animate={{ opacity: 1, translateY: 0 }}
							transition={{
								type: "timing",
								duration: 300,
							}}
						>
							<TextBold
								style={{
									fontSize: moderateScale(26),
									color: "#1A1A1A",
								}}
							>
								Payment
							</TextBold>
							<Text
								style={{
									fontSize: moderateScale(14),
									color: "#888",
									marginTop: verticalScale(4),
								}}
							>
								Complete your gift card purchase
							</Text>
						</MotiView>

						{/* Order Summary */}
						<MotiView
							from={{ opacity: 0, translateY: 10 }}
							animate={{ opacity: 1, translateY: 0 }}
							transition={{
								type: "timing",
								duration: 300,
								delay: 100,
							}}
						>
							<View style={styles.summaryCard}>
								<View style={styles.summaryRow}>
									<Text style={styles.label}>
										Restaurant
									</Text>
									<TextBold
										style={styles.summaryValue}
										numberOfLines={1}
									>
										{restaurantName}
									</TextBold>
								</View>
								<View style={styles.divider} />
								<View style={styles.summaryRow}>
									<Text style={styles.label}>
										Gift Card
									</Text>
									<TextBold style={styles.summaryValue}>
										${amount}.00
									</TextBold>
								</View>
								<View style={styles.divider} />
								<View style={styles.summaryRow}>
									<Text style={styles.label}>To</Text>
									<TextBold style={styles.summaryValue}>
										{recipientPhone}
									</TextBold>
								</View>
								<View style={styles.dividerThick} />
								<View style={styles.summaryRow}>
									<TextBold
										style={{
											fontSize: moderateScale(15),
											color: "#1A1A1A",
										}}
									>
										Total
									</TextBold>
									<TextBold
										style={{
											fontSize: moderateScale(20),
											color: "#1A1A1A",
										}}
									>
										${amount}.00
									</TextBold>
								</View>
							</View>
						</MotiView>

						{/* Payment Form */}
						<MotiView
							from={{ opacity: 0, translateY: 10 }}
							animate={{ opacity: 1, translateY: 0 }}
							transition={{
								type: "timing",
								duration: 300,
								delay: 200,
							}}
						>
							<TextBold
								style={{
									fontSize: moderateScale(16),
									color: "#1A1A1A",
									marginTop: verticalScale(24),
									marginBottom: verticalScale(16),
								}}
							>
								Card Details
							</TextBold>

							{/* Cardholder Name */}
							<Text style={styles.inputLabel}>
								Cardholder Name
							</Text>
							<TextInput
								value={cardholderName}
								onChangeText={(t) => {
									setCardholderName(t);
									if (errors.name)
										setErrors((e) => ({
											...e,
											name: "",
										}));
								}}
								placeholder="John Doe"
								placeholderTextColor="#BBB"
								style={[
									styles.input,
									errors.name
										? { borderColor: "#E53935" }
										: {},
								]}
							/>
							{errors.name ? (
								<Text style={styles.errorText}>
									{errors.name}
								</Text>
							) : null}

							{/* Card Number */}
							<Text style={styles.inputLabel}>
								Card Number
							</Text>
							<TextInput
								value={cardNumber}
								onChangeText={(t) => {
									setCardNumber(formatCardNumber(t));
									if (errors.card)
										setErrors((e) => ({
											...e,
											card: "",
										}));
								}}
								placeholder="4242 4242 4242 4242"
								placeholderTextColor="#BBB"
								keyboardType="number-pad"
								maxLength={19}
								style={[
									styles.input,
									errors.card
										? { borderColor: "#E53935" }
										: {},
								]}
							/>
							{errors.card ? (
								<Text style={styles.errorText}>
									{errors.card}
								</Text>
							) : null}

							{/* Expiry + CVV Row */}
							<View style={styles.row}>
								<View style={{ flex: 1 }}>
									<Text style={styles.inputLabel}>
										Expiry
									</Text>
									<TextInput
										value={expiry}
										onChangeText={(t) => {
											setExpiry(formatExpiry(t));
											if (errors.expiry)
												setErrors((e) => ({
													...e,
													expiry: "",
												}));
										}}
										placeholder="MM/YY"
										placeholderTextColor="#BBB"
										keyboardType="number-pad"
										maxLength={5}
										style={[
											styles.input,
											errors.expiry
												? {
														borderColor:
															"#E53935",
													}
												: {},
										]}
									/>
									{errors.expiry ? (
										<Text style={styles.errorText}>
											{errors.expiry}
										</Text>
									) : null}
								</View>
								<View
									style={{
										width: horizontalScale(14),
									}}
								/>
								<View style={{ flex: 1 }}>
									<Text style={styles.inputLabel}>
										CVV
									</Text>
									<TextInput
										value={cvv}
										onChangeText={(t) => {
											setCvv(
												t
													.replace(/\D/g, "")
													.slice(0, 3),
											);
											if (errors.cvv)
												setErrors((e) => ({
													...e,
													cvv: "",
												}));
										}}
										placeholder="123"
										placeholderTextColor="#BBB"
										keyboardType="number-pad"
										secureTextEntry
										maxLength={3}
										style={[
											styles.input,
											errors.cvv
												? {
														borderColor:
															"#E53935",
													}
												: {},
										]}
									/>
									{errors.cvv ? (
										<Text style={styles.errorText}>
											{errors.cvv}
										</Text>
									) : null}
								</View>
							</View>

							{/* Secure payment badge */}
							<View style={styles.secureBadge}>
								<Lock
									width={horizontalScale(14)}
									height={verticalScale(14)}
								/>
								<Text
									style={{
										fontSize: moderateScale(12),
										color: "#AAA",
										marginLeft: horizontalScale(6),
									}}
								>
									Secure payment
								</Text>
							</View>
						</MotiView>

						{/* General error */}
						{errors.general ? (
							<Text
								style={[
									styles.errorText,
									{
										textAlign: "center",
										marginTop: verticalScale(12),
									},
								]}
							>
								{errors.general}
							</Text>
						) : null}
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
							onPress={onPay}
							disabled={processing}
							style={styles.payButton}
						>
							<TextBold
								style={{
									fontSize: moderateScale(16),
									color: "#FFFFFF",
								}}
							>
								Pay ${amount}.00
							</TextBold>
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>

			{/* Processing Overlay */}
			<Modal visible={processing} transparent animationType="fade">
				<View style={styles.overlay}>
					<MotiView
						from={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ type: "timing", duration: 250 }}
						style={styles.processingCard}
					>
						<ActivityIndicator
							size="large"
							color="#000000"
						/>
						<TextBold
							style={{
								fontSize: moderateScale(16),
								color: "#1A1A1A",
								marginTop: verticalScale(16),
							}}
						>
							Processing payment...
						</TextBold>
						<Text
							style={{
								fontSize: moderateScale(13),
								color: "#888",
								marginTop: verticalScale(6),
							}}
						>
							Please wait a moment
						</Text>
					</MotiView>
				</View>
			</Modal>
		</Container>
	);
}

const styles = StyleSheet.create({
	content: {
		paddingHorizontal: horizontalScale(8),
		paddingTop: verticalScale(10),
		paddingBottom: verticalScale(20),
	},
	summaryCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(16),
		borderWidth: 1,
		borderColor: "#EDEDED",
		padding: moderateScale(18),
		marginTop: verticalScale(20),
	},
	summaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: verticalScale(10),
	},
	label: {
		fontSize: moderateScale(13),
		color: "#999",
	},
	summaryValue: {
		fontSize: moderateScale(14),
		color: "#1A1A1A",
		maxWidth: "60%",
		textAlign: "right",
	},
	divider: {
		height: 1,
		backgroundColor: "#F0F0F0",
	},
	dividerThick: {
		height: 1.5,
		backgroundColor: "#E0E0E0",
	},
	inputLabel: {
		fontSize: moderateScale(13),
		color: "#666",
		marginBottom: verticalScale(6),
		marginTop: verticalScale(12),
	},
	input: {
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(14),
		borderWidth: 1,
		borderColor: "#EDEDED",
		paddingHorizontal: horizontalScale(16),
		paddingVertical: verticalScale(14),
		fontSize: moderateScale(15),
		color: "#1A1A1A",
	},
	errorText: {
		fontSize: moderateScale(12),
		color: "#E53935",
		marginTop: verticalScale(4),
	},
	row: {
		flexDirection: "row",
	},
	secureBadge: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: verticalScale(16),
	},
	bottomBar: {
		paddingHorizontal: horizontalScale(8),
		paddingTop: verticalScale(12),
		backgroundColor: "transparent",
	},
	payButton: {
		backgroundColor: "#000000",
		height: verticalScale(54),
		borderRadius: moderateScale(30),
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		alignItems: "center",
		justifyContent: "center",
	},
	processingCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(20),
		padding: moderateScale(36),
		alignItems: "center",
		width: horizontalScale(260),
	},
});
