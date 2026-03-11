import { Text, TextBold } from "@/components";
import { useUserContext } from "@/contexts/UserContext";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function QrTabScreen() {
	const { user } = useUserContext();
	const insets = useSafeAreaInsets();

	if (!user) return null;

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: "#FEFCFB",
				paddingTop: insets.top + verticalScale(20),
				paddingHorizontal: horizontalScale(12),
				paddingBottom: 60 + insets.bottom + verticalScale(10),
			}}
		>
			<View style={{ flex: 1 }}>
				<TextBold
					style={{
						fontSize: moderateScale(35),
						textAlign: "center",
						color: "#1A1A1A",
					}}
				>
					{"Show this code\nbefore paying"}
				</TextBold>
				<Text
					style={{
						fontSize: moderateScale(15),
						textAlign: "center",
						marginTop: verticalScale(20),
						color: "#888",
					}}
				>
					{"This is your identifier as a member\nof chop local"}
				</Text>
			</View>
			<View
				style={{
					flex: 3,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<QRCode
					value={user.code}
					size={moderateScale(300)}
					backgroundColor="transparent"
				/>
			</View>
			<View style={{ flex: 1, justifyContent: "center" }}>
				<View
					style={{
						backgroundColor: "#FFFFFF",
						alignItems: "center",
						justifyContent: "center",
						borderRadius: moderateScale(42),
						height: verticalScale(85),
					}}
				>
					<TextBold style={{ fontSize: moderateScale(13), color: "#1A1A1A" }}>
						YOUR CARD CODE
					</TextBold>
					<Text style={{ fontSize: moderateScale(25), color: "#1A1A1A" }}>
						{user.code}
					</Text>
				</View>
			</View>
		</View>
	);
}
