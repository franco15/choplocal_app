import { Container, Text, TextBold } from "@/components";
import { images } from "@/constants/images";
import { useUserContext } from "@/contexts/UserContext";
import { queryKeys } from "@/lib/api/queryClient";
import { useUserApi } from "@/lib/api/useApi";
import { isNullOrWhitespace } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { FlatList, Image, View } from "react-native";

export default function Restaurants() {
	const userApi = useUserApi();
	const { user } = useUserContext();
	const { data: restaurants, isPending } = useQuery({
		queryKey: [queryKeys.restaurants.all],
		queryFn: async () => {
			const data = await userApi.visitedRestaurants(user.id);
			return data;
		},
	});

	return (
		<Container useGradient={false}>
			<View className="px-1 mt-20">
				<TextBold className="text-[25px] mb-5">Restaurants</TextBold>
				<FlatList
					data={restaurants}
					initialNumToRender={10}
					contentContainerStyle={{ marginBottom: 50 }}
					renderItem={({ item, index }) => {
						const logo = isNullOrWhitespace(item.image)
							? images.logo
							: { uri: item.image };
						return (
							<Link
								href={{
									pathname: "/restaurants/[id]",
									params: { id: item.id },
								}}
								key={index}
								className="  bg-[#DDDDDD] mb-5 p-7 rounded-[11px]"
							>
								<View className="flex flex-row items-center">
									<View className="rounded-full flex-[1] mr-5">
										<Image
											className="w-[50px] h-[50px] rounded-full"
											source={logo}
										/>
									</View>
									<View className="flex-[4]">
										<Text className="text-[15px]">{item.name}</Text>
										<Text className="text-[18px]">{item.checkIns} VISITS</Text>
									</View>
									<View className="flex-[1]">
										<Text className="text-[13px]">Balance</Text>
										<Text className="text-[15px]">
											${item.balance.toFixed(2)}
										</Text>
									</View>
								</View>
							</Link>
						);
					}}
				/>
			</View>
		</Container>
	);
}
