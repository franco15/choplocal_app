import { Container, Text, TextBold } from "@/components";
import { Lock } from "@/constants/svgs";
import { useUserContext } from "@/contexts/UserContext";
import { useDropById } from "@/lib/api/queries/dropQueries";
import { queryClient, queryKeys } from "@/lib/api/queryClient";
import { useDropsApi } from "@/lib/api/useApi";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { formatPrice } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { CardForm, useStripe } from "@stripe/stripe-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MotiView } from "moti";
import { useCallback, useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const formatEventDate = (dateStr: string): string => {
	const date = new Date(dateStr);
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const months = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
	];
	const hours = date.getHours();
	const ampm = hours >= 12 ? "pm" : "am";
	const h = hours % 12 || 12;
	return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()} at ${h}${ampm}`;
};

export default function EventPayment() {
	const insets = useSafeAreaInsets();
	const { user } = useUserContext();
	const dropsApi = useDropsApi();
	const { confirmPayment } = useStripe();

	const { id } = useLocalSearchParams<{ id: string }>();
	const { data: event, isLoading } = useDropById(id, user.id);

	const [processing, setProcessing] = useState(false);
	const [error, setError] = useState("");
	const [cardComplete, setCardComplete] = useState(false);
	const [password, setPassword] = useState("");

	const onPay = useCallback(async () => {
		if (!event) return;
		if (!cardComplete) {
			setError("Please complete your card details.");
			return;
		}
		if (event.passwordProtected && password.trim().length === 0) {
			setError("This event requires a password.");
			return;
		}

		setProcessing(true);
		setError("");

		try {
			const { clientSecret } = await dropsApi.rsvpPaymentIntent(event.id, {
				userId: user.id,
				password: event.passwordProtected ? password : undefined,
			});

			const { error: confirmError, paymentIntent } = await confirmPayment(
				clientSecret,
				{ paymentMethodType: "Card" },
			);

			if (confirmError) {
				setError(confirmError.message ?? "Payment failed. Please try again.");
				setProcessing(false);
				return;
			}

			if (paymentIntent?.status === "Succeeded") {
				queryClient.invalidateQueries({ queryKey: queryKeys.drops.all });
				router.replace({
					pathname: "/events/rsvp-success",
					params: { id: event.id },
				});
			}
		} catch (err: any) {
			const apiMessage = err?.response?.data?.message;
			setError(apiMessage ?? "Payment failed. Please try again.");
		} finally {
			setProcessing(false);
		}
	}, [event, cardComplete, password, user, dropsApi, confirmPayment]);

	if (isLoading || !event) {
		return (
			<Container style={{ paddingTop: 0 }}>
				<View style={styles.centered}>
					<ActivityIndicator size="large" color="#1A1A1A" />
				</View>
			</Container>
		);
	}

	const priceLabel = formatPrice(event.price);

	return (
		<Container style={{ paddingTop: 0 }}>
			<View style={{ flex: 1 }}>
				<ScrollView
					contentContainerStyle={styles.content}
					showsVerticalScrollIndicator={false}
				>
					<MotiView
						from={{ opacity: 0, translateY: -10 }}
						animate={{ opacity: 1, translateY: 0 }}
						transition={{ type: "timing", duration: 300 }}
					>
						<TextBold style={styles.title}>Review & Pay</TextBold>
						<Text style={styles.subtitle}>Confirm your ticket details</Text>
					</MotiView>

					<MotiView
						from={{ opacity: 0, translateY: 10 }}
						animate={{ opacity: 1, translateY: 0 }}
						transition={{ type: "timing", duration: 300, delay: 100 }}
					>
						<View style={styles.summaryCard}>
							<View style={styles.summaryRow}>
								<Text style={styles.label}>Event</Text>
								<TextBold style={styles.summaryValue} numberOfLines={1}>
									{event.title}
								</TextBold>
							</View>
							<View style={styles.divider} />
							<View style={styles.summaryRow}>
								<Text style={styles.label}>Venue</Text>
								<TextBold style={styles.summaryValue} numberOfLines={1}>
									{event.restaurant.name}
								</TextBold>
							</View>
							<View style={styles.divider} />
							<View style={styles.summaryRow}>
								<Text style={styles.label}>Date</Text>
								<TextBold style={styles.summaryValue}>
									{formatEventDate(event.startDate)}
								</TextBold>
							</View>
							<View style={styles.dividerThick} />
							<View style={styles.summaryRow}>
								<TextBold
									style={{ fontSize: moderateScale(15), color: "#1A1A1A" }}
								>
									Total
								</TextBold>
								<TextBold
									style={{ fontSize: moderateScale(22), color: "#1A1A1A" }}
								>
									{priceLabel}
								</TextBold>
							</View>
						</View>
					</MotiView>

					{event.passwordProtected && (
						<MotiView
							from={{ opacity: 0, translateY: 10 }}
							animate={{ opacity: 1, translateY: 0 }}
							transition={{ type: "timing", duration: 300, delay: 150 }}
						>
							<TextBold style={styles.cardSectionTitle}>Event password</TextBold>
							<TextInput
								value={password}
								onChangeText={(t) => {
									setPassword(t);
									if (error) setError("");
								}}
								placeholder="Enter password"
								placeholderTextColor="#BBB"
								style={styles.passwordInput}
								secureTextEntry
								autoCapitalize="none"
								autoCorrect={false}
							/>
						</MotiView>
					)}

					<MotiView
						from={{ opacity: 0, translateY: 10 }}
						animate={{ opacity: 1, translateY: 0 }}
						transition={{ type: "timing", duration: 300, delay: 200 }}
					>
						<TextBold style={styles.cardSectionTitle}>Payment Method</TextBold>
						<CardForm
							autofocus={false}
							cardStyle={{
								backgroundColor: "#FFFFFF",
								textColor: "#1A1A1A",
								placeholderColor: "#C0C0C0",
								borderColor: "#E0E0E0",
								borderWidth: 1,
								borderRadius: 12,
								fontSize: 16,
								cursorColor: "#b42406",
								textErrorColor: "#E53935",
							}}
							style={styles.cardForm}
							onFormComplete={(details) => {
								setCardComplete(details.complete);
								if (error) setError("");
							}}
						/>
					</MotiView>

					<View style={styles.secureBadge}>
						<Lock width={horizontalScale(14)} height={verticalScale(14)} />
						<Text style={styles.secureText}>
							Secure payment powered by Stripe
						</Text>
					</View>

					{error ? (
						<View style={styles.errorContainer}>
							<Ionicons
								name="alert-circle"
								size={moderateScale(16)}
								color="#E53935"
							/>
							<Text style={styles.errorText}>{error}</Text>
						</View>
					) : null}
				</ScrollView>

				<View
					style={[
						styles.bottomBar,
						{
							paddingBottom:
								insets.bottom > 0 ? insets.bottom : verticalScale(16),
						},
					]}
				>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={onPay}
						disabled={processing || !cardComplete}
						style={[
							styles.payButton,
							(processing || !cardComplete) && { opacity: 0.6 },
						]}
					>
						{processing ? (
							<ActivityIndicator color="#FFFFFF" />
						) : (
							<TextBold style={styles.payButtonText}>
								Pay Now — {priceLabel}
							</TextBold>
						)}
					</TouchableOpacity>
				</View>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	centered: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
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
	cardSectionTitle: {
		fontSize: moderateScale(16),
		color: "#1A1A1A",
		marginTop: verticalScale(24),
		marginBottom: verticalScale(12),
	},
	passwordInput: {
		height: verticalScale(48),
		paddingHorizontal: horizontalScale(14),
		borderRadius: moderateScale(12),
		borderWidth: 1,
		borderColor: "#E0E0E0",
		backgroundColor: "#FAFAFA",
		fontSize: moderateScale(15),
		color: "#1A1A1A",
		fontFamily: "Inter_400Regular",
	},
	cardForm: {
		width: "100%",
		height: verticalScale(210),
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
