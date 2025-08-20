import { Container, Text, TextBold } from "@/components";
import { images } from "@/constants/images";
import { Link } from "expo-router";
import { FlatList, Image, View } from "react-native";

const rests = [
	{
		id: 1,
		icon: images.logo,
		name: "Blue Whale Cafe 1",
		checkIns: 4,
		balance: 200,
	},
	{
		id: 2,
		icon: images.logo,
		name: "Blue Whale Cafe 2",
		checkIns: 4,
		balance: 200,
	},
	{
		id: 3,
		icon: images.logo,
		name: "Blue Whale Cafe 3",
		checkIns: 4,
		balance: 200,
	},
	{
		id: 4,
		icon: images.logo,
		name: "Blue Whale Cafe 4",
		checkIns: 4,
		balance: 200,
	},
	{
		id: 5,
		icon: images.logo,
		name: "Blue Whale Cafe 5",
		checkIns: 4,
		balance: 200,
	},
	{
		id: 6,
		icon: images.logo,
		name: "Blue Whale Cafe 6",
		checkIns: 4,
		balance: 200,
	},
	{
		id: 7,
		icon: images.logo,
		name: "Blue Whale Cafe 7",
		checkIns: 4,
		balance: 200,
	},
	{
		id: 8,
		icon: images.logo,
		name: "Blue Whale Cafe 8",
		checkIns: 4,
		balance: 200,
	},
	{
		id: 9,
		icon: images.logo,
		name: "Blue Whale Cafe 9",
		checkIns: 4,
		balance: 200,
	},
	{
		id: 10,
		icon: images.logo,
		name: "Blue Whale Cafe 10",
		checkIns: 4,
		balance: 200,
	},
];

export default function Restaurants() {
	return (
		<Container useGradient={false}>
			<View className="px-1 mt-20">
				<TextBold className="text-[25px] mb-5">Restaurants</TextBold>
				<FlatList
					data={rests}
					initialNumToRender={10}
					contentContainerStyle={{ marginBottom: 50 }}
					renderItem={({ item, index }) => (
						<Link
							href={{
								pathname: "/restaurants/[id]",
								params: { id: item.id },
							}}
							key={index}
							className="  bg-[#DDDDDD] mb-5 p-7 rounded-[11px]"
						>
							<View className="flex flex-row items-center">
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
						</Link>
					)}
				/>
			</View>
		</Container>
	);
}
