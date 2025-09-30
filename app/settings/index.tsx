import { Container, TextBold } from "@/components";
import { Lock, Logout, Paper } from "@/constants/svgs";
import { ScrollView, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
	return (
		<Container>
			<ScrollView className="flex px-3 mt-20">
				<TouchableOpacity
					activeOpacity={0.8}
					className="flex flex-row items-center py-5"
				>
					<View className="flex justify-center">
						<Logout height={30} width={30} />
					</View>
					<TextBold className="ml-5">Change number</TextBold>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={0.8}
					className="flex flex-row items-center py-5"
				>
					<View className="flex justify-center">
						<Paper height={35} width={35} />
					</View>
					<TextBold className="ml-5">Terms and conditions</TextBold>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={0.8}
					className="flex flex-row items-center py-5"
				>
					<View className="flex justify-center items-center">
						<Lock height={35} width={35} />
					</View>
					<TextBold className="ml-5">Privacy policy</TextBold>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={0.8}
					className="flex flex-row items-center py-5"
				>
					<Logout height={30} width={30} />
					<TextBold className="ml-5">Delete account</TextBold>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={0.8}
					className="flex flex-row items-center py-5"
				>
					<Logout height={30} width={30} />
					<TextBold className="ml-5">Logout</TextBold>
				</TouchableOpacity>
			</ScrollView>
		</Container>
	);
}
