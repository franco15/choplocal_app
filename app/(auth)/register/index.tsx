import { Text, TextBold } from "@/components";
import { useAuthContext } from "@/contexts/AuthContext";
import { regex } from "@/lib";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { formatPhoneNumber } from "@/lib/utils";
import { Checkbox } from "expo-checkbox";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
	Keyboard,
	Linking,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import CountrySelect, { ICountry } from "react-native-country-select";

export default function SignUpScreen() {
	const router = useRouter();
	const { requestVerificationCode } = useAuthContext();
	const [phoneNumber, setPhoneNumber] = useState("");
	const [phoneError, setPhoneError] = useState(false);
	const [isChecked, setChecked] = useState(false);
	const [checkError, setCheckError] = useState(false);
	const [showPicker, setShowPicker] = useState<boolean>(false);
	const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);

	const handleCountrySelect = (country: ICountry) => {
		setSelectedCountry(country);
	};

	const onSend = async () => {
		if (!isChecked) return setCheckError(true);
		if (!regex.phone.test(phoneNumber) || !selectedCountry)
			return setPhoneError(true);
		const fullPhone =
			selectedCountry.idd.root.replace(/\D/g, "") +
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
									"https://www.choplocally.com/terms-and-conditions",
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
								Linking.openURL("https://www.choplocally.com/privacy-policy")
							}
							className="text-[#B91E18] underline"
							style={{ fontSize: moderateScale(14) }}
						>
							Privacy policy
						</Text>
					</Text>
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
					className="w-1/2 self-center items-center justify-center"
					activeOpacity={0.8}
					onPress={onSend}
					style={{
						marginTop: verticalScale(150),
						height: verticalScale(54),
						borderRadius: moderateScale(30),
						backgroundColor: "#96190F",
					}}
				>
					<Text
						className=""
						style={{ color: "#FFFFFF", fontSize: moderateScale(14) }}
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
