import { Container, Text, TextBold } from "@/components";
import { ArrowFortyFive } from "@/constants/svgs";
import { useUserContext } from "@/contexts/UserContext";
import { queryKeys } from "@/lib/api/queryClient";
import { useRestaurantApi } from "@/lib/api/useApi";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

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

	if (isPending) return null;

	return (
		<Container>
			<View className="px-3 mt-20">
				<View className="min-h-[100px] justify-center">
					<TextBold className="text-[45px] text-center">
						{restaurant?.name}
					</TextBold>
				</View>
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
					<Text className="text-[18px]">
						Your balance ${restaurant?.balance.toFixed(2)}
					</Text>
					<Text className="text-[30px]">{user.code}</Text>
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
