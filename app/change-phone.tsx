import { Text, TextBold } from "@/components";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { useUserApi } from "@/lib/api/useApi";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { isNullOrWhitespace } from "@/lib/utils";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Keyboard,
	Platform,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const RESEND_TIME = 45;

export default function ChangePhoneScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { user } = useUserContext();
	const { logout } = useAuthContext();
	const userApi = useUserApi();

	const [step, setStep] = useState<"phone" | "code">("phone");
	const [newPhone, setNewPhone] = useState("");
	const [code, setCode] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [timer, setTimer] = useState(0);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (timer > 0) {
			interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
			return () => clearInterval(interval);
		}
	}, [timer]);

	const onSendCode = useCallback(async () => {
		if (isNullOrWhitespace(newPhone) || newPhone.length < 10) {
			setError("Enter a valid phone number");
			return;
		}
		setLoading(true);
		setError("");
		try {
			await userApi.requestPhoneChangeCode(user!.id, newPhone);
			setStep("code");
			setTimer(RESEND_TIME);
		} catch (err: any) {
			const msg = err?.response?.data?.message ?? err?.message ?? "Error sending code";
			setError(msg);
		} finally {
			setLoading(false);
		}
	}, [newPhone, user]);

	const onVerifyAndUpdate = useCallback(async () => {
		if (isNullOrWhitespace(code) || code.length < 6) {
			setError("Enter the 6-digit code");
			return;
		}
		setLoading(true);
		setError("");
		try {
			await userApi.updatePhoneNumber(user!.id, newPhone, code);
			Alert.alert(
				"Phone updated",
				"Your phone number has been changed. You will need to log in again with your new number.",
				[
					{
						text: "OK",
						onPress: async () => {
							await logout();
						},
					},
				],
			);
		} catch (err: any) {
			const msg = err?.response?.data?.message ?? err?.message ?? "Error updating phone";
			setError(msg);
		} finally {
			setLoading(false);
		}
	}, [code, newPhone, user]);

	const onResend = useCallback(async () => {
		if (timer > 0) return;
		setLoading(true);
		try {
			await userApi.requestPhoneChangeCode(user!.id, newPhone);
			setTimer(RESEND_TIME);
		} catch {
			// silently fail
		} finally {
			setLoading(false);
		}
	}, [timer, newPhone, user]);

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View
				style={[
					styles.root,
					{
						paddingTop:
							Platform.OS === "ios" ? 0 : insets.top + verticalScale(16),
					},
				]}
			>
				<View style={styles.content}>
					{step === "phone" ? (
						<>
							<TextBold style={styles.title}>Change Phone Number</TextBold>
							<Text style={styles.subtitle}>
								Enter your new phone number. We'll send a verification code to confirm it's yours.
							</Text>

							<Text style={styles.label}>Current number</Text>
							<View style={styles.currentPhone}>
								<Text style={styles.currentPhoneText}>{user?.phoneNumber}</Text>
							</View>

							<Text style={styles.label}>New phone number</Text>
							<TextInput
								style={[styles.input, error ? styles.inputError : null]}
								value={newPhone}
								onChangeText={(t) => {
									setNewPhone(t.replace(/[^0-9+]/g, ""));
									setError("");
								}}
								placeholder="+1 (123) 456-7890"
								keyboardType="phone-pad"
								maxLength={15}
								autoFocus
							/>

							{error ? <Text style={styles.errorText}>{error}</Text> : null}
						</>
					) : (
						<>
							<TextBold style={styles.title}>Verify Code</TextBold>
							<Text style={styles.subtitle}>
								We sent a 6-digit code to{"\n"}
								<TextBold style={styles.subtitle}>{newPhone}</TextBold>
							</Text>

							<TextInput
								style={[styles.codeInput, error ? styles.inputError : null]}
								value={code}
								onChangeText={(t) => {
									setCode(t.replace(/[^0-9]/g, ""));
									setError("");
								}}
								keyboardType="number-pad"
								maxLength={6}
								autoFocus
								textAlign="center"
							/>

							{error ? <Text style={styles.errorText}>{error}</Text> : null}

							<View style={styles.resendRow}>
								<Text style={styles.resendText}>Didn't get the code? </Text>
								<TouchableOpacity onPress={onResend} disabled={timer > 0}>
									<TextBold
										style={[
											styles.resendBtn,
											timer > 0 && { color: "#CCC" },
										]}
									>
										Resend {timer > 0 ? `(${timer})` : ""}
									</TextBold>
								</TouchableOpacity>
							</View>

							<TouchableOpacity
								onPress={() => {
									setStep("phone");
									setCode("");
									setError("");
								}}
							>
								<Text style={styles.changeNumber}>Use a different number</Text>
							</TouchableOpacity>
						</>
					)}
				</View>

				{/* Action button */}
				<View style={[styles.footer, { paddingBottom: insets.bottom + verticalScale(12) }]}>
					<TouchableOpacity
						activeOpacity={0.85}
						onPress={step === "phone" ? onSendCode : onVerifyAndUpdate}
						disabled={loading}
						style={[styles.actionBtn, loading && { opacity: 0.6 }]}
					>
						{loading ? (
							<ActivityIndicator color="#FFF" />
						) : (
							<TextBold style={styles.actionBtnText}>
								{step === "phone" ? "Send Code" : "Verify & Update"}
							</TextBold>
						)}
					</TouchableOpacity>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	content: {
		flex: 1,
		paddingHorizontal: horizontalScale(20),
	},
	title: {
		fontSize: moderateScale(28),
		color: "#1A1A1A",
		marginBottom: verticalScale(8),
	},
	subtitle: {
		fontSize: moderateScale(14),
		color: "#888",
		marginBottom: verticalScale(28),
		lineHeight: moderateScale(20),
	},
	label: {
		fontSize: moderateScale(13),
		color: "#999",
		marginBottom: verticalScale(6),
		marginLeft: horizontalScale(4),
	},
	currentPhone: {
		backgroundColor: "#F5F5F5",
		borderRadius: moderateScale(14),
		paddingHorizontal: horizontalScale(16),
		paddingVertical: verticalScale(14),
		marginBottom: verticalScale(18),
	},
	currentPhoneText: {
		fontSize: moderateScale(16),
		color: "#999",
	},
	input: {
		backgroundColor: "#F5F5F5",
		borderRadius: moderateScale(14),
		paddingHorizontal: horizontalScale(16),
		paddingVertical: verticalScale(14),
		fontSize: moderateScale(16),
		color: "#1A1A1A",
		marginBottom: verticalScale(8),
		fontFamily: "Inter",
	},
	inputError: {
		borderWidth: 1,
		borderColor: "#DC3545",
	},
	codeInput: {
		backgroundColor: "#F5F5F5",
		borderRadius: moderateScale(14),
		paddingHorizontal: horizontalScale(16),
		paddingVertical: verticalScale(18),
		fontSize: moderateScale(24),
		color: "#1A1A1A",
		letterSpacing: horizontalScale(20),
		marginBottom: verticalScale(8),
		fontFamily: "Inter",
	},
	errorText: {
		fontSize: moderateScale(13),
		color: "#DC3545",
		marginBottom: verticalScale(12),
		marginLeft: horizontalScale(4),
	},
	resendRow: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: verticalScale(24),
	},
	resendText: {
		fontSize: moderateScale(14),
		color: "#1A1A1A",
	},
	resendBtn: {
		fontSize: moderateScale(14),
		color: "#007AFF",
	},
	changeNumber: {
		fontSize: moderateScale(14),
		color: "#b42406",
		textAlign: "center",
		marginTop: verticalScale(16),
	},
	footer: {
		backgroundColor: "#FFFFFF",
		borderTopWidth: 1,
		borderTopColor: "#F0F0F0",
		paddingHorizontal: horizontalScale(20),
		paddingTop: verticalScale(12),
	},
	actionBtn: {
		backgroundColor: "#b42406",
		borderRadius: moderateScale(30),
		paddingVertical: verticalScale(16),
		alignItems: "center",
	},
	actionBtnText: {
		color: "#FFFFFF",
		fontSize: moderateScale(16),
	},
});
