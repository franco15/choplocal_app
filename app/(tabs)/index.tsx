import { Container, Text, TextBold } from "@/components";
import { images } from "@/constants/images";
import { ArrowFortyFive } from "@/constants/svgs";
import { useRouter } from "expo-router";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";

export default function Index() {
	const router = useRouter();
	return (
		<Container>
			<ScrollView showsVerticalScrollIndicator={false} className="px-3 pt-5">
				<View className="flex justify-center">
					<View className="self-center absolute bottom-[90px] z-20">
						<TextBold className="text-[45px] self-center">Chop Local</TextBold>
						<Text className="text-3xl self-center">36752</Text>
					</View>
					<View className="h-[150px] rounded-[26px] bg-[#9EA3BB] z-10" />
					<View className="h-[150px] rounded-[26px] bg-[#D02B2B] bottom-20" />
				</View>
				<View
					className="flex justify-center self-center items-center rounded-[26px] h-[200px] w-[220px]"
					style={{
						borderColor: "#FFFFFF",
						backgroundColor: "#FFFFFF",
						elevation: 3,
						shadowColor: "#000000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.18,
						shadowRadius: 3.5,
					}}
				>
					<Image className="w-[124px] h-[130px]" source={images.qrExample} />
				</View>
				<View
					className="mt-10 rounded-[41px] flex flex-row px-10 py-5 justify-between items-center"
					style={{
						borderColor: "#FFFFFF",
						backgroundColor: "#FFFFFF",
						elevation: 3,
						shadowColor: "#000000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.18,
						shadowRadius: 3.5,
					}}
				>
					<View className="flex-[3]">
						<TextBold className="text-[13px]">Recomend this app</TextBold>
						<Text className="text-[11px] max-w-[250px]">
							Tell your friends why you love this restaurant and get benefits
						</Text>
					</View>
					<View className="rounded-full bg-black w-[45px] h-[45px] justify-center items-center">
						<ArrowFortyFive width={19} height={19} />
					</View>
				</View>
				<TouchableOpacity
					onPress={() => router.push("/restaurants")}
					activeOpacity={0.8}
					className="mt-10 rounded-[41px] flex flex-row px-10 py-5 justify-between items-center"
					style={{
						borderColor: "#FFFFFF",
						backgroundColor: "#FFFFFF",
						elevation: 3,
						shadowColor: "#000000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.18,
						shadowRadius: 3.5,
					}}
				>
					<View className="flex-[3]">
						<TextBold className="text-[13px]">
							Restaurants i have visted
						</TextBold>
						<Text className="text-[11px] max-w-[250px]">
							Upload the ticket and validate your check in
						</Text>
					</View>
					<View className="rounded-full bg-black w-[45px] h-[45px] justify-center items-center">
						<ArrowFortyFive width={19} height={19} />
					</View>
				</TouchableOpacity>
			</ScrollView>
		</Container>
	);
}
