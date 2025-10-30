import { Text, TextBold } from "@/components";
import { useAuthContext } from "@/contexts/AuthContext";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { isNullOrWhitespace } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
	Keyboard,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";

const RESEND_TIME = 45;

export default function VerifyScreen() {
	const { verifyCode, phoneNumber, requestVerificationCode } = useAuthContext();
	const [code, setCode] = useState("");
	const [error, setError] = useState(false);
	const [timer, setTimer] = useState(RESEND_TIME);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (timer > 0) {
			interval = setInterval(() => {
				setTimer((prev) => prev - 1);
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [timer]);

	const resendCode = async () => {
		await requestVerificationCode(phoneNumber);
		setTimer(RESEND_TIME);
	};

	const onSendCode = async () => {
		if (isNullOrWhitespace(code)) return setError(true);
		setTimer(RESEND_TIME);
		await verifyCode(code);
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View
				className="flex h-full bg-background"
				style={{ paddingHorizontal: horizontalScale(16) }}
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
					6 - digit code
				</TextBold>
				<Text
					className="text-[14px] mb-10 mr-16"
					style={{
						color: "#93969E",
						fontSize: moderateScale(14),
						marginBottom: verticalScale(30),
					}}
				>
					A message with a verification code has been sent to{" "}
					{phoneNumber.replace(/.(?=.{4})/g, "*")}. Please enter the code to
					continue.
				</Text>

				<TextInput
					className="justify-center items-center text-center text-black bg-[#EEEEEE]"
					value={code}
					onChangeText={(text) => {
						setCode(text.replace(/[^0-9]/g, ""));
						setError(false);
					}}
					keyboardType="number-pad"
					maxLength={6}
					style={[
						error ? styles.errorBorder : null,
						{
							height: verticalScale(64),
							borderRadius: moderateScale(8),
							fontSize: moderateScale(20),
							letterSpacing: horizontalScale(35),
						},
					]}
				/>
				<TouchableOpacity
					className="bg-[#E3C6FB] w-1/2 self-center items-center justify-center"
					activeOpacity={0.8}
					onPress={onSendCode}
					style={{
						marginTop: verticalScale(160),
						height: verticalScale(54),
						borderRadius: moderateScale(30),
					}}
				>
					<Text
						className=""
						style={{ color: "#000000", fontSize: moderateScale(14) }}
					>
						Continue
					</Text>
				</TouchableOpacity>
				<View
					className="flex flex-row self-center"
					style={{ marginTop: verticalScale(24) }}
				>
					<TextBold className="" style={{ fontSize: moderateScale(14) }}>
						Didn't get the code?{" "}
					</TextBold>
					<TouchableOpacity
						className=""
						onPress={resendCode}
						disabled={timer > 0}
					>
						<TextBold
							className={`${timer > 0 ? "text-gray-400" : "text-blue-400"}`}
							style={{ fontSize: moderateScale(14) }}
						>
							Send code {timer > 0 && `(${timer})`}
						</TextBold>
					</TouchableOpacity>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
}

export const styles = StyleSheet.create({
	errorBorder: {
		borderColor: "red",
		borderWidth: 1,
	},
});
