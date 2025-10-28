import { Text, TextBold } from "@/components";
import { useAuthContext } from "@/contexts/AuthContext";
import { regex } from "@/lib";
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
			<View className="flex h-full px-4 bg-background">
				<TextBold
					className="text-[35px] mb-3 mx-1"
					style={{ color: "#1A1C20" }}
				>
					Lets get started !
				</TextBold>
				<Text className="text-[14px] mb-10" style={{ color: "#93969E" }}>
					Enter your phone number.We will send you a confirmation code there
				</Text>
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
					<View className="flex-[4] ">
						<TextInput
							className="outline text-xl text-black h-full p-5 px-8 text-start bg-[#EEEEEE] mx-2"
							placeholder="(123) 456-7890"
							placeholderTextColor={"rgba(0, 0, 0, 0.3)"}
							value={phoneNumber}
							onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
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
					className={`${
						phoneError ? "mt-14" : "mt-6"
					} items-center justify-center`}
					href="/login"
				>
					<Text className="text-[14px] text-[#B91E18] underline" style={{}}>
						Already have an account? Log in
					</Text>
				</Link>
				<TouchableOpacity
					className="bg-[#E3C6FB] mt-52 w-1/2 h-[54px] self-center items-center justify-center rounded-[30px]"
					activeOpacity={0.8}
					onPress={onSend}
				>
					<Text className="text-[14px]" style={{ color: "#000000" }}>
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
