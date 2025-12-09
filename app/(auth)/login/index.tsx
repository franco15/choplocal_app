import { Container, Text, TextBold } from "@/components";
import { images } from "@/constants/images";
import { useAuthContext } from "@/contexts/AuthContext";
import { regex } from "@/lib";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { formatPhoneNumber } from "@/lib/utils";
import Checkbox from "expo-checkbox";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
	Image,
	Keyboard,
	KeyboardAvoidingView,
	Linking,
	Platform,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";
import Modal from "react-native-modal";

export default function LoginScreen() {
	const router = useRouter();
	const {
		requestVerificationCode,
		showDeletedUserAlert,
		setShowDeletedUserAlert,
	} = useAuthContext();
	const [phone, setPhone] = useState("");
	const [countryCode, setCountryCode] = useState<CountryCode>("US");
	const [callingCode, setCallingCode] = useState("+1");
	const [phoneError, setPhoneError] = useState(false);
	const [isChecked, setChecked] = useState(false);
	const [checkError, setCheckError] = useState(false);

	const onSend = async () => {
		if (!isChecked) return setCheckError(true);
		if (!regex.phone.test(phone)) return setPhoneError(true);
		const fullPhone =
			callingCode.replace(/\D/g, "") + phone.replace(/\D/g, "").slice(0, 10);
		requestVerificationCode(fullPhone);
		router.navigate("/login/verify");
	};

	return (
		<Container useGradient={false}>
			<KeyboardAvoidingView
				behavior={Platform.OS == "ios" ? "padding" : "height"}
			>
				<ScrollView>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View
							className="flex-1 h-full"
							style={{ paddingHorizontal: horizontalScale(20) }}
						>
							<Image
								source={images.logoRed}
								className="self-center"
								style={{
									width: horizontalScale(275),
									height: verticalScale(275),
									marginTop: verticalScale(75),
									marginBottom: verticalScale(75),
								}}
								resizeMode="contain"
							/>
							<View
								className="flex flex-row justify-between items-start"
								style={{ height: verticalScale(50) }}
							>
								<View className="w-[30%]">
									<CountryPicker
										countryCode={countryCode}
										withCallingCodeButton
										onSelect={(country) => {
											setCountryCode(country.cca2);
											setCallingCode(country.callingCode[0]);
										}}
										withFlag
										withCallingCode
										withFilter
										preferredCountries={["US", "MX", "CA", "GB"]}
										containerButtonStyle={{
											width: "100%",
											height: "100%",
											alignItems: "center",
											backgroundColor: "#EEEEEE",
											marginHorizontal: horizontalScale(2),
											borderRadius: moderateScale(10),
											justifyContent: "center",
											paddingHorizontal: horizontalScale(10),
										}}
									/>
								</View>
								<View className="w-[68%]">
									<TextInput
										className=" outline text-black h-full text-start bg-[#EEEEEE]"
										placeholder="(123) 456-7890"
										placeholderTextColor={"rgba(0, 0, 0, 0.3)"}
										value={phone}
										onChangeText={(text) => setPhone(formatPhoneNumber(text))}
										keyboardType="phone-pad"
										maxLength={14}
										style={[
											{
												borderRadius: moderateScale(10),
												fontSize: moderateScale(15),
												paddingVertical: verticalScale(10),
												paddingHorizontal: horizontalScale(20),
												letterSpacing: moderateScale(3),
											},
											phoneError ? styles.phoneError : null,
										]}
									/>
									{phoneError && (
										<Text
											className="text-red-600"
											style={{
												fontSize: moderateScale(13),
												marginVertical: verticalScale(5),
												marginHorizontal: horizontalScale(15),
											}}
										>
											{"Phone number is not valid"}
										</Text>
									)}
								</View>
							</View>
							<View className="flex flex-row items-center mt-5">
								<Checkbox
									value={isChecked}
									onValueChange={setChecked}
									style={{ marginRight: horizontalScale(10) }}
									color={isChecked ? "#B91E18" : undefined}
								/>
								<Text
									style={{
										fontSize: moderateScale(14),
										color: checkError ? "#FF0000" : "#000000",
									}}
									className=""
								>
									By signing up, you agree to our{" "}
									<Text
										onPress={() =>
											Linking.openURL(
												"https://www.choplocally.com/terms-and-conditions"
											)
										}
										className="text-[#B91E18] underline"
										style={{ fontSize: moderateScale(14) }}
									>
										Terms and conditions
									</Text>{" "}
									and{" "}
									<Text
										onPress={() =>
											Linking.openURL(
												"https://www.choplocally.com/privacy-policy"
											)
										}
										className="text-[#B91E18] underline"
										style={{ fontSize: moderateScale(14) }}
									>
										Privacy policy
									</Text>
								</Text>
							</View>
							<Link
								className=""
								style={{
									marginTop: phoneError ? verticalScale(30) : verticalScale(10),
									marginLeft: horizontalScale(10),
								}}
								href="/register"
							>
								<Text
									className="text-[#B91E18] underline"
									style={{ fontSize: moderateScale(14) }}
								>
									Don't have an account? Create one
								</Text>
							</Link>
							<TouchableOpacity
								className={`bg-[#E3C6FB] w-1/2 items-center self-center justify-center`}
								activeOpacity={0.8}
								onPress={onSend}
								style={{
									marginTop: verticalScale(60),
									height: verticalScale(54),
									borderRadius: moderateScale(30),
								}}
							>
								<Text
									className=""
									style={{ color: "#000000", fontSize: moderateScale(14) }}
								>
									Send Code
								</Text>
							</TouchableOpacity>
						</View>
					</TouchableWithoutFeedback>
				</ScrollView>
			</KeyboardAvoidingView>
			<Modal
				isVisible={showDeletedUserAlert}
				onBackdropPress={() => setShowDeletedUserAlert(false)}
				animationIn="slideInUp"
				animationOut="slideOutDown"
				useNativeDriver
				hideModalContentWhileAnimating
				backdropOpacity={0}
				style={{
					margin: 0,
					alignItems: "center",
					justifyContent: "flex-end",
					marginBottom: verticalScale(50),
				}}
			>
				<View
					className={`flex bg-white w-[90%] justify-center items-center`}
					style={{
						elevation: 5,
						borderWidth: 1,
						borderColor: "rgba(0, 0, 0, 0.2)",
						height: verticalScale(275),
						borderRadius: moderateScale(30),
						paddingHorizontal: horizontalScale(40),
					}}
				>
					<TextBold
						className="text-center"
						style={{
							fontSize: moderateScale(20),
							marginBottom: verticalScale(20),
						}}
					>
						Your account has been successfully deleted.
					</TextBold>
					<TouchableOpacity
						className="bg-[#E3C6FB] w-1/2 flex items-center justify-center"
						activeOpacity={0.8}
						onPress={() => setShowDeletedUserAlert(false)}
						style={{
							height: verticalScale(50),
							borderRadius: moderateScale(30),
							marginTop: verticalScale(10),
						}}
					>
						<Text
							className=""
							style={{
								fontSize: moderateScale(14),
								paddingTop: Platform.OS === "ios" ? verticalScale(10) : 0,
							}}
						>
							Ok
						</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		</Container>
	);
}

const styles = StyleSheet.create({
	phoneError: {
		borderWidth: 1,
		borderColor: "red",
	},
});
