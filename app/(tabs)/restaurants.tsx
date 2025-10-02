import { Container, Text, TextBold } from "@/components";
import { images } from "@/constants/images";
import { SearchIcon } from "@/constants/svgs";
import { useUserContext } from "@/contexts/UserContext";
import { queryKeys } from "@/lib/api/queryClient";
import { useUserApi } from "@/lib/api/useApi";
import { IRestaurant } from "@/lib/types/restaurant";
import { inlcudesCaseInsensitive, isImage } from "@/lib/utils";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, TextInput, View } from "react-native";

export default function Restaurants() {
	const tabBarHeight = useBottomTabBarHeight();
	const userApi = useUserApi();
	const { user } = useUserContext();
	const { data: restaurants, isPending } = useQuery({
		queryKey: [queryKeys.users.restaurants],
		queryFn: async () => {
			const data = await userApi.restaurants(user.id);
			return data;
		},
	});

	const [search, setSearch] = useState("");
	const [filteredRestaurants, setFilteredRestaurants] = useState<IRestaurant[]>(
		[]
	);

	useEffect(() => {
		if (restaurants) {
			let rests: IRestaurant[] = restaurants;
			if (search.trim() === "") return setFilteredRestaurants(rests);
			setFilteredRestaurants(
				rests.filter((x) => inlcudesCaseInsensitive(x.name, search))
			);
		}
	}, [restaurants, search]);

	return (
		<Container useGradient={false} style={{ backgroundColor: "#E3C6FB" }}>
			<View className="px-2 flex-1 mt-5">
				<View className="pl-8" style={{ flex: 1 }}>
					<Text className="text-[13px]">Chop Local</Text>
					<TextBold className="text-[35px] mb-5">Restaurants</TextBold>
				</View>
				<View
					className="flex flex-row items-center justify-between"
					style={{ flex: 1 }}
				>
					<TextInput
						placeholder="Search in restaurants"
						value={search}
						onChangeText={setSearch}
						style={{
							backgroundColor: "#F4E8FD",
							borderColor: "#ebebeb",
							borderRadius: 12,
							borderWidth: 1,
							fontSize: 16,
							marginTop: 5,
							width: "88%",
							height: 40,
							paddingHorizontal: 15,
						}}
						placeholderTextColor="#c4c4c4"
					/>
					<View className="bg-[#F4E8FD] h-[40px] rounded-[12px] w-[10%] items-center justify-center">
						<SearchIcon width={18} height={18} />
					</View>
				</View>
				<View style={{ flex: 10 }}>
					<FlatList
						data={filteredRestaurants}
						initialNumToRender={10}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{}}
						key={"_"}
						keyExtractor={(item, index) => `${index}_${item.id}`}
						renderItem={({ item, index }) => {
							return (
								<Link
									href={{
										pathname: "/restaurants/[id]",
										params: { id: item.id },
									}}
									key={`${index}_${item.id}`}
									className="mb-5"
								>
									<View className="flex flex-row h-[85px] py-3 px-2 w-full bg-white rounded-[16px]">
										<View className="w-[20%] items-center justify-center">
											<Image
												source={
													isImage(item.image)
														? { uri: item.image }
														: images.restaurantDefault
												}
												className="w-[54px] h-[54px] rounded-[9px]"
											/>
										</View>
										<View className="w-[55%] justify-center px-1">
											<Text className="text-[20px]" numberOfLines={1}>
												{item.name}
											</Text>
											<Text className="text-[11px]">OPEN: 9:00-22:00</Text>
										</View>
										<View className="w-[25%] justify-center items-center">
											<Text className="text-[11px]">
												{item.checkIns} VISITS
											</Text>
											<Text className="text-[20px]">
												${item.balance.toFixed(2)}
											</Text>
										</View>
									</View>
								</Link>
							);
						}}
					/>
				</View>
				<View style={{ flex: 1 }} />
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	shadow: {
		borderColor: "#FFFFFF",
		backgroundColor: "#FFFFFF",
		elevation: 3,
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.18,
		shadowRadius: 3.5,
	},
});
