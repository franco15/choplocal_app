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
import { IRestaurant } from "@/lib/types/restaurant";
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
	FlatList,
	Pressable,
	StyleSheet,
	TextInput,
	View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "choplocal-favorites";

export default function SearchScreen() {
	const router = useRouter();
	const userApi = useUserApi();
	const { user } = useUserContext();
	const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
	const [search, setSearch] = useState("");

	const { data: restaurants } = useQuery({
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
		if (!restaurants || !search.trim()) return [];
		const q = search.trim().toLowerCase();
		return restaurants.filter((r) =>
			r.name.toLowerCase().includes(q),
		);
	}, [restaurants, search]);

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
			<View style={styles.header}>
				<Pressable
					onPress={() => router.back()}
					hitSlop={10}
					style={({ pressed }) => ({
						opacity: pressed ? 0.6 : 1,
					})}
				>
					<Text
						style={{
							fontSize: moderateScale(28),
							color: "#1A1A1A",
						}}
					>
						‹
					</Text>
				</Pressable>
				<View style={styles.searchBar}>
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
						autoFocus
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

			<FlatList
				data={filteredRestaurants}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item, index) => `search_${index}_${item.id}`}
				renderItem={renderItem}
				contentContainerStyle={{
					paddingHorizontal: horizontalScale(14),
					paddingBottom: verticalScale(80),
				}}
				ListEmptyComponent={
					<View
						style={{
							alignItems: "center",
							paddingTop: verticalScale(60),
						}}
					>
						<Text
							style={{
								fontSize: moderateScale(14),
								color: "#BBB",
							}}
						>
							{search.trim()
								? "No restaurants found"
								: "Type to search restaurants"}
						</Text>
					</View>
				}
			/>
		</Container>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: horizontalScale(14),
		paddingBottom: verticalScale(12),
		gap: horizontalScale(10),
	},
	searchBar: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F5F5F5",
		borderRadius: moderateScale(14),
		paddingHorizontal: horizontalScale(14),
		paddingVertical: verticalScale(12),
	},
	searchInput: {
		flex: 1,
		fontSize: moderateScale(14),
		color: "#1A1A1A",
		marginLeft: horizontalScale(10),
		padding: 0,
	},
});
