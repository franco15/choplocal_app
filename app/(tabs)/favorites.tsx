import { Container, Text, TextBold } from "@/components";
import RestaurantCard from "@/components/RestaurantCard";
import { Bookmark } from "@/constants/svgs";
import { useUserContext } from "@/contexts/UserContext";
import { queryKeys } from "@/lib/api/queryClient";
import { useUserApi } from "@/lib/api/useApi";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { isNullOrWhitespace } from "@/lib/utils";
import { IRestaurant } from "@/lib/types/restaurant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

const FAVORITES_KEY = "choplocal-favorites";

export default function FavoritesScreen() {
	const { user } = useUserContext();
	const userApi = useUserApi();
	const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

	const { data: restaurants } = useQuery({
		queryKey: [queryKeys.users.restaurants],
		queryFn: async () => {
			const data = await userApi.restaurants(user.id);
			return data;
		},
		enabled: !!user && !isNullOrWhitespace(user?.id),
	});

	useFocusEffect(
		useCallback(() => {
			AsyncStorage.getItem(FAVORITES_KEY).then((val) => {
				if (val) setFavoriteIds(JSON.parse(val));
				else setFavoriteIds([]);
			});
		}, []),
	);

	const toggleFavorite = useCallback((id: string) => {
		setFavoriteIds((prev) => {
			const next = prev.includes(id)
				? prev.filter((fid) => fid !== id)
				: [...prev, id];
			AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
			return next;
		});
	}, []);

	const favoriteRestaurants = useMemo(() => {
		if (!restaurants) return [];
		return restaurants.filter((r) => favoriteIds.includes(r.id));
	}, [restaurants, favoriteIds]);

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
			isFavorited={true}
			onToggleFavorite={toggleFavorite}
		/>
	);

	return (
		<Container>
			<View
				style={{
					flex: 1,
					paddingHorizontal: horizontalScale(12),
				}}
			>
				<View style={{ marginBottom: verticalScale(20) }}>
					<TextBold
						style={{
							fontSize: moderateScale(30),
							color: "#1A1A1A",
							lineHeight: moderateScale(36),
						}}
					>
						Saved
					</TextBold>
					<Text
						style={{
							fontSize: moderateScale(14),
							color: "#999",
							marginTop: verticalScale(3),
						}}
					>
						{favoriteRestaurants.length > 0
							? `${favoriteRestaurants.length} bookmarked restaurants`
							: "Your favorite spots live here"}
					</Text>
				</View>

				{favoriteRestaurants.length > 0 ? (
					<FlatList
						data={favoriteRestaurants}
						showsVerticalScrollIndicator={false}
						keyExtractor={(item, index) =>
							`fav_${index}_${item.id}`
						}
						renderItem={renderItem}
						contentContainerStyle={{
							paddingBottom: verticalScale(80),
						}}
					/>
				) : (
					<View style={styles.emptyState}>
						<View
							style={[
								styles.emptyIcon,
								{
									width: moderateScale(72),
									height: moderateScale(72),
									borderRadius: moderateScale(36),
									marginBottom: verticalScale(16),
								},
							]}
						>
							<Bookmark
								width={horizontalScale(30)}
								height={verticalScale(30)}
								fill="#CDCDCD"
							/>
						</View>
						<TextBold
							style={{
								fontSize: moderateScale(18),
								color: "#1A1A1A",
								marginBottom: verticalScale(6),
							}}
						>
							No restaurants saved
						</TextBold>
						<Text
							style={{
								fontSize: moderateScale(14),
								color: "#AAA",
								textAlign: "center",
								lineHeight: moderateScale(20),
							}}
						>
							Your future food obsessions go here!{"\n"}Tap the bookmark on any restaurant{"\n"}to start your collection
						</Text>
					</View>
				)}
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	emptyState: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingBottom: 100,
	},
	emptyIcon: {
		backgroundColor: "#F5F5F5",
		alignItems: "center",
		justifyContent: "center",
	},
});
