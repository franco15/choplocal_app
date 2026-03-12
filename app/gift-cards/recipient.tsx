import { Container, Text, TextBold } from "@/components";
import {
	horizontalScale,
	moderateScale,
	verticalScale,
} from "@/lib/metrics";
import { formatPhoneNumber } from "@/lib/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text as RNText,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import CountrySelect, { ICountry } from "react-native-country-select";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const QUICK_MESSAGES = [
	"Enjoy!",
	"Happy Birthday!",
	"Treat yourself!",
	"From me to you",
];

export default function GiftCardRecipient() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { restaurantId, restaurantName, value, colorThemeId } =
		useLocalSearchParams<{
			restaurantId: string;
			restaurantName: string;
			value: string;
			colorThemeId: string;
		}>();

	const [phone, setPhone] = useState("");
	const [message, setMessage] = useState("");
	const [phoneError, setPhoneError] = useState("");
	const [showPicker, setShowPicker] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);

	const handleCountrySelect = (country: ICountry) => {
		setSelectedCountry(country);
	};

	const onSend = () => {
		if (!selectedCountry) {
			setPhoneError("Select a country code");
			return;
		}
		if (phone.replace(/\D/g, "").length < 10) {
			setPhoneError("Enter a valid phone number");
			return;
		}
		setPhoneError("");
		const fullPhone =
			selectedCountry.idd.root.replace(/\D/g, "") +
			phone.replace(/\D/g, "").slice(0, 10);
		router.push({
			pathname: "/gift-cards/payment",
			params: {
				restaurantId,
				restaurantName,
				value,
				recipientPhone: fullPhone,
				message,
				colorThemeId,
			},
		});
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
						keyboardShouldPersistTaps="handled"
						showsVerticalScrollIndicator={false}
					>
						{/* Mini gift card summary */}
						<MotiView
							from={{ opacity: 0, translateY: -10 }}
							animate={{ opacity: 1, translateY: 0 }}
							transition={{
								type: "timing",
								duration: 280,
							}}
						>
							<View style={styles.miniSummary}>
								<TextBold
									style={{
										fontSize: moderateScale(16),
										color: "#1A1A1A",
										flex: 1,
									}}
									numberOfLines={1}
								>
									{restaurantName}
								</TextBold>
								<TextBold
									style={{
										fontSize: moderateScale(15),
										color: "#1A1A1A",
									}}
								>
									${value}
								</TextBold>
							</View>
						</MotiView>

						{/* Title */}
						<MotiView
							from={{ opacity: 0, translateY: -8 }}
							animate={{ opacity: 1, translateY: 0 }}
							transition={{
								type: "timing",
								duration: 280,
								delay: 80,
							}}
						>
							<TextBold
								style={{
									fontSize: moderateScale(26),
									color: "#1A1A1A",
									marginTop: verticalScale(16),
								}}
							>
								Almost there!
							</TextBold>
							<Text
								style={{
									fontSize: moderateScale(14),
									color: "#888",
									marginTop: verticalScale(4),
								}}
							>
								Who gets this gift?
							</Text>
						</MotiView>

						{/* Phone input with country picker */}
						<MotiView
							from={{ opacity: 0, translateY: 8 }}
							animate={{ opacity: 1, translateY: 0 }}
							transition={{
								type: "timing",
								duration: 280,
								delay: 160,
							}}
						>
							<View style={{ marginTop: verticalScale(24) }}>
								<Text style={styles.inputLabel}>
									Phone Number
								</Text>
								<View style={styles.phoneRow}>
									{/* Country code picker */}
									<TouchableOpacity
										activeOpacity={0.8}
										onPress={() => setShowPicker(true)}
										style={styles.countryButton}
									>
										{selectedCountry ? (
											<>
												<RNText style={{ fontSize: moderateScale(16) }}>
													{selectedCountry.flag}
												</RNText>
												<Text
													style={{
														fontSize: moderateScale(14),
														color: "#1A1A1A",
														marginLeft: horizontalScale(4),
													}}
												>
													{selectedCountry.idd.root}
												</Text>
											</>
										) : (
											<Text
												style={{
													fontSize: moderateScale(14),
													color: "#999",
												}}
											>
												+1
											</Text>
										)}
									</TouchableOpacity>
									<CountrySelect
										visible={showPicker}
										onClose={() => setShowPicker(false)}
										onSelect={handleCountrySelect}
										popularCountries={["MX", "CA", "US"]}
										isFullScreen
										showCloseButton
									/>

									{/* Phone number input */}
									<TextInput
										value={phone}
										onChangeText={(t) => {
											setPhone(formatPhoneNumber(t));
											if (phoneError) setPhoneError("");
										}}
										placeholder="(555) 000-0000"
										placeholderTextColor="#BBB"
										keyboardType="phone-pad"
										maxLength={14}
										style={[
											styles.phoneInput,
											phoneError
												? { borderColor: "#E53935" }
												: {},
										]}
									/>
								</View>
								{phoneError ? (
									<Text
										style={{
											fontSize: moderateScale(12),
											color: "#E53935",
											marginTop: verticalScale(4),
										}}
									>
										{phoneError}
									</Text>
								) : null}
							</View>
						</MotiView>

						{/* Message section */}
						<MotiView
							from={{ opacity: 0, translateY: 8 }}
							animate={{ opacity: 1, translateY: 0 }}
							transition={{
								type: "timing",
								duration: 280,
								delay: 240,
							}}
						>
							<View style={{ marginTop: verticalScale(20) }}>
								<Text style={styles.inputLabel}>
									Message (optional)
								</Text>

								{/* Quick message chips */}
								<ScrollView
									horizontal
									showsHorizontalScrollIndicator={false}
									contentContainerStyle={{
										gap: horizontalScale(8),
										marginBottom: verticalScale(10),
									}}
								>
									{QUICK_MESSAGES.map((msg) => {
										const isSelected = message === msg;
										return (
											<Pressable
												key={msg}
												onPress={() =>
													setMessage(
														isSelected
															? ""
															: msg,
													)
												}
												style={[
													styles.chip,
													{
														backgroundColor:
															isSelected
																? "#1A1A1A"
																: "#F5F5F5",
														borderColor:
															isSelected
																? "#1A1A1A"
																: "#E8E8E8",
													},
												]}
											>
												<Text
													style={{
														fontSize:
															moderateScale(
																12,
															),
														color: isSelected
															? "#FFFFFF"
															: "#666",
													}}
												>
													{msg}
												</Text>
											</Pressable>
										);
									})}
								</ScrollView>

								<TextInput
									value={message}
									onChangeText={setMessage}
									placeholder="Add a personal message..."
									placeholderTextColor="#BBB"
									multiline
									numberOfLines={3}
									style={[
										styles.input,
										{
											height: verticalScale(80),
											textAlignVertical: "top",
											paddingTop: verticalScale(14),
										},
									]}
								/>
							</View>
						</MotiView>
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
							onPress={onSend}
							style={styles.button}
						>
							<TextBold
								style={{
									fontSize: moderateScale(15),
									color: "#FFFFFF",
								}}
							>
								Review & Pay
							</TextBold>
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
		</Container>
	);
}

const styles = StyleSheet.create({
	content: {
		paddingHorizontal: horizontalScale(8),
		paddingTop: verticalScale(10),
		paddingBottom: verticalScale(20),
	},
	miniSummary: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: moderateScale(14),
		paddingHorizontal: horizontalScale(14),
		paddingVertical: verticalScale(12),
		gap: horizontalScale(10),
	},
	inputLabel: {
		fontSize: moderateScale(13),
		color: "#666",
		marginBottom: verticalScale(8),
	},
	phoneRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: horizontalScale(10),
	},
	countryButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(14),
		borderWidth: 1,
		borderColor: "#EDEDED",
		paddingHorizontal: horizontalScale(12),
		height: verticalScale(50),
		minWidth: horizontalScale(72),
	},
	phoneInput: {
		flex: 1,
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(14),
		borderWidth: 1,
		borderColor: "#EDEDED",
		paddingHorizontal: horizontalScale(16),
		paddingVertical: verticalScale(14),
		fontSize: moderateScale(15),
		color: "#1A1A1A",
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
	chip: {
		paddingHorizontal: horizontalScale(14),
		paddingVertical: verticalScale(8),
		borderRadius: moderateScale(20),
		borderWidth: 1,
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
