import { FlatList, View } from "react-native";

import { Text, TextBold } from "@/components";
import { Bell, Stamp, TriangleLeft, TriangleRight } from "@/constants/svgs";
import { default as rawRestaurants } from "@/lib/mock/restaurantsHome.json";
import { ERestaurantStatus, IRestaurant } from "@/lib/types/restaurant";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
	const insets = useSafeAreaInsets();
	const restaurants: IRestaurant[] = rawRestaurants as IRestaurant[];
	const checkedIn = restaurants.filter((x) => x.checkIns > 0).length;
	return (
		<View
			className="flex-[1] bg-background px-5"
			style={{
				paddingTop: insets.top,
				// paddingBottom: insets.bottom
			}}
		>
			<View className="flex items-end">
				<Bell width={24} height={24} fill="#000000" />
			</View>
			<View className="flex items-end">
				<Text className="text-[30px]">Today I Am Feeling</Text>
			</View>
			<View className="flex justify-end flex-row border-b-[1px] items-center">
				<TriangleLeft width={26} height={26} />
				<TextBold className="text-[45px] mx-5">FRENCH</TextBold>
				<TriangleRight width={26} height={26} />
			</View>
			<View className="flex flex-row justify-between">
				<View>
					<Text>My passport</Text>
				</View>
				<View>
					<Text>Visited</Text>
				</View>
				<View>
					<Text>Not Visited</Text>
				</View>
				<View>
					<Text>Recommended</Text>
				</View>
			</View>
			<Text className="flex self-end">
				{checkedIn} / {restaurants.length}
			</Text>

			<View className="flex-1 pb-28">
				<FlatList
					showsVerticalScrollIndicator={false}
					initialNumToRender={20}
					numColumns={4}
					bounces={false}
					data={restaurants}
					renderItem={({ item, index }) => {
						const bgColor =
							item.status === ERestaurantStatus.Visited
								? "#CCE6E7"
								: item.status === ERestaurantStatus.Recommended
								? "#DF7740"
								: "#FFFFFF";
						return (
							<Link
								href="/restaurant"
								className={`h-[113px] justify-between w-auto rounded-md mx-[2px] my-1 p-1`}
								style={[
									{
										backgroundColor: bgColor,
										flex: 1 / 4,
										borderStyle: "dashed",
									},
									{
										borderWidth:
											item.status === ERestaurantStatus.NotVisited ? 1 : 0,
									},
								]}
								key={`_${index}_${item.id}`}
							>
								<Text>{item.name}</Text>
								<View className="flex-row">
									<Stamp width={27} height={27} />
									<Text className="justify-start" numberOfLines={2}>
										{item.checkIns}
									</Text>
								</View>
							</Link>
						);
					}}
					key={"_"}
					keyExtractor={(item, index) => `_${index}_${item.id}`}
					// columnWrapperStyle={{ justifyContent: "space-between" }}
					contentContainerStyle={{
						margin: 5,
						// marginBottom: 115,
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
					}}
				/>
			</View>
		</View>
	);
}
