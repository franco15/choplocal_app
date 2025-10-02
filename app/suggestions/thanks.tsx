import { Container, Text, TextBold } from "@/components";
import { ChefThree } from "@/constants/svgs";
import { useRouter } from "expo-router";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const { width, height } = Dimensions.get("screen");

export default function ThanksScreen() {
	const insets = useSafeAreaInsets();
	const router = useRouter();
	return (
		<Container style={{ backgroundColor: "#EFEECD" }}>
			<View className="mt-20 px-3 justify-center" style={{ flex: 1 }}>
				<TextBold className="text-[35px] mt-14 text-center">
					Thank you!
				</TextBold>
				<Text className="text-[15px] text-center mt-3">
					{"Thanks for supporting chop local\nwe will make it happen"}
				</Text>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => router.replace("/")}
					className="mt-20 flex self-center w-[171px]"
				>
					<View className="flex bg-black h-[54px] rounded-[30px] self-center items-center justify-center w-full">
						<Text className="text-[14px] text-white">Okay</Text>
					</View>
				</TouchableOpacity>
			</View>
			<View className="items-center top-12" style={{ flex: 1 }}>
				<ChefThree width={300} height={400} />
			</View>
		</Container>
	);
}
