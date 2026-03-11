import { Container, Text, TextBold } from "@/components";
import RestaurantCard from "@/components/RestaurantCard";
import { SearchIcon } from "@/constants/svgs";
import { useUserContext } from "@/contexts/UserContext";
import { queryKeys } from "@/lib/api/queryClient";
import { useUserApi } from "@/lib/api/useApi";
import {
	horizontalScale,
	moderateScale,
	verticalScale,
} from "@/lib/metrics";
import { isNullOrWhitespace } from "@/lib/utils";
import { ERestaurantStatus, IRestaurant } from "@/lib/types/restaurant";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
	FlatList,
	Pressable,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RestaurantsSkeleton from "../skeletons/restaurants";

const FAVORITES_KEY = "choplocal-favorites";

type FilterTab = "all" | "visited" | "recommended" | "new";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
	{ key: "all", label: "All" },
	{ key: "visited", label: "Visited" },
	{ key: "recommended", label: "Recommended" },
	{ key: "new", label: "New" },
];

export default function Restaurants() {
	const userApi = useUserApi();
	const { user } = useUserContext();
	const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
	const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
	const [search, setSearch] = useState("");

	const { data: restaurants, isPending } = useQuery({
		queryKey: [queryKeys.users.restaurants],
		queryFn: async () => {
			const data = await userApi.restaurants(user.id);
			return data;
		},
		enabled: !isNullOrWhitespace(user?.id),
	});

	useFocusEffect(
		useCallback(() => {
			AsyncStorage.getItem(FAVORITES_KEY).then((val) => {
				if (val) setFavoriteIds(JSON.parse(val));
				else setFavoriteIds([]);
			});
		}, []),
	);

	const toggleFavorite = useCallback((id: number) => {
		setFavoriteIds((prev) => {
			const next = prev.includes(id)
				? prev.filter((fid) => fid !== id)
				: [...prev, id];
			AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
			return next;
		});
	}, []);

	const filteredRestaurants = useMemo(() => {
		if (!restaurants) return [];

		let result = restaurants;
		if (search.trim()) {
			const q = search.trim().toLowerCase();
			result = restaurants.filter((r) =>
				r.name.toLowerCase().includes(q),
			);
		} else {
			switch (activeFilter) {
				case "visited":
					result = restaurants.filter(
						(r) => r.status === ERestaurantStatus.Visited,
					);
					break;
				case "recommended":
					result = restaurants.filter(
						(r) => r.status === ERestaurantStatus.Recommended,
					);
					break;
				case "new":
					result = restaurants.filter(
						(r) => r.status === ERestaurantStatus.NotVisited,
					);
					break;
			}
		}
		return result;
	}, [restaurants, activeFilter, search]);

	if (isPending) return <RestaurantsSkeleton />;

	const renderItem = ({
		item,
		index,
	}: {
		item: IRestaurant;
		index: number;
	}) => (
		<RestaurantCard
			restaurant={item}
			index={index}
			isFavorited={favoriteIds.includes(item.id)}
			onToggleFavorite={toggleFavorite}
		/>
	);

	return (
		<Container>
			<FlatList
				data={filteredRestaurants}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item, index) =>
					`${activeFilter}_${index}_${item.id}`
				}
				renderItem={renderItem}
				ItemSeparatorComponent={() => (
					<View style={styles.separator} />
				)}
				contentContainerStyle={{
					paddingHorizontal: horizontalScale(14),
					paddingBottom: verticalScale(80),
				}}
				ListHeaderComponent={
					<View style={{ paddingBottom: verticalScale(4) }}>
						{/* Title row with redeem button */}
						<View style={styles.titleRow}>
							<View style={{ flex: 1 }}>
								<TextBold
									style={{
										fontSize: moderateScale(30),
										color: "#1A1A1A",
										marginTop: verticalScale(10),
									}}
								>
									Restaurants
								</TextBold>
								<Text
									style={{
										fontSize: moderateScale(14),
										color: "#888",
										marginTop: verticalScale(4),
									}}
								>
									{restaurants?.length ?? 0} places to
									discover
								</Text>
							</View>
							<TouchableOpacity
								activeOpacity={0.7}
								onPress={() => router.push("/redeem-code")}
								style={styles.redeemButton}
							>
								<Ionicons
									name="ticket-outline"
									size={moderateScale(22)}
									color="#438989"
								/>
							</TouchableOpacity>
						</View>

						{/* Filter tabs */}
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={{
								marginTop: verticalScale(20),
								marginBottom: verticalScale(12),
								gap: horizontalScale(10),
							}}
						>
							{FILTER_TABS.map((tab) => {
								const isActive =
									activeFilter === tab.key;
								return (
									<Pressable
										key={tab.key}
										onPress={() => {
											setActiveFilter(tab.key);
											setSearch("");
										}}
									>
										<View
											style={{
												alignItems: "center",
												justifyContent: "center",
												paddingVertical:
													verticalScale(8),
												paddingHorizontal:
													horizontalScale(16),
												borderRadius:
													moderateScale(20),
												borderWidth: 1,
												borderColor: "#000000",
												backgroundColor: isActive
													? "#000000"
													: "#FFFFFF",
											}}
										>
											{isActive ? (
												<TextBold
													style={{
														fontSize:
															moderateScale(13),
														color: "#FFFFFF",
													}}
												>
													{tab.label}
												</TextBold>
											) : (
												<Text
													style={{
														fontSize:
															moderateScale(13),
														color: "#000000",
													}}
												>
													{tab.label}
												</Text>
											)}
										</View>
									</Pressable>
								);
							})}
						</ScrollView>

						{/* Search bar */}
						<View style={styles.searchContainer}>
							<SearchIcon
								width={horizontalScale(18)}
								height={verticalScale(18)}
							/>
							<TextInput
								value={search}
								onChangeText={setSearch}
								placeholder="Search restaurants..."
								placeholderTextColor="#BBB"
								style={styles.searchInput}
							/>
							{search.length > 0 && (
								<Pressable
									onPress={() => setSearch("")}
									hitSlop={10}
								>
									<Text
										style={{
											fontSize: moderateScale(16),
											color: "#999",
										}}
									>
										✕
									</Text>
								</Pressable>
							)}
						</View>
					</View>
				}
				ListEmptyComponent={
					<View
						style={{
							alignItems: "center",
							paddingTop: verticalScale(40),
						}}
					>
						<Text
							style={{
								fontSize: moderateScale(14),
								color: "#BBB",
							}}
						>
							No restaurants found
						</Text>
					</View>
				}
			/>
		</Container>
	);
}

const styles = StyleSheet.create({
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	redeemButton: {
		width: moderateScale(44),
		height: moderateScale(44),
		borderRadius: moderateScale(22),
		backgroundColor: "#F0FAFA",
		alignItems: "center",
		justifyContent: "center",
		marginTop: verticalScale(10),
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#E0E0E0",
		borderRadius: moderateScale(14),
		paddingHorizontal: horizontalScale(14),
		paddingVertical: verticalScale(12),
		marginTop: verticalScale(20),
		marginBottom: verticalScale(8),
	},
	searchInput: {
		flex: 1,
		fontSize: moderateScale(14),
		color: "#1A1A1A",
		marginLeft: horizontalScale(10),
		padding: 0,
	},
	separator: {
		height: 1,
		backgroundColor: "#EDEDED",
		marginVertical: verticalScale(4),
	},
});
