import { Text, TextBold } from "@/components";
import { useAuthContext } from "@/contexts/AuthContext";
import { isNullOrWhitespace } from "@/lib/utils";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

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
		<View className="flex h-full px-4 bg-background">
			<TextBold className="text-[35px] mb-3 mx-1" style={{ color: "#1A1C20" }}>
				6 - digit code
			</TextBold>
			<Text className="text-[14px] mb-10 mr-16" style={{ color: "#93969E" }}>
				A message with a verification code has been sent to{" "}
				{phoneNumber.replace(/.(?=.{4})/g, "*")}. Please enter the code to
				continue.
			</Text>

			<TextInput
				className="h-16 justify-center items-center text-center text-black rounded-[8px] bg-[#EEEEEE] text-[20px] tracking-[2em]"
				value={code}
				onChangeText={(text) => {
					setCode(text.replace(/[^0-9]/g, ""));
					setError(false);
				}}
				keyboardType="number-pad"
				maxLength={6}
				style={[error ? styles.errorBorder : null]}
			/>
			<TouchableOpacity
				className="bg-[#E3C6FB] mt-40 w-1/2 h-[54px] self-center items-center justify-center rounded-[30px]"
				activeOpacity={0.8}
				onPress={onSendCode}
			>
				<Text className="text-[14px]" style={{ color: "#000000" }}>
					Continue
				</Text>
			</TouchableOpacity>
			<View className="mt-6 flex flex-row self-center">
				<TextBold className="text-[14px]" style={{}}>
					Didn't get the code?{" "}
				</TextBold>
				<TouchableOpacity
					className=""
					onPress={resendCode}
					disabled={timer > 0}
				>
					<TextBold
						className={`text-[14px] ${
							timer > 0 ? "text-gray-400" : "text-blue-400"
						}`}
					>
						Send code {timer > 0 && `(${timer})`}
					</TextBold>
				</TouchableOpacity>
			</View>
		</View>
	);
}

export const styles = StyleSheet.create({
	errorBorder: {
		borderColor: "red",
		borderWidth: 1,
	},
});
