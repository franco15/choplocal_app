import { Container, Text, TextBold } from "@/components";
import { ArrowFortyFive } from "@/constants/svgs";
import { Link, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function Restaurant() {
	const { id } = useLocalSearchParams();
	return (
		<Container>
			<View className="px-3">
				{/* <View className="flex h-full px-4 bg-background"> */}
				<TextBold className="text-[45px] text-center">
					Nombre del restaurante
				</TextBold>
				<View
					className="items-center mx-7 mt-14 py-10 rounded-[26px] h-[150px] justify-between"
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
					<Text className="text-[15px]">Your balance $200 USD</Text>
					<Text className="text-[30px]">36752</Text>
				</View>
				<Link
					href="/transactions"
					className="mt-16  rounded-[41px] flex flex-row px-10 py-5 justify-between items-center"
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
						<TextBold className="text-[13px]">Transactions</TextBold>
						<Text className="text-[11px] w-[250px]">
							Tell your friends why you love this restaurant and get benefits
						</Text>
					</View>
					<View className="rounded-full bg-black w-[45px] h-[45px] justify-center items-center">
						<ArrowFortyFive width={19} height={19} />
					</View>
				</Link>
			</View>
		</Container>
	);
}
