import { ScrollView, TouchableOpacity, View } from "react-native";

import { Container, Text, TextBold } from "@/components";
import { Bell, Stamp, TriangleLeft, TriangleRight } from "@/constants/svgs";
import { useUserContext } from "@/contexts/UserContext";
import { default as rawRestaurants } from "@/lib/mock/restaurantsHome.json";
import { ERestaurantStatus, IRestaurant } from "@/lib/types/restaurant";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
	const { profileCompleted } = useUserContext();
	const restaurants: IRestaurant[] = rawRestaurants as IRestaurant[];
	const [filteredRestaurants, setFilteredRestaurants] = useState<IRestaurant[]>(
		[]
	);
	const [total, setTotal] = useState(0);
	const [tab, setTab] = useState<ERestaurantStatus | null>(null);

	useEffect(() => {
		if (!profileCompleted) router.replace("/complete-profile");
	}, [profileCompleted]);

	useEffect(() => {
		let rests: IRestaurant[] = [];
		switch (tab) {
			case ERestaurantStatus.Visited:
				rests = restaurants.filter(
					(x) => x.status === ERestaurantStatus.Visited
				);
				break;
			case ERestaurantStatus.NotVisited:
				rests = restaurants.filter(
					(x) => x.status === ERestaurantStatus.NotVisited
				);
				break;
			case ERestaurantStatus.Recommended:
				rests = restaurants.filter(
					(x) => x.status === ERestaurantStatus.Recommended
				);
				break;
			default:
				rests = restaurants;
				break;
		}
		setFilteredRestaurants(rests);
		setTotal(
			tab === null ? rests.filter((x) => x.checkIns > 0).length : rests.length
		);
	}, [tab]);

	return (
		<Container style={{}}>
			<ScrollView
				stickyHeaderIndices={[0]}
				showsVerticalScrollIndicator={false}
			>
				<View className="bg-background">
					<View className="flex items-end">
						<Bell width={24} height={24} fill="#000000" />
					</View>
					<Text className="text-[30px] flex text-right self-end mt-5 mr-10 max-w-[50%]">
						Today I Am Feeling
					</Text>
					<View className="flex self-end">
						<View className="flex justify-center flex-row border-b-[1px] items-center max-w-[75%]">
							<TriangleLeft width={15} height={15} />
							<TextBold className="text-[45px] mx-5">FRENCH</TextBold>
							<TriangleRight width={15} height={15} />
						</View>
					</View>
					<View className="flex flex-row justify-between px-[15px] mt-5">
						<TouchableOpacity activeOpacity={0.8} onPress={() => setTab(null)}>
							<Text
								style={{
									color: tab === null ? "#000000" : "rgba(0, 0, 0, 0.22)",
								}}
							>
								My passport
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => setTab(ERestaurantStatus.Visited)}
						>
							<Text
								style={{
									color:
										tab === ERestaurantStatus.Visited
											? "#000000"
											: "rgba(0, 0, 0, 0.22)",
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
								}}
							>
								Not Visited
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => setTab(ERestaurantStatus.Recommended)}
						>
							<Text
								style={{
									color:
										tab === ERestaurantStatus.Recommended
											? "#000000"
											: "rgba(0, 0, 0, 0.22)",
								}}
							>
								Recommended
							</Text>
						</TouchableOpacity>
					</View>
					<Text className="flex self-end mx-[15px] mt-1 mb-5">
						{total} / {restaurants.length}
					</Text>
				</View>

				<View
					className="flex-1 flex-row flex-wrap justify-between"
					style={{
						margin: 5,
						padding: 15,
						borderRadius: 20,
						borderWidth: 1,
						borderColor: "#FFFFFF",
						backgroundColor: "#FFFFFF",
						elevation: 3,
						shadowColor: "#000000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.18,
						shadowRadius: 3.5,
						minHeight: "75%",
					}}
				>
					{filteredRestaurants.map((item, index) => {
						const bgColor =
							item.status === ERestaurantStatus.Visited
								? "#CCE6E7"
								: item.status === ERestaurantStatus.Recommended
								? "#DF7740"
								: "#FFFFFF";
						return (
							<Link
								href="/restaurant"
								className={`h-[113px] rounded-md my-1 p-2 justify-center items-center`}
								style={[
									{
										backgroundColor: bgColor,
										width: "24%",
										borderStyle: "dashed",
									},
									{
										borderWidth:
											item.status === ERestaurantStatus.NotVisited ? 1 : 0,
									},
								]}
								key={`_${index}_${item.id}`}
							>
								<View className="flex h-full w-full justify-between">
									<Text className="text-sm" numberOfLines={2}>
										{item.name}
									</Text>
									<View className="flex-row items-end">
										<Stamp width={27} height={27} />
										<Text className="justify-start ml-1">{item.checkIns}</Text>
									</View>
								</View>
							</Link>
						);
					})}
				</View>
			</ScrollView>
		</Container>
	);
}
