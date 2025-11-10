import { Container, Text, TextBold } from "@/components";
import { useUserContext } from "@/contexts/UserContext";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QrScreen() {
	const { user } = useUserContext();
	return (
		<Container style={{ paddingTop: 0 }}>
			<View
				className=""
				style={{
					paddingHorizontal: horizontalScale(12),
					// marginTop: verticalScale(10),
					flex: 1,
				}}
			>
				<View className="" style={{ flex: 1 }}>
					<TextBold
						className="text-center"
						style={{ fontSize: moderateScale(35) }}
					>
						{"Show this code\nbefore paying"}
					</TextBold>
					<Text
						className="text-center"
						style={{
							fontSize: moderateScale(15),
							marginTop: verticalScale(20),
						}}
					>
						{"This is your identifier as a member\nof chop local"}
					</Text>
				</View>
				<View className="flex justify-center items-center" style={{ flex: 3 }}>
					<QRCode
						value={user.code}
						size={moderateScale(300)}
						backgroundColor="transparent"
					/>
				</View>
				<View style={{ flex: 1 }} className="justify-center">
					<View
						className="bg-white flex items-center justify-center"
						style={{
							borderRadius: moderateScale(42),
							height: verticalScale(85),
						}}
					>
						<TextBold className="" style={{ fontSize: moderateScale(13) }}>
							YOUR CARD CODE
						</TextBold>
						<Text className="" style={{ fontSize: moderateScale(25) }}>
							{user.code}
						</Text>
					</View>
				</View>
			</View>
		</Container>
	);
}
