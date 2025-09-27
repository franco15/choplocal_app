import { Container, Text } from "@/components";
import { images } from "@/constants/images";
import { useAuthContext } from "@/contexts/AuthContext";
import { regex } from "@/lib";
import { formatPhoneNumber } from "@/lib/utils";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
	Image,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	// SafeAreaView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";

export default function LoginScreen() {
	const router = useRouter();
	const { requestVerificationCode } = useAuthContext();
	const [phone, setPhone] = useState("");
	const [countryCode, setCountryCode] = useState<CountryCode>("US");
	const [callingCode, setCallingCode] = useState("+1");
	const [phoneError, setPhoneError] = useState(false);

	const onSend = async () => {
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
						<View className="flex-1 h-full px-5">
							<Image
								source={images.logoRed}
								className="w-[300px] h-[300px] mt-24 mb-24 self-center"
								resizeMode="contain"
							/>
							<View className="flex flex-row justify-between h-[62px] items-start">
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
										flex: 2,
										height: "100%",
										backgroundColor: "#EEEEEE",
										marginHorizontal: 2,
										borderRadius: 10,
										justifyContent: "center",
										paddingHorizontal: 15,
									}}
								/>
								<View className="flex-[4]">
									<TextInput
										className=" outline text-xl text-black h-full p-5 px-8 text-start bg-[#EEEEEE] mx-2"
										placeholder="(123) 456-7890"
										placeholderTextColor={"rgba(0, 0, 0, 0.3)"}
										value={phone}
										onChangeText={(text) => setPhone(formatPhoneNumber(text))}
										keyboardType="phone-pad"
										maxLength={14}
										style={[
											{ borderRadius: 10 },
											phoneError ? styles.phoneError : null,
										]}
									/>
									{phoneError && (
										<Text className="text-red-600 my-2 mx-3">
											{"Phone number is not valid"}
										</Text>
									)}
								</View>
							</View>
							<Link
								className={`${phoneError ? "mt-10" : "mt-2"} ml-2`}
								href="/register"
							>
								<Text className="text-[14px] text-[#B91E18] underline">
									Don't have an account? Create one
								</Text>
							</Link>
							<TouchableOpacity
								className={`bg-[#E3C6FB] ${
									phoneError ? "mt-16" : "mt-20"
								} w-1/2 h-[54px] items-center self-center justify-center rounded-[30px]`}
								activeOpacity={0.8}
								onPress={onSend}
							>
								<Text className="text-[14px]" style={{ color: "#000000" }}>
									Send Code
								</Text>
							</TouchableOpacity>
						</View>
					</TouchableWithoutFeedback>
				</ScrollView>
			</KeyboardAvoidingView>
		</Container>
	);
}

const styles = StyleSheet.create({
	phoneError: {
		borderWidth: 1,
		borderColor: "red",
	},
});
