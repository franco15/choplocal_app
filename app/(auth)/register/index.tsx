import { Text, TextBold } from "@/components";
import { regex } from "@/lib";
import { formatPhoneNumber } from "@/lib/utils";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";

export default function SignUpScreen() {
	const router = useRouter();
	const [phone, setPhone] = useState("");
	const [countryCode, setCountryCode] = useState<CountryCode>("US");
	const [callingCode, setCallingCode] = useState("+1");
	const [phoneError, setPhoneError] = useState(false);

	const onSend = () => {
		if (!regex.phone.test(phone)) return setPhoneError(true);
		router.navigate("/register/verify");
	};
	return (
		<View className="flex h-full px-4 bg-background">
			<TextBold className="text-[35px] mb-3 mx-1" style={{ color: "#1A1C20" }}>
				Lets get started !
			</TextBold>
			<Text className="text-[14px] mb-10" style={{ color: "#93969E" }}>
				Enter your phone number.We will send you a confirmation code there
			</Text>
			<View className="flex flex-row justify-between h-[62px] items-center">
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
				<TextInput
					className="flex-[4] outline text-xl text-black h-full p-5 px-8 text-start bg-[#EEEEEE] mx-2"
					placeholder="(123) 456-7890"
					placeholderTextColor={"rgba(0, 0, 0, 0.3)"}
					value={phone}
					onChangeText={(text) => setPhone(formatPhoneNumber(text))}
					keyboardType="phone-pad"
					maxLength={14}
					style={[{ borderRadius: 10 }, phoneError ? styles.phoneError : null]}
				/>
			</View>
			<Link
				className="mt-6 items-center justify-center"
				// activeOpacity={0.8}
				// href="/sign-in"
				href="/login"
			>
				<TextBold className="text-[14px] underline" style={{}}>
					Already have an account? Log in
				</TextBold>
			</Link>
			<TouchableOpacity
				className="bg-[#B91E18] mt-40 w-1/2 h-[54px] self-center items-center justify-center rounded-[30px]"
				activeOpacity={0.8}
				onPress={onSend}
			>
				<Text className="text-[14px]" style={{ color: "#FFFFFF" }}>
					Send code
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	phoneError: {
		borderWidth: 1,
		borderColor: "red",
	},
});
