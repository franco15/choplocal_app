import { Container, Text, TextBold } from "@/components";
import { useUserContext } from "@/contexts/UserContext";
import { queryKeys } from "@/lib/api/queryClient";
import { useRestaurantApi } from "@/lib/api/useApi";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, TouchableOpacity, View } from "react-native";
import TransactionsSkeleton from "../skeletons/transactions";

export default function Transactions() {
	const { restaurantId } = useLocalSearchParams();
	const { user } = useUserContext();
	const restaurantApi = useRestaurantApi();
	const router = useRouter();

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

	if (isPending) return <TransactionsSkeleton />;

	return (
		<Container useGradient={false} style={{ paddingTop: 0 }}>
			<View
				className=""
				style={{
					paddingHorizontal: horizontalScale(15),
					marginTop:
						transactions.length === 0 ? verticalScale(150) : verticalScale(50),
				}}
			>
				<TextBold
					className="text-center"
					style={{
						fontSize: moderateScale(35),
						marginBottom:
							transactions.length === 0 ? verticalScale(5) : verticalScale(20),
					}}
				>
					{"My latest\ntransactions"}
				</TextBold>
				{transactions.length === 0 ? (
					<Text
						className="text-center"
						style={{
							fontSize: moderateScale(15),
							marginTop: verticalScale(10),
						}}
					>
						{"Go visit the restaurant for the first time !!"}
					</Text>
				) : (
					<View
						className="flex-row justify-between"
						style={{
							paddingHorizontal: horizontalScale(10),
							marginBottom: verticalScale(5),
						}}
					>
						<Text className="" style={{ fontSize: moderateScale(11) }}>
							Date visited
						</Text>
						<Text className="" style={{ fontSize: moderateScale(11) }}>
							Cashback earned
						</Text>
					</View>
				)}
				<FlatList
					data={transactions}
					initialNumToRender={10}
					contentContainerStyle={{ marginBottom: verticalScale(50) }}
					renderItem={({ item, index }) => (
						<View
							key={index}
							className="border-b border-[#D4D4D4]"
							style={{
								paddingHorizontal: horizontalScale(15),
								paddingVertical: verticalScale(10),
							}}
						>
							<View className="flex flex-row items-center justify-between">
								<Text className="" style={{ fontSize: moderateScale(15) }}>
									Visited {new Date(item.date).toLocaleDateString()}
								</Text>
								<Text className="" style={{ fontSize: moderateScale(15) }}>
									${item.cashback.toFixed(2)}
								</Text>
							</View>
						</View>
					)}
				/>
				{transactions.length === 0 && (
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => router.replace("/restaurants")}
						className="flex bg-black self-center items-center justify-center"
						style={{
							marginTop: verticalScale(20),
							width: horizontalScale(170),
							height: verticalScale(54),
							borderRadius: moderateScale(30),
						}}
					>
						<Text
							className="text-white"
							style={{ fontSize: moderateScale(14) }}
						>
							Okay
						</Text>
					</TouchableOpacity>
				)}
			</View>
		</Container>
	);
}
