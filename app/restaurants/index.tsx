import { Text, TextBold } from "@/components";
import { images } from "@/constants/images";
import { FlatList, Image, View } from "react-native";

const rests = [
	{
		id: 1,
		icon: images.logo,
		name: "Blue Whale Cafe",
		checkIns: 4,
		balance: 200,
	},
	{
		id: 2,
		icon: images.logo,
		name: "Blue Whale Cafe",
		checkIns: 4,
		balance: 200,
	},
	{
		id: 3,
		icon: images.logo,
		name: "Blue Whale Cafe",
		checkIns: 4,
		balance: 200,
	},
	{
		id: 4,
		icon: images.logo,
		name: "Blue Whale Cafe",
		checkIns: 4,
		balance: 200,
	},
	{
		id: 5,
		icon: images.logo,
		name: "Blue Whale Cafe",
		checkIns: 4,
		balance: 200,
	},
	{
		id: 6,
		icon: images.logo,
		name: "Blue Whale Cafe",
		checkIns: 4,
		balance: 200,
	},
	{
		id: 7,
		icon: images.logo,
		name: "Blue Whale Cafe",
		checkIns: 4,
		balance: 200,
	},
	{
		id: 8,
		icon: images.logo,
		name: "Blue Whale Cafe",
		checkIns: 4,
		balance: 200,
	},
	{
		id: 9,
		icon: images.logo,
		name: "Blue Whale Cafe",
		checkIns: 4,
		balance: 200,
	},
	{
		id: 10,
		icon: images.logo,
		name: "Blue Whale Cafe",
		checkIns: 4,
		balance: 200,
	},
];

export default function Restaurants() {
	return (
		<View className="flex h-full px-4 bg-background">
			<TextBold className="text-[25px] mb-5">Restaurants</TextBold>
			<FlatList
				data={rests}
				initialNumToRender={10}
				renderItem={({ item, index }) => (
					<View
						key={index}
						className="flex-row bg-[#DDDDDD] mb-5 p-7 rounded-[11px] items-center"
					>
						<View className="rounded-full flex-[1]">
							<Image
								className="w-[37px] h-[37px] rounded-full"
								source={item.icon}
							/>
						</View>
						<View className="flex-[4]">
							<Text className="text-[10px]">{item.name}</Text>
							<Text className="text-[15px]">{item.checkIns} VISITS</Text>
						</View>
						<Text className="flex-[1] text-[10px]">${item.balance}</Text>
					</View>
				)}
			/>
		</View>
	);
}
