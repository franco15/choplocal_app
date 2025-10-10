import { Container, Text, TextBold } from "@/components";
import {
	Bell,
	ChopLocalBlack,
	MapPin,
	Share as ShareIcon,
} from "@/constants/svgs";
import { useUserContext } from "@/contexts/UserContext";
import { queryKeys } from "@/lib/api/queryClient";
import { useRestaurantApi } from "@/lib/api/useApi";
import { shadowStyle } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams } from "expo-router";
import { FlatList, Share, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function Restaurant() {
	const { id } = useLocalSearchParams();
	const { user } = useUserContext();
	const restaurantApi = useRestaurantApi();

	const { data: restaurant, isPending } = useQuery({
		queryKey: [queryKeys.restaurants.byId(id as string)],
		queryFn: async () => {
			const data = await restaurantApi.byId(id as string, user.id);
			return data;
		},
		enabled: !!id && !!user,
	});

	const onShare = async () => {
		const result = await Share.share({
			message: "Share Chop Local app with your friends!",
		});
		if (result.action === Share.sharedAction) {
			if (result.activityType) {
				//action type
			} else {
				// shared
			}
		} else {
			// dismissed
		}
	};

	if (isPending) return null;

	return (
		<Container>
			<View className="px-3 mt-14" style={{ flex: 3 }}>
				<View className="flex">
					<TextBold className="text-[35px]">{restaurant?.name}</TextBold>
					<View className="flex-row mt-3 items-center">
						<MapPin width={20} height={20} />
						<Text className="text-[13px] ml-2">
							Felicitas Zermeño 41, Centro, 83010 Hermosillo, Son.
						</Text>
					</View>
				</View>
				<View className="flex w-full h-64 bg-[#E5E382] rounded-[24px] p-5 justify-between mt-5">
					<View className="flex flex-row justify-between items-center">
						<Text className="text-[20px]">{restaurant?.checkIns} visits</Text>
						<TextBold className="text-[30px]">$400</TextBold>
					</View>
					<View className="flex items-start justify-end">
						<Text className="text-[15px]">Card ID: {user.code}</Text>
						<Text className="text-[15px] mb-5">
							{user.firstName + " " + user.lastName}
						</Text>
						<ChopLocalBlack width={"80%"} height={50} />
					</View>
				</View>
				<View className="mt-5 flex-row justify-between px-5">
					<Link href="/qr">
						<View className="flex items-center">
							<View
								className="h-[64px] w-[64px] rounded-full flex justify-center items-center"
								style={[shadowStyle]}
							>
								<QRCode value={user.code} size={30} />
							</View>
							<Text className="text-[13px] text-center mt-2">{"QR\ncode"}</Text>
						</View>
					</Link>
					<Link
						href={{
							pathname: "/restaurants/transactions",
							params: { restaurantId: id },
						}}
					>
						<View className="flex items-center">
							<View
								className="h-[64px] w-[64px] rounded-full flex justify-center items-center"
								style={[shadowStyle]}
							>
								<Bell width={30} height={30} />
							</View>
							<Text className="text-[13px] text-center mt-2">
								{"My chop local\nactivity"}
							</Text>
						</View>
					</Link>
					<TouchableOpacity
						activeOpacity={0.8}
						className="flex items-center"
						onPress={onShare}
					>
						<View
							className="h-[64px] w-[64px] rounded-full flex justify-center items-center"
							style={[shadowStyle]}
						>
							<ShareIcon width={30} height={30} />
						</View>
						<Text className="text-[13px] text-center mt-2">
							{"Share with\nfriends"}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			<View className="mt-5 px-3" style={{ flex: 2 }}>
				<Text className="text-[13px]">Latest</Text>
				<TextBold className="text-[35px] mb-5">News</TextBold>
				<FlatList
					data={news}
					initialNumToRender={4}
					// showsVerticalScrollIndicator={false}
					contentContainerStyle={{}}
					key={"_"}
					keyExtractor={(item, index) => `${index}_${item.id}`}
					renderItem={({ item, index }) => {
						return (
							<View
								key={`${index}_${item.id}`}
								className="flex h-[85px] py-3 px-5 w-full bg-white rounded-[16px] mb-5"
							>
								<View className="flex-row">
									<Text>{item.title}</Text>
									<Text>{item.date}</Text>
								</View>
								<View>
									<Text>{item.description}</Text>
								</View>
							</View>
						);
					}}
				/>
			</View>
		</Container>
	);
}

const news = [
	{
		id: 1,
		title: "Evento hoy !!",
		description:
			"Hoy hay banda en vivo a partir de las 7 de la tarde, acompañanos ",
		date: "25-03-25",
	},
	{
		id: 2,
		title: "Evento hoy !!",
		description:
			"Hoy hay banda en vivo a partir de las 7 de la tarde, acompañanos ",
		date: "25-03-25",
	},
	{
		id: 3,
		title: "Evento hoy !!",
		description:
			"Hoy hay banda en vivo a partir de las 7 de la tarde, acompañanos ",
		date: "25-03-25",
	},
	{
		id: 4,
		title: "Evento hoy !!",
		description:
			"Hoy hay banda en vivo a partir de las 7 de la tarde, acompañanos ",
		date: "25-03-25",
	},
	{
		id: 5,
		title: "Evento hoy !!",
		description:
			"Hoy hay banda en vivo a partir de las 7 de la tarde, acompañanos ",
		date: "25-03-25",
	},
];
