import { Container, Text, TextBold } from "@/components";
import { useUserContext } from "@/contexts/UserContext";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QrScreen() {
	const { user } = useUserContext();
	return (
		<Container>
			<View className="flex px-3 mt-20">
				<View className="min-h-[175px] justify-center mb-10">
					<TextBold className="text-[35px] text-center">
						{"Show this code\nbefore paying"}
					</TextBold>
					<Text className="text-[15px] text-center mt-5">
						{"This is your identifier as a member\nof chop local"}
					</Text>
				</View>
				<View className="flex justify-center items-center">
					<QRCode value={user.code} size={250} backgroundColor="transparent" />
				</View>
				<View className="bg-white rounded-[42px] mt-20 h-[85px] flex items-center justify-center">
					<TextBold className="text-[13px]">YOUR CARD CODE</TextBold>
					<Text className="text-[25px]">{user.code}</Text>
				</View>
			</View>
		</Container>
	);
}
