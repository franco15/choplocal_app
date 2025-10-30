import { Text, TextBold } from "@/components";
import { useAuthContext } from "@/contexts/AuthContext";
import { regex } from "@/lib";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { formatPhoneNumber } from "@/lib/utils";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
	Keyboard,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";

export default function SignUpScreen() {
	const router = useRouter();
	const { requestVerificationCode } = useAuthContext();
	const [phoneNumber, setPhoneNumber] = useState("");
	const [countryCode, setCountryCode] = useState<CountryCode>("US");
	const [callingCode, setCallingCode] = useState("+1");
	const [phoneError, setPhoneError] = useState(false);

	const onSend = async () => {
		if (!regex.phone.test(phoneNumber)) return setPhoneError(true);
		const fullPhone =
			callingCode.replace(/\D/g, "") +
			phoneNumber.replace(/\D/g, "").slice(0, 10);
		requestVerificationCode(fullPhone);
		router.navigate("/register/verify");
	};
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View
				className="flex h-full bg-background"
				style={{ paddingHorizontal: horizontalScale(20) }}
			>
				<TextBold
					className=""
					style={{
						color: "#1A1C20",
						fontSize: moderateScale(35),
						marginBottom: verticalScale(12),
						marginHorizontal: horizontalScale(5),
					}}
				>
					Lets get started !
				</TextBold>
				<Text
					className=""
					style={{
						color: "#93969E",
						fontSize: moderateScale(14),
						marginBottom: verticalScale(30),
					}}
				>
					Enter your phone number.We will send you a confirmation code there
				</Text>
				<View
					className="flex flex-row justify-between items-start"
					style={{ height: verticalScale(50) }}
				>
					<View className="w-[27%]">
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
					<View className="w-[71%]">
						<TextInput
							className="outline text-black h-full text-start bg-[#EEEEEE]"
							placeholder="(123) 456-7890"
							placeholderTextColor={"rgba(0, 0, 0, 0.3)"}
							value={phoneNumber}
							onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
							keyboardType="phone-pad"
							maxLength={14}
							style={[
								{
									borderRadius: 10,
									fontSize: moderateScale(15),
									paddingVertical: verticalScale(10),
									paddingHorizontal: horizontalScale(25),
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
					className={`items-center justify-center`}
					href="/login"
					style={{
						marginTop: phoneError ? verticalScale(30) : verticalScale(10),
						marginLeft: horizontalScale(10),
					}}
				>
					<Text
						className="text-[#B91E18] underline"
						style={{ fontSize: moderateScale(14) }}
					>
						Already have an account? Log in
					</Text>
				</Link>
				<TouchableOpacity
					className="bg-[#E3C6FB] w-1/2 self-center items-center justify-center"
					activeOpacity={0.8}
					onPress={onSend}
					style={{
						marginTop: verticalScale(150),
						height: verticalScale(54),
						borderRadius: moderateScale(30),
					}}
				>
					<Text
						className=""
						style={{ color: "#000000", fontSize: moderateScale(14) }}
					>
						Send code
					</Text>
				</TouchableOpacity>
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	phoneError: {
		borderWidth: 1,
		borderColor: "red",
	},
});
