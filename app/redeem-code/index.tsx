import { Text, TextBold } from "@/components";
import { useRedeemCodeContext } from "@/contexts/RedeemCodeContext";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { Ionicons } from "@expo/vector-icons";
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RedeemCodeScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { redeemCode } = useRedeemCodeContext();

	const [code, setCode] = useState("");
	const [isValidating, setIsValidating] = useState(false);
	const [errorModal, setErrorModal] = useState({
		visible: false,
		title: "",
		message: "",
	});

	const errorSheetRef = useRef<BottomSheetModal>(null);

	useEffect(() => {
		if (errorModal.visible) errorSheetRef.current?.present();
		else errorSheetRef.current?.dismiss();
	}, [errorModal.visible]);

	const closeErrorModal = useCallback(() => {
		setErrorModal((prev) => ({ ...prev, visible: false }));
	}, []);

	const renderErrorBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				opacity={0.4}
				pressBehavior="close"
			/>
		),
		[],
	);

	const handleRedeem = async () => {
		if (!code.trim() || isValidating) return;
		Keyboard.dismiss();
		setIsValidating(true);

		const result = await redeemCode(code);
		setIsValidating(false);

		if (result.success) {
			Haptics.notificationAsync(
				Haptics.NotificationFeedbackType.Success,
			);

			router.push({
				pathname: "/redeem-code/success",
				params: {
					type: String(result.data.type),
					restaurantName: result.data.restaurantName,
					amount: result.data.amount != null ? String(result.data.amount) : "",
					senderName: result.data.senderName ?? "",
					code: result.data.code,
				},
			});
		} else {
			Haptics.notificationAsync(
				Haptics.NotificationFeedbackType.Error,
			);

			setErrorModal({
				visible: true,
				title: "Error",
				message: result.error,
			});
		}
	};

	return (
		<View style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				style={{ flex: 1 }}
			>
				{/* ── Main content ── */}
				<View style={styles.body}>
					{/* Icon + Title */}
					<MotiView
						from={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ type: "timing", duration: 400 }}
						style={styles.headerSection}
					>
						<View style={styles.heroIcon}>
							<Ionicons
								name="ticket-outline"
								size={44}
								color="#1A1A1A"
							/>
						</View>
						<TextBold style={styles.heroTitle}>
							Redeem a Code
						</TextBold>
						<Text style={styles.heroSubtitle}>
							Enter your gift card code{"\n"}below
						</Text>
					</MotiView>

					{/* ── Input ── */}
					<MotiView
						from={{ opacity: 0, translateY: 15 }}
						animate={{ opacity: 1, translateY: 0 }}
						transition={{
							type: "timing",
							duration: 350,
							delay: 150,
						}}
						style={styles.inputSection}
					>
						<TextBold style={styles.inputLabel}>
							Your Code
						</TextBold>
						<View style={styles.inputRow}>
							<TextInput
								style={styles.textInput}
								placeholder="e.g. ABC123"
								placeholderTextColor="rgba(0,0,0,0.25)"
								value={code}
								onChangeText={setCode}
								autoCapitalize="characters"
								autoCorrect={false}
								maxLength={20}
								returnKeyType="go"
								onSubmitEditing={handleRedeem}
								selectionColor="rgba(0,0,0,0.3)"
							/>
							{code.length > 0 && (
								<TouchableOpacity
									onPress={() => setCode("")}
									activeOpacity={0.6}
									style={styles.clearBtn}
								>
									<Ionicons
										name="close-circle"
										size={22}
										color="rgba(0,0,0,0.3)"
									/>
								</TouchableOpacity>
							)}
						</View>
					</MotiView>

					{/* ── Hint ── */}
					<MotiView
						from={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							type: "timing",
							duration: 300,
							delay: 350,
						}}
					>
						<Text style={styles.hint}>
							Codes are case-insensitive
						</Text>
					</MotiView>
				</View>

				{/* ── Bottom button (always at bottom) ── */}
				<MotiView
					from={{ opacity: 0, translateY: 20 }}
					animate={{ opacity: 1, translateY: 0 }}
					transition={{
						type: "timing",
						duration: 350,
						delay: 300,
					}}
					style={[
						styles.bottomSection,
						{ paddingBottom: insets.bottom + verticalScale(16) },
					]}
				>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={handleRedeem}
						disabled={!code.trim() || isValidating}
						style={[
							styles.redeemBtn,
							{
								opacity:
									!code.trim() || isValidating ? 0.5 : 1,
							},
						]}
					>
						{isValidating ? (
							<ActivityIndicator color="#b5c6f2" />
						) : (
							<TextBold style={styles.redeemBtnText}>
								Redeem
							</TextBold>
						)}
					</TouchableOpacity>
				</MotiView>
			</KeyboardAvoidingView>

			{/* ── Error Modal ── */}
			<BottomSheetModal
				ref={errorSheetRef}
				enableDynamicSizing
				enablePanDownToClose
				onDismiss={closeErrorModal}
				backdropComponent={renderErrorBackdrop}
				handleIndicatorStyle={styles.modalHandleIndicator}
				backgroundStyle={styles.modalSheetBackground}
			>
				<BottomSheetView style={styles.modalSheet}>
					<Ionicons
						name="alert-circle"
						size={moderateScale(48)}
						color="#e94848"
						style={{ marginBottom: verticalScale(12) }}
					/>

					<TextBold style={styles.modalTitle}>{errorModal.title}</TextBold>
					<Text style={styles.modalMessage}>{errorModal.message}</Text>

					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => errorSheetRef.current?.dismiss()}
						style={styles.modalBtn}
					>
						<TextBold style={styles.modalBtnText}>Got it</TextBold>
					</TouchableOpacity>
				</BottomSheetView>
			</BottomSheetModal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#b5c6f2",
	},

	/* ── Body ── */
	body: {
		flex: 1,
		paddingHorizontal: horizontalScale(24),
		justifyContent: "center",
	},

	/* ── Header / Title ── */
	headerSection: {
		alignItems: "center",
		marginBottom: verticalScale(40),
	},
	heroIcon: {
		width: moderateScale(80),
		height: moderateScale(80),
		borderRadius: moderateScale(40),
		backgroundColor: "rgba(0,0,0,0.06)",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: verticalScale(20),
	},
	heroTitle: {
		fontSize: moderateScale(32),
		color: "#1A1A1A",
		textAlign: "center",
	},
	heroSubtitle: {
		fontSize: moderateScale(15),
		color: "rgba(0,0,0,0.5)",
		textAlign: "center",
		marginTop: verticalScale(8),
		lineHeight: moderateScale(22),
	},

	/* ── Input ── */
	inputSection: {
		marginBottom: verticalScale(12),
	},
	inputLabel: {
		fontSize: moderateScale(13),
		color: "rgba(0,0,0,0.45)",
		marginBottom: verticalScale(10),
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	inputRow: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255,255,255,0.3)",
		borderRadius: moderateScale(16),
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.5)",
		paddingHorizontal: horizontalScale(16),
	},
	textInput: {
		flex: 1,
		height: verticalScale(56),
		fontSize: moderateScale(22),
		color: "#1A1A1A",
		fontFamily: "Inter_600SemiBold",
		letterSpacing: 2,
	},
	clearBtn: {
		padding: 6,
	},

	/* ── Hint ── */
	hint: {
		fontSize: moderateScale(12),
		color: "rgba(0,0,0,0.35)",
		textAlign: "center",
		marginTop: verticalScale(12),
	},

	/* ── Bottom button ── */
	bottomSection: {
		paddingHorizontal: horizontalScale(24),
		paddingTop: verticalScale(12),
	},
	redeemBtn: {
		backgroundColor: "#FFFFFF",
		height: verticalScale(56),
		borderRadius: moderateScale(30),
		alignItems: "center",
		justifyContent: "center",
	},
	redeemBtnText: {
		fontSize: moderateScale(16),
		color: "#5a6fa8",
	},

	/* ── Error modal ── */
	modalSheetBackground: {
		backgroundColor: "#FFFFFF",
		borderTopLeftRadius: moderateScale(28),
		borderTopRightRadius: moderateScale(28),
	},
	modalHandleIndicator: {
		backgroundColor: "#E0E0E0",
		width: horizontalScale(40),
		height: 4,
	},
	modalSheet: {
		paddingHorizontal: horizontalScale(28),
		paddingTop: verticalScale(14),
		paddingBottom: verticalScale(50),
		alignItems: "center",
	},
	modalTitle: {
		fontSize: moderateScale(22),
		color: "#1A1A1A",
		textAlign: "center",
	},
	modalMessage: {
		fontSize: moderateScale(15),
		color: "#888",
		textAlign: "center",
		marginTop: verticalScale(10),
		lineHeight: moderateScale(22),
		paddingHorizontal: horizontalScale(8),
	},
	modalBtn: {
		backgroundColor: "#000000",
		height: verticalScale(52),
		borderRadius: moderateScale(28),
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		marginTop: verticalScale(28),
	},
	modalBtnText: {
		fontSize: moderateScale(16),
		color: "#FFFFFF",
	},
});
