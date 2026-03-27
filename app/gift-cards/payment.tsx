import { Container, Text, TextBold } from "@/components";
import { Lock } from "@/constants/svgs";
import { useGiftCardContext } from "@/contexts/GiftCardContext";
import { useUserContext } from "@/contexts/UserContext";
import { useStripeApi } from "@/lib/api/useApi";
import {
	horizontalScale,
	moderateScale,
	verticalScale,
} from "@/lib/metrics";
import { Ionicons } from "@expo/vector-icons";
import { useStripe } from "@stripe/stripe-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useCallback, useState } from "react";
import {
	ActivityIndicator,
	Modal,
	Platform,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Payment() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { user } = useUserContext();
	const { refreshGiftCards } = useGiftCardContext();
	const stripeApi = useStripeApi();
	const { initPaymentSheet, presentPaymentSheet } = useStripe();

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

	const [processing, setProcessing] = useState(false);
	const [error, setError] = useState("");

	const amount = Number(value) || 0;

	const onPay = useCallback(async () => {
		setProcessing(true);
		setError("");

		try {
			// Step 1: Create payment intent on backend
			const { clientSecret } = await stripeApi.createPaymentIntent({
				amount,
				restaurantId: restaurantId ?? "",
				senderId: user.id,
				receiverPhoneNumber: recipientPhone ?? "",
				message: message ?? "",
			});

			// Step 2: Initialize the payment sheet
			const { error: initError } = await initPaymentSheet({
				paymentIntentClientSecret: clientSecret,
				merchantDisplayName: "Chop Local",
				style: "automatic",
				defaultBillingDetails: {
					name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
					email: user.email ?? undefined,
				},
			});

			if (initError) {
				setError(initError.message ?? "Could not initialize payment.");
				setProcessing(false);
				return;
			}

			// Step 3: Present the payment sheet
			const { error: sheetError } = await presentPaymentSheet();

			if (sheetError) {
				if (sheetError.code === "Canceled") {
					// User cancelled — do nothing
					setProcessing(false);
					return;
				}
				setError(sheetError.message ?? "Payment failed. Please try again.");
				setProcessing(false);
				return;
			}

			// Step 4: Payment succeeded!
			refreshGiftCards();
			router.replace({
				pathname: "/gift-cards/success",
				params: {
					restaurantName,
					value,
					recipientPhone,
					colorThemeId,
					message: message ?? "",
				},
			});
		} catch (err: any) {
			const apiMessage = err?.response?.data?.message;
			setError(apiMessage ?? "Payment failed. Please try again.");
		} finally {
			setProcessing(false);
		}
	}, [amount, restaurantId, recipientPhone, message, user]);

	return (
		<Container style={{ paddingTop: 0 }}>
			<View style={{ flex: 1 }}>
				<ScrollView
					contentContainerStyle={styles.content}
					showsVerticalScrollIndicator={false}
				>
					{/* Header */}
					<MotiView
						from={{ opacity: 0, translateY: -10 }}
						animate={{ opacity: 1, translateY: 0 }}
						transition={{ type: "timing", duration: 300 }}
					>
						<TextBold style={styles.title}>Review & Pay</TextBold>
						<Text style={styles.subtitle}>
							Review your gift card details
						</Text>
					</MotiView>

					{/* Order Summary */}
					<MotiView
						from={{ opacity: 0, translateY: 10 }}
						animate={{ opacity: 1, translateY: 0 }}
						transition={{ type: "timing", duration: 300, delay: 100 }}
					>
						<View style={styles.summaryCard}>
							<View style={styles.summaryRow}>
								<Text style={styles.label}>Restaurant</Text>
								<TextBold style={styles.summaryValue} numberOfLines={1}>
									{restaurantName}
								</TextBold>
							</View>
							<View style={styles.divider} />
							<View style={styles.summaryRow}>
								<Text style={styles.label}>Gift Card</Text>
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
							{message ? (
								<>
									<View style={styles.divider} />
									<View style={styles.summaryRow}>
										<Text style={styles.label}>Message</Text>
										<Text style={[styles.summaryValue, { fontStyle: "italic" }]} numberOfLines={2}>
											"{message}"
										</Text>
									</View>
								</>
							) : null}
							<View style={styles.dividerThick} />
							<View style={styles.summaryRow}>
								<TextBold style={{ fontSize: moderateScale(15), color: "#1A1A1A" }}>
									Total
								</TextBold>
								<TextBold style={{ fontSize: moderateScale(22), color: "#1A1A1A" }}>
									${amount}.00
								</TextBold>
							</View>
						</View>
					</MotiView>

					{/* Payment Info */}
					<MotiView
						from={{ opacity: 0, translateY: 10 }}
						animate={{ opacity: 1, translateY: 0 }}
						transition={{ type: "timing", duration: 300, delay: 200 }}
					>
						<View style={styles.infoCard}>
							<Ionicons name="card-outline" size={moderateScale(20)} color="#888" />
							<Text style={styles.infoText}>
								You'll be asked to enter your card details securely via Stripe when you tap "Pay Now".
							</Text>
						</View>
					</MotiView>

					{/* Secure badge */}
					<View style={styles.secureBadge}>
						<Lock
							width={horizontalScale(14)}
							height={verticalScale(14)}
						/>
						<Text style={styles.secureText}>
							Secure payment powered by Stripe
						</Text>
					</View>

					{/* Error */}
					{error ? (
						<View style={styles.errorContainer}>
							<Ionicons name="alert-circle" size={moderateScale(16)} color="#E53935" />
							<Text style={styles.errorText}>{error}</Text>
						</View>
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
						style={[styles.payButton, processing && { opacity: 0.6 }]}
					>
						{processing ? (
							<ActivityIndicator color="#FFFFFF" />
						) : (
							<TextBold style={styles.payButtonText}>
								Pay Now — ${amount}.00
							</TextBold>
						)}
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
	title: {
		fontSize: moderateScale(26),
		color: "#1A1A1A",
	},
	subtitle: {
		fontSize: moderateScale(14),
		color: "#888",
		marginTop: verticalScale(4),
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
	infoCard: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F8F8F8",
		borderRadius: moderateScale(14),
		padding: moderateScale(16),
		marginTop: verticalScale(20),
		gap: horizontalScale(12),
	},
	infoText: {
		flex: 1,
		fontSize: moderateScale(13),
		color: "#888",
		lineHeight: moderateScale(19),
	},
	secureBadge: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: verticalScale(20),
	},
	secureText: {
		fontSize: moderateScale(12),
		color: "#AAA",
		marginLeft: horizontalScale(6),
	},
	errorContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: verticalScale(16),
		gap: horizontalScale(6),
	},
	errorText: {
		fontSize: moderateScale(13),
		color: "#E53935",
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
	payButtonText: {
		fontSize: moderateScale(16),
		color: "#FFFFFF",
	},
});
