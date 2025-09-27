import { Container, Text, TextBold } from "@/components";
import {
	ArrowFortyFive,
	ArrowFortyFiveBlack,
	SearchIcon,
} from "@/constants/svgs";
import { useUserContext } from "@/contexts/UserContext";
import { queryKeys } from "@/lib/api/queryClient";
import { useUserApi } from "@/lib/api/useApi";
import { ERestaurantStatus, IRestaurant } from "@/lib/types/restaurant";
import { inlcudesCaseInsensitive } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
	FlatList,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

export default function Restaurants() {
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
	const [tab, setTab] = useState<ERestaurantStatus>(ERestaurantStatus.Visited);
	const [filteredRestaurants, setFilteredRestaurants] = useState<IRestaurant[]>(
		[]
	);

	useEffect(() => {
		if (restaurants) {
			let rests: IRestaurant[] = [];
			if (tab === ERestaurantStatus.Visited)
				rests = restaurants.filter((x) => x.checkIns > 0);
			else rests = restaurants.filter((x) => x.checkIns === 0);
			if (search.trim() === "") return setFilteredRestaurants(rests);
			setFilteredRestaurants(
				rests.filter((x) => inlcudesCaseInsensitive(x.name, search))
			);
		}
	}, [restaurants, tab, search]);

	return (
		<Container useGradient={false}>
			<View className="px-2 mt-20 h-[89%]">
				<TextBold className="text-[25px] text-center mb-5">
					Chop Local Restaurants
				</TextBold>
				<View className="flex flex-row items-center justify-between mb-5">
					<TextInput
						placeholder="Search in restaurants"
						value={search}
						onChangeText={setSearch}
						style={{
							backgroundColor: "#EEEEEE",
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
					<View className="bg-[#EEEEEE] h-[40px] rounded-[12px] w-[10%] items-center justify-center">
						<SearchIcon width={18} height={18} />
					</View>
				</View>
				<View className="flex flex-row justify-between mx-20 mt-5 items-center mb-8">
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							setTab(ERestaurantStatus.Visited);
							setSearch("");
						}}
					>
						<Text
							style={{
								color:
									tab === ERestaurantStatus.Visited
										? "#000000"
										: "rgba(0, 0, 0, 0.22)",
								textDecorationLine:
									tab === ERestaurantStatus.Visited ? "underline" : "none",
							}}
						>
							Visited
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => setTab(ERestaurantStatus.NotVisited)}
					>
						<Text
							style={{
								color:
									tab === ERestaurantStatus.NotVisited
										? "#000000"
										: "rgba(0, 0, 0, 0.22)",
								textDecorationLine:
									tab === ERestaurantStatus.NotVisited ? "underline" : "none",
							}}
						>
							Not Visited
						</Text>
					</TouchableOpacity>
				</View>
				<FlatList
					data={filteredRestaurants}
					initialNumToRender={10}
					contentContainerStyle={{ marginBottom: 50 }}
					renderItem={({ item, index }) => {
						return (
							<Link
								href={{
									pathname: "/restaurants/[id]",
									params: { id: item.id },
								}}
								key={index}
								className="mb-5"
							>
								<View className="flex-row bg-white h-[85px] justify-between w-full">
									<View className="flex-row h-full w-[83%] border py-3 px-5 border-black rounded-[16px]">
										<View className="flex-1">
											<TextBold className="text-[15px]">{item.name}</TextBold>
											<Text className="text-[11px]">
												{item.checkIns} VISITS
											</Text>
										</View>
										<View className="flex-1 items-end self-end">
											<View className="h-[45px] w-[85px] rounded-[8px] bg-[#E3C6FB] items-center justify-center">
												<Text className="text-[20px]">
													${item.balance.toFixed(2)}
												</Text>
											</View>
										</View>
									</View>
									<View className="flex justify-center items-center h-full w-[15%] border bg-[#E3C6FB] rounded-[16px]">
										<ArrowFortyFiveBlack width={16} height={15} />
									</View>
								</View>
							</Link>
						);
					}}
				/>
				<Link
					href="/suggestions"
					className="rounded-[41px]"
					style={[styles.shadow]}
				>
					<View className="mt-5 mb-2 rounded-[41px] flex flex-row px-10 py-5 items-center">
						<View className="flex-[3]">
							<TextBold className="text-[13px]">Help chop local grow</TextBold>
							<Text className="text-[11px]">
								{
									"Tell us which restaurants you would\nlike to be part of chop local"
								}
							</Text>
						</View>
						<View className="rounded-full bg-black max-w-[40px] h-[40px] justify-center items-center flex-[1]">
							<ArrowFortyFive width={19} height={19} />
						</View>
					</View>
				</Link>
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
