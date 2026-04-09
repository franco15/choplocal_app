import { Text, TextBold } from "@/components";
import { useSuggestionContext } from "@/contexts/SuggestionsContext";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import {
	Alert,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SuggestRestaurantScreen() {
	const router = useRouter();
	const navigation = useNavigation();
	const insets = useSafeAreaInsets();
	const { createSuggestion } = useSuggestionContext();

	const [name, setName] = useState("");
	const [city, setCity] = useState("");
	const [reason, setReason] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		if (submitted) {
			navigation.setOptions({ headerShown: false });
		}
	}, [submitted]);

	const canSubmit = name.trim().length > 0 && city.trim().length > 0;

	const onSubmit = async () => {
		if (!canSubmit) {
			Alert.alert(
				"Missing fields",
				"Please fill in the restaurant name and city.",
			);
			return;
		}

		setIsSubmitting(true);
		Keyboard.dismiss();

		createSuggestion(name.trim(), city.trim(), reason.trim());

		setIsSubmitting(false);
		setSubmitted(true);
	};

	if (submitted) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: "#b42406",
					paddingHorizontal: horizontalScale(32),
				}}
			>
				<View
					style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
				>
					<MotiView
						from={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ type: "spring", damping: 12, stiffness: 120 }}
					>
						<Ionicons
							name="checkmark"
							size={moderateScale(80)}
							color="#FFFFFF"
						/>
					</MotiView>
					<MotiView
						from={{ opacity: 0, translateY: 10 }}
						animate={{ opacity: 1, translateY: 0 }}
						transition={{ type: "timing", duration: 300, delay: 200 }}
					>
						<TextBold
							style={{
								fontSize: moderateScale(44),
								color: "#FFFFFF",
								textAlign: "center",
								marginTop: verticalScale(24),
							}}
						>
							Thank you!
						</TextBold>
						<Text
							style={{
								fontSize: moderateScale(16),
								color: "rgba(255,255,255,0.85)",
								textAlign: "center",
								marginTop: verticalScale(14),
								lineHeight: moderateScale(24),
							}}
						>
							You're helping the foodie fam discover{"\n"}their next favorite
							spot!
						</Text>
					</MotiView>
				</View>
				<MotiView
					from={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ type: "timing", duration: 300, delay: 500 }}
				>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => router.back()}
						style={{
							marginBottom: insets.bottom + verticalScale(20),
							backgroundColor: "#FFFFFF",
							height: verticalScale(50),
							borderRadius: moderateScale(25),
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<TextBold style={{ color: "#b42406", fontSize: moderateScale(15) }}>
							Back to Profile
						</TextBold>
					</TouchableOpacity>
				</MotiView>
			</View>
		);
	}

	return (
		<View style={[styles.root]}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.scrollContent}
					>
						<TextBold style={styles.title}>Suggest a{"\n"}Restaurant</TextBold>
						<Text style={styles.subtitle}>
							Which restaurant would you like to see on Chop Local?
						</Text>

						{/* Form */}
						<View style={styles.formCard}>
							<Text style={styles.label}>Restaurant Name *</Text>
							<TextInput
								style={styles.input}
								placeholder="e.g. Tacos El Pastor"
								placeholderTextColor="#CCC"
								value={name}
								onChangeText={setName}
								returnKeyType="next"
							/>

							<Text style={[styles.label, { marginTop: verticalScale(18) }]}>
								City *
							</Text>
							<TextInput
								style={styles.input}
								placeholder="e.g. Monterrey"
								placeholderTextColor="#CCC"
								value={city}
								onChangeText={setCity}
								returnKeyType="next"
							/>

							<Text style={[styles.label, { marginTop: verticalScale(18) }]}>
								Why do you recommend it?
							</Text>
							<TextInput
								style={[styles.input, styles.inputMultiline]}
								placeholder="Great tacos, amazing atmosphere..."
								placeholderTextColor="#CCC"
								value={reason}
								onChangeText={setReason}
								multiline
								numberOfLines={4}
								textAlignVertical="top"
							/>
						</View>

						{/* Submit */}
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={onSubmit}
							disabled={!canSubmit || isSubmitting}
							style={[
								styles.submitBtn,
								(!canSubmit || isSubmitting) && styles.submitBtnDisabled,
							]}
						>
							<TextBold style={styles.submitBtnText}>
								{isSubmitting ? "Submitting..." : "Submit Suggestion"}
							</TextBold>
						</TouchableOpacity>
					</ScrollView>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	scrollContent: {
		paddingHorizontal: horizontalScale(16),
		paddingBottom: verticalScale(60),
	},
	androidHeader: {
		marginBottom: verticalScale(8),
	},
	title: {
		fontSize: moderateScale(30),
		color: "#1A1A1A",
		lineHeight: moderateScale(38),
		marginBottom: verticalScale(8),
	},
	subtitle: {
		fontSize: moderateScale(15),
		color: "#888",
		marginBottom: verticalScale(28),
		lineHeight: moderateScale(22),
	},

	/* Form */
	formCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(16),
		borderWidth: 1,
		borderColor: "#EDEDED",
		padding: moderateScale(20),
		marginBottom: verticalScale(24),
	},
	label: {
		fontSize: moderateScale(13),
		color: "#555",
		marginBottom: verticalScale(6),
		marginLeft: horizontalScale(4),
	},
	input: {
		backgroundColor: "#F8F8F8",
		borderRadius: moderateScale(12),
		borderWidth: 1,
		borderColor: "#EDEDED",
		paddingHorizontal: horizontalScale(14),
		paddingVertical: verticalScale(12),
		fontSize: moderateScale(15),
		color: "#1A1A1A",
	},
	inputMultiline: {
		minHeight: verticalScale(100),
		paddingTop: verticalScale(12),
	},

	/* Submit */
	submitBtn: {
		backgroundColor: "#b42406",
		height: verticalScale(54),
		borderRadius: moderateScale(30),
		alignItems: "center",
		justifyContent: "center",
	},
	submitBtnDisabled: {
		opacity: 0.4,
	},
	submitBtnText: {
		color: "#FFFFFF",
		fontSize: moderateScale(15),
	},

	/* Success */
	successContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: horizontalScale(32),
	},
	successCircle: {
		width: moderateScale(90),
		height: moderateScale(90),
		borderRadius: moderateScale(45),
		backgroundColor: "#438989",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: verticalScale(24),
	},
	successTitle: {
		fontSize: moderateScale(28),
		color: "#1A1A1A",
		textAlign: "center",
		marginBottom: verticalScale(10),
	},
	successSub: {
		fontSize: moderateScale(15),
		color: "#888",
		textAlign: "center",
		lineHeight: moderateScale(22),
	},
	successBtn: {
		marginTop: verticalScale(32),
		backgroundColor: "#1A1A1A",
		height: verticalScale(50),
		paddingHorizontal: horizontalScale(32),
		borderRadius: moderateScale(25),
		alignItems: "center",
		justifyContent: "center",
	},
	successBtnText: {
		color: "#FFFFFF",
		fontSize: moderateScale(15),
	},
});
