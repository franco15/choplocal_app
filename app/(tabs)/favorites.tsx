import { Container, Text, TextBold } from "@/components";
import RestaurantCard from "@/components/RestaurantCard";
import { Bookmark } from "@/constants/svgs";
import { useUserContext } from "@/contexts/UserContext";
import { queryClient, queryKeys } from "@/lib/api/queryClient";
import { useUserApi } from "@/lib/api/useApi";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { IRestaurant } from "@/lib/types/restaurant";
import { isNullOrWhitespace } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

export default function FavoritesScreen() {
	const { user } = useUserContext();
	const userApi = useUserApi();
	const { favoriteIds, toggleFavorite } = useFavorites();
	const [refreshing, setRefreshing] = useState(false);

	const { data: restaurants } = useQuery({
		queryKey: [queryKeys.users.restaurants],
		queryFn: async () => {
			const data = await userApi.restaurants(user.id);
			return data;
		},
		enabled: !!user && !isNullOrWhitespace(user?.id),
	});

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await queryClient.invalidateQueries({
			queryKey: [queryKeys.users.restaurants],
		});
		setRefreshing(false);
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
						refreshControl={
							<RefreshControl
								refreshing={refreshing}
								onRefresh={onRefresh}
								tintColor="#b42406"
								progressViewOffset={100}
							/>
						}
						keyExtractor={(item, index) => `fav_${index}_${item.id}`}
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
							Your future food obsessions go here!{"\n"}Tap the bookmark on any
							restaurant{"\n"}to start your collection
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
