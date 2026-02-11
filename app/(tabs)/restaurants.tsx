import { Container, Text, TextBold } from "@/components";
import { images } from "@/constants/images";
import { SearchIcon } from "@/constants/svgs";
import { useUserContext } from "@/contexts/UserContext";
import { queryKeys } from "@/lib/api/queryClient";
import { useUserApi } from "@/lib/api/useApi";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { inlcudesCaseInsensitive, isImage } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import {
	FlatList,
	Image,
	ScrollView,
	StyleSheet,
	TextInput,
	View,
} from "react-native";
import RestaurantsSkeleton from "../skeletons/restaurants";

export default function Restaurants() {
	const userApi = useUserApi();
	const { user } = useUserContext();
	const {
		data: restaurants,
		isPending,
		error,
	} = useQuery({
		queryKey: [queryKeys.users.restaurants],
		queryFn: async () => {
			const data = await userApi.restaurants(user.id);
			// console.log(data);
			return data;
		},
	});

	const [search, setSearch] = useState("");
	// const [filteredRestaurants, setFilteredRestaurants] = useState<IRestaurant[]>(
	// 	[],
	// );

	const filteredRestaurants = useMemo(() => {
		const s = search.trim();
		return restaurants?.filter((x) => inlcudesCaseInsensitive(x.name, s));
	}, [restaurants, search]);

	// useEffect(() => {
	// 	if (restaurants) {
	// 		let rests: IRestaurant[] = restaurants;
	// 		if (search.trim() === "") return setFilteredRestaurants(rests);
	// 		setFilteredRestaurants(
	// 			rests.filter((x) => inlcudesCaseInsensitive(x.name, search)),
	// 		);
	// 	}
	// }, [restaurants, search]);

	if (isPending) return <RestaurantsSkeleton />;
	if (error) console.log(error);

	return (
		<Container useGradient={false} style={{ backgroundColor: "#E3C6FB" }}>
			<View
				className="flex-1"
				style={{
					paddingHorizontal: horizontalScale(5),
					marginTop: verticalScale(10),
				}}
			>
				<View
					className=""
					style={{
						flex: 1,
						paddingLeft: horizontalScale(20),
						marginBottom: verticalScale(15),
					}}
				>
					<Text className="" style={{ fontSize: moderateScale(15) }}>
						Chop Local
					</Text>
					<TextBold
						className=""
						style={{
							fontSize: moderateScale(35),
						}}
					>
						Restaurants
					</TextBold>
				</View>
				<View
					className="flex flex-row items-center justify-between"
					style={{ flex: 1, marginBottom: verticalScale(10) }}
				>
					<TextInput
						placeholder="Search in restaurants"
						value={search}
						onChangeText={setSearch}
						style={{
							backgroundColor: "#F4E8FD",
							borderColor: "#ebebeb",
							borderRadius: moderateScale(12),
							borderWidth: moderateScale(1),
							fontSize: moderateScale(16),
							width: "88%",
							height: verticalScale(40),
							paddingHorizontal: horizontalScale(15),
							letterSpacing: 0,
						}}
						placeholderTextColor="#c4c4c4"
					/>
					<View
						className="bg-[#F4E8FD] w-[10%] items-center justify-center"
						style={{
							height: verticalScale(40),
							borderRadius: moderateScale(12),
						}}
					>
						<SearchIcon
							width={horizontalScale(18)}
							height={verticalScale(18)}
						/>
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
									className=""
									style={{ marginBottom: verticalScale(10) }}
								>
									<View
										className="flex flex-row w-[99%] bg-[#F4E8FD] self-center"
										style={{
											height: verticalScale(75),
											paddingVertical: verticalScale(10),
											paddingHorizontal: horizontalScale(8),
											borderRadius: moderateScale(25),
										}}
									>
										<View className="w-[20%] items-center justify-center">
											<Image
												source={
													isImage(item.image)
														? { uri: item.image }
														: images.restaurantDefault
												}
												className=""
												style={{
													width: horizontalScale(45),
													height: verticalScale(45),
													borderRadius: moderateScale(9),
												}}
											/>
										</View>
										<View
											className="w-[50%] justify-center"
											style={{ paddingHorizontal: horizontalScale(4) }}
										>
											<Text
												className=""
												style={{ fontSize: moderateScale(18) }}
												numberOfLines={1}
											>
												{item.name}
											</Text>
											{/* <Text
												className=""
												style={{ fontSize: moderateScale(11) }}
											>
												OPEN: 9:00-22:00
											</Text> */}
										</View>
										<View
											className="w-[30%] justify-center items-center"
											style={{ marginLeft: horizontalScale(0) }}
										>
											<Text
												className=""
												style={{ fontSize: moderateScale(11) }}
											>
												{item.checkIns} VISITS
											</Text>
											<Text
												className=""
												style={{ fontSize: moderateScale(18) }}
											>
												${item.balance.toFixed(2)}
											</Text>
										</View>
									</View>
								</Link>
							);
						}}
					/>
					{search === "" &&
						restaurants?.length !== filteredRestaurants?.length &&
						(user.phoneNumber === "526621690322" ||
							user.phoneNumber === "526623589754") && (
							<>
								<Text className="">restaurants</Text>
								<Text className="">{restaurants?.length}</Text>
								<Text className="mt-2">filteredRestaurants</Text>
								<Text className="">{filteredRestaurants?.length}</Text>
							</>
						)}
					{error &&
						(user.phoneNumber === "526621690322" ||
							user.phoneNumber === "526623589754") && (
							<ScrollView style={{ flex: 1 }}>
								<Text className="">Error:</Text>
								<Text className="">{error}</Text>
								<Text className="mt-5">Error message:</Text>
								<Text className="">{error?.message}</Text>
							</ScrollView>
						)}
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
