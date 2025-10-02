import { Container, Text, TextBold } from "@/components";
import { useUserContext } from "@/contexts/UserContext";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QrScreen() {
	const { user } = useUserContext();
	return (
		<Container>
			<View className="flex-1 px-3 mt-10">
				<View className="justify-center" style={{ flex: 1 }}>
					<TextBold className="text-[35px] text-center">
						{"Show this code\nbefore paying"}
					</TextBold>
					<Text className="text-[15px] text-center mt-5">
						{"This is your identifier as a member\nof chop local"}
					</Text>
				</View>
				<View className="flex justify-center items-center" style={{ flex: 2 }}>
					<QRCode value={user.code} size={300} backgroundColor="transparent" />
				</View>
				<View style={{ flex: 1 }} className="justify-center">
					<View className="bg-white rounded-[42px] h-[85px] flex items-center justify-center">
						<TextBold className="text-[13px]">YOUR CARD CODE</TextBold>
						<Text className="text-[25px]">{user.code}</Text>
					</View>
				</View>
			</View>
		</Container>
	);
}
