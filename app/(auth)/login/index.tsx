import { Container, Text } from "@/components";
import { useAuthContext } from "@/contexts/AuthContext";
import { formatPhoneNumber } from "@/lib/utils";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";

export default function LoginScreen() {
	const router = useRouter();
	const { login } = useAuthContext();
	const [phone, setPhone] = useState("");
	const [countryCode, setCountryCode] = useState<CountryCode>("US");
	const [callingCode, setCallingCode] = useState("+1");

	const onSend = async () => {
		const rawPhone = phone.replace(/\D/g, "");
		// await login(rawPhone);
		// send code
		router.navigate("/login/verify");
	};

	return (
		<Container>
			<View className="flex items-center justify-center h-full px-5">
				<Text className="text-5xl mb-10">Welcome Back!</Text>
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
						style={{ borderRadius: 10 }}
					/>
				</View>
				<TouchableOpacity
					className="bg-[#B91E18] mt-10 w-1/2 h-[54px] items-center justify-center rounded-[30px]"
					activeOpacity={0.8}
					onPress={onSend}
				>
					<Text className="text-[14px]" style={{ color: "#FFFFFF" }}>
						Send Code
					</Text>
				</TouchableOpacity>
				<Link
					className="mt-10 items-center justify-center"
					// activeOpacity={0.8}
					href="/register"
				>
					<Text className="text-[14px] underline" style={{}}>
						Create an account
					</Text>
				</Link>
			</View>
		</Container>
	);
}
