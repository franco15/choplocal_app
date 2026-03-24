import { Container, Text, TextBold } from "@/components";
import ChopLogoVertical from "@/constants/svgs/ChopLogoVertical";
import { useAuthContext } from "@/contexts/AuthContext";
import { regex } from "@/lib";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { formatPhoneNumber } from "@/lib/utils";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
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
// import CountryPicker, { CountryCode } from "react-native-country-picker-modal";
import CountrySelect, { ICountry } from "react-native-country-select";
import Modal from "react-native-modal";

export default function LoginScreen() {
	const router = useRouter();
	const {
		requestVerificationCode,
		showDeletedUserAlert,
		setShowDeletedUserAlert,
	} = useAuthContext();
	const [phone, setPhone] = useState("");
	const [phoneError, setPhoneError] = useState(false);
	const [showPicker, setShowPicker] = useState<boolean>(false);
	const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);

	const handleCountrySelect = (country: ICountry) => {
		setSelectedCountry(country);
	};

	const onSend = async () => {
		if (!regex.phone.test(phone) || !selectedCountry)
			return setPhoneError(true);
		const fullPhone =
			selectedCountry.idd.root.replace(/\D/g, "") +
			phone.replace(/\D/g, "").slice(0, 10);
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
							<View style={{
								alignSelf: "center",
								marginTop: verticalScale(75),
								marginBottom: verticalScale(75),
							}}>
								<ChopLogoVertical
									width={horizontalScale(200)}
									height={verticalScale(248)}
								/>
							</View>
							<View
								className="flex flex-row justify-between items-start"
								style={{ height: verticalScale(50) }}
							>
								<View className="w-[30%]">
									<TouchableOpacity
										className="flex flex-row bg-[#EEEEEE] h-full items-center"
										activeOpacity={0.8}
										onPress={() => setShowPicker(true)}
										style={{
											borderRadius: moderateScale(10),
											paddingVertical: verticalScale(10),
											paddingHorizontal: "auto",
											justifyContent: "center",
										}}
									>
										{selectedCountry ? (
											<>
												<Text
													style={{
														fontSize: moderateScale(15),
														marginRight: horizontalScale(10),
													}}
												>
													{selectedCountry?.flag}
												</Text>
												<Text style={{ fontSize: moderateScale(15) }}>
													{selectedCountry?.idd.root}
												</Text>
											</>
										) : (
											<Text className="text-[#000000] opacity-[0.3]">+1</Text>
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
								className={`w-1/2 items-center self-center justify-center`}
								activeOpacity={0.8}
								onPress={onSend}
								style={{
									marginTop: verticalScale(60),
									height: verticalScale(54),
									borderRadius: moderateScale(30),
									backgroundColor: "#b42406",
								}}
							>
								<Text
									className=""
									style={{ color: "#FFFFFF", fontSize: moderateScale(14) }}
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
