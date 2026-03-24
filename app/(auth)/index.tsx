import { Container, Text } from "@/components";
import ChopLogoVertical from "@/constants/svgs/ChopLogoVertical";
import { useAuthContext } from "@/contexts/AuthContext";
import { regex } from "@/lib";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { CountryCode } from "react-native-country-picker-modal";

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
							<Link href="/register" asChild>
								<Pressable
									className={`w-2/3 flex self-center items-center justify-center`}
									style={{
										marginTop: verticalScale(60),
										height: verticalScale(54),
										borderRadius: moderateScale(30),
										backgroundColor: "#b42406",
									}}
								>
									<Text
										className="text-center"
										style={{ color: "#FFFFFF", fontSize: moderateScale(14) }}
									>
										Create an account
									</Text>
								</Pressable>
							</Link>
							<Link href="/login" asChild>
								<Pressable
									className={`w-2/3 flex self-center items-center justify-center`}
									style={{
										marginTop: verticalScale(30),
										height: verticalScale(54),
										borderRadius: moderateScale(30),
										backgroundColor: "#b42406",
									}}
								>
									<Text
										className="text-center"
										style={{ color: "#FFFFFF", fontSize: moderateScale(14) }}
									>
										Log in
									</Text>
								</Pressable>
							</Link>
						</View>
					</TouchableWithoutFeedback>
				</ScrollView>
			</KeyboardAvoidingView>
		</Container>
	);
}
