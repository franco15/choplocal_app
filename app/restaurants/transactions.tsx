import { Container, Text, TextBold } from "@/components";
import { useUserContext } from "@/contexts/UserContext";
import { queryKeys } from "@/lib/api/queryClient";
import { useRestaurantApi } from "@/lib/api/useApi";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { FlatList, View } from "react-native";
// const transactions = [
// 	{
// 		id: 1,
// 		date: "02-10-25",
// 		cashback: 2.5,
// 	},
// 	{
// 		id: 2,
// 		date: "02-10-25",
// 		cashback: 2.5,
// 	},
// 	{
// 		id: 3,
// 		date: "02-10-25",
// 		cashback: 2.5,
// 	},
// 	{
// 		id: 4,
// 		date: "02-10-25",
// 		cashback: 2.5,
// 	},
// 	{
// 		id: 5,
// 		date: "02-10-25",
// 		cashback: 2.5,
// 	},
// 	{
// 		id: 6,
// 		date: "02-10-25",
// 		cashback: 2.5,
// 	},
// 	{
// 		id: 7,
// 		date: "02-10-25",
// 		cashback: 2.5,
// 	},
// 	{
// 		id: 8,
// 		date: "02-10-25",
// 		cashback: 2.5,
// 	},
// 	{
// 		id: 9,
// 		date: "02-10-25",
// 		cashback: 2.5,
// 	},
// 	{
// 		id: 10,
// 		date: "02-10-25",
// 		cashback: 2.5,
// 	},
// ];

export default function Transactions() {
	const { restaurantId } = useLocalSearchParams();
	const { user } = useUserContext();
	const restaurantApi = useRestaurantApi();

	const { data: transactions, isPending } = useSuspenseQuery({
		queryKey: [queryKeys.restaurants.transactions(restaurantId as string)],
		queryFn: async () => {
			const data = await restaurantApi.transactions(
				restaurantId as string,
				user.id
			);
			return data;
		},
	});

	if (isPending) return null;

	return (
		<Container useGradient={false}>
			<View className="px-4 mt-20">
				<TextBold className="text-[35px] mb-5 text-center">
					{"My latest\ntransactions"}
				</TextBold>
				<View className="flex-row justify-between px-5 mb-2">
					<Text className="text-[11px]">Date visited</Text>
					<Text className="text-[11px]">Cashback earned</Text>
				</View>
				<FlatList
					data={transactions}
					initialNumToRender={10}
					contentContainerStyle={{ marginBottom: 50 }}
					renderItem={({ item, index }) => (
						<View key={index} className="px-5 py-3 border-b border-[#D4D4D4]">
							<View className="flex flex-row items-center justify-between">
								<Text className="text-[15px]">
									Visited {new Date(item.date).toLocaleDateString()}
								</Text>
								<Text className="text-[15px]">${item.cashback.toFixed(2)}</Text>
							</View>
						</View>
					)}
				/>
			</View>
		</Container>
	);
}
