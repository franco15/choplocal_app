import { ScrollView, View } from "react-native";

import { Container, Text, TextBold } from "@/components";
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
						<Text>My passport</Text>
						<Text>Visited</Text>
						<Text>Not Visited</Text>
						<Text>Recommended</Text>
					</View>
					<Text className="flex self-end mx-[15px] mt-1 mb-5">
						{checkedIn} / {restaurants.length}
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
					}}
				>
					{restaurants.map((item, index) => {
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
					{/* <FlatList
						showsVerticalScrollIndicator={true}
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
									className={`h-[113px] w-auto rounded-md mx-[2px] my-1 p-2`}
									style={[
										{
											backgroundColor: bgColor,
											flex: 1 / 4,
											maxWidth: "25%",
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
											<Text className="justify-start ml-1">
												{item.checkIns}
											</Text>
										</View>
									</View>
								</Link>
							);
						}}
						key={"_"}
						keyExtractor={(item, index) => `_${index}_${item.id}`}
						columnWrapperStyle={{ justifyContent: "space-between" }}
						contentContainerStyle={{
							marginTop: 5,
							marginRight: 5,
							marginLeft: 5,
							marginBottom: 75,
							// paddingBottom: 50,
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
					/> */}
				</View>
			</ScrollView>
		</Container>
	);
}
