import { Container, Text, TextBold } from "@/components";
import EventListRow from "@/components/events/EventListRow";
import RestaurantCard from "@/components/RestaurantCard";
import { Bookmark } from "@/constants/svgs";
import { useUserContext } from "@/contexts/UserContext";
import { useDropsList } from "@/lib/api/queries/dropQueries";
import { queryClient, queryKeys } from "@/lib/api/queryClient";
import { useUserApi } from "@/lib/api/useApi";
import { useEventFavorites } from "@/lib/hooks/useEventFavorites";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { IEvent } from "@/lib/types/event";
import { IRestaurant } from "@/lib/types/restaurant";
import { isNullOrWhitespace } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import {
	FlatList,
	LayoutAnimation,
	Pressable,
	RefreshControl,
	StyleSheet,
	View,
} from "react-native";

type Segment = "restaurants" | "drops";

const SEGMENTS: { key: Segment; label: string }[] = [
	{ key: "restaurants", label: "Restaurants" },
	{ key: "drops", label: "Drops" },
];

export default function FavoritesScreen() {
	const { user } = useUserContext();
	const userApi = useUserApi();
	const { favoriteIds, toggleFavorite } = useFavorites();
	const { favoriteEventIds } = useEventFavorites();
	const [refreshing, setRefreshing] = useState(false);
	const [segment, setSegment] = useState<Segment>("restaurants");

	const { data: restaurants } = useQuery({
		queryKey: [queryKeys.users.restaurants],
		queryFn: async () => {
			const data = await userApi.restaurants(user.id);
			return data;
		},
		enabled: !!user && !isNullOrWhitespace(user?.id),
	});

	const { data: drops } = useDropsList(user?.id);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await Promise.all([
			queryClient.invalidateQueries({
				queryKey: [queryKeys.users.restaurants],
			}),
			queryClient.invalidateQueries({
				queryKey: queryKeys.drops.list(user?.id),
			}),
		]);
		setRefreshing(false);
	}, [user?.id]);

	const favoriteRestaurants = useMemo(() => {
		if (!restaurants) return [];
		return restaurants.filter((r) => favoriteIds.includes(r.id));
	}, [restaurants, favoriteIds]);

	const favoriteDrops = useMemo(() => {
		if (!drops) return [];
		return drops.filter((d) => favoriteEventIds.includes(d.id));
	}, [drops, favoriteEventIds]);

	const renderRestaurant = ({
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

	const renderEvent = ({ item }: { item: IEvent }) => (
		<EventListRow event={item} />
	);

	const isRestaurants = segment === "restaurants";
	const showRestaurantList = isRestaurants && favoriteRestaurants.length > 0;
	const showDropsList = !isRestaurants && favoriteDrops.length > 0;

	const subtitle = isRestaurants
		? favoriteRestaurants.length > 0
			? `${favoriteRestaurants.length} bookmarked ${favoriteRestaurants.length === 1 ? "restaurant" : "restaurants"}`
			: "Your favorite spots live here"
		: favoriteDrops.length > 0
			? `${favoriteDrops.length} saved ${favoriteDrops.length === 1 ? "drop" : "drops"}`
			: "Your saved drops live here";

	return (
		<Container>
			<View
				style={{
					flex: 1,
					paddingHorizontal: horizontalScale(12),
				}}
			>
				{/* Header */}
				<View style={{ marginBottom: verticalScale(16) }}>
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
						{subtitle}
					</Text>
				</View>

				{/* Segment toggle */}
				<View style={styles.segmentRow}>
					{SEGMENTS.map((s) => {
						const active = segment === s.key;
						const count =
							s.key === "restaurants"
								? favoriteRestaurants.length
								: favoriteDrops.length;
						return (
							<Pressable
								key={s.key}
								onPress={() => {
									LayoutAnimation.configureNext(
										LayoutAnimation.create(
											180,
											"easeInEaseOut",
											"opacity",
										),
									);
									setSegment(s.key);
								}}
								style={[
									styles.segmentBtn,
									{
										backgroundColor: active
											? "#1A1A1A"
											: "#FFFFFF",
										borderColor: "#1A1A1A",
									},
								]}
							>
								{active ? (
									<TextBold style={styles.segmentTextActive}>
										{s.label}{" "}
										{count > 0 ? `· ${count}` : ""}
									</TextBold>
								) : (
									<Text style={styles.segmentText}>
										{s.label}{" "}
										{count > 0 ? `· ${count}` : ""}
									</Text>
								)}
							</Pressable>
						);
					})}
				</View>

				{/* Lists */}
				{showRestaurantList ? (
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
						keyExtractor={(item, index) => `fav_r_${index}_${item.id}`}
						renderItem={renderRestaurant}
						contentContainerStyle={{
							paddingBottom: verticalScale(80),
						}}
					/>
				) : showDropsList ? (
					<FlatList
						data={favoriteDrops}
						showsVerticalScrollIndicator={false}
						refreshControl={
							<RefreshControl
								refreshing={refreshing}
								onRefresh={onRefresh}
								tintColor="#b42406"
								progressViewOffset={100}
							/>
						}
						keyExtractor={(item) => `fav_e_${item.id}`}
						renderItem={renderEvent}
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
							{isRestaurants
								? "No restaurants saved"
								: "No drops saved"}
						</TextBold>
						<Text
							style={{
								fontSize: moderateScale(14),
								color: "#AAA",
								textAlign: "center",
								lineHeight: moderateScale(20),
							}}
						>
							{isRestaurants
								? `Your future food obsessions go here!\nTap the bookmark on any restaurant\nto start your collection`
								: `Your most-anticipated events go here!\nTap the bookmark on any drop\nto start your collection`}
						</Text>
					</View>
				)}
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	segmentRow: {
		flexDirection: "row",
		gap: horizontalScale(10),
		marginBottom: verticalScale(16),
	},
	segmentBtn: {
		paddingVertical: verticalScale(8),
		paddingHorizontal: horizontalScale(16),
		borderRadius: moderateScale(20),
		borderWidth: 1,
	},
	segmentTextActive: {
		fontSize: moderateScale(13),
		color: "#FFFFFF",
	},
	segmentText: {
		fontSize: moderateScale(13),
		color: "#000000",
	},
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
