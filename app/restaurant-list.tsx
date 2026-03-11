import { Container, Text, TextBold } from "@/components";
import RestaurantCard from "@/components/RestaurantCard";
import { useUserContext } from "@/contexts/UserContext";
import { queryKeys } from "@/lib/api/queryClient";
import { useUserApi } from "@/lib/api/useApi";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { isNullOrWhitespace } from "@/lib/utils";
import { ERestaurantStatus, IRestaurant } from "@/lib/types/restaurant";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

const FAVORITES_KEY = "choplocal-favorites";

const SECTION_CONFIG: Record<
	string,
	{ title: string; subtitle: string }
> = {
	visited: {
		title: "Recently Visited",
		subtitle: "Your latest check-ins",
	},
	popular: {
		title: "Popular",
		subtitle: "Most visited by the community",
	},
	new: {
		title: "New on Chop Local",
		subtitle: "Recently added restaurants",
	},
	recommended: {
		title: "Recommended",
		subtitle: "Suggested for you",
	},
};

export default function RestaurantListScreen() {
	const { type } = useLocalSearchParams<{ type: string }>();
	const { user } = useUserContext();
	const userApi = useUserApi();
	const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

	const config = SECTION_CONFIG[type ?? "visited"] ?? SECTION_CONFIG.visited;

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

	const toggleFavorite = useCallback((id: number) => {
		setFavoriteIds((prev) => {
			const next = prev.includes(id)
				? prev.filter((fid) => fid !== id)
				: [...prev, id];
			AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
			return next;
		});
	}, []);

	const filtered = useMemo(() => {
		if (!restaurants) return [];

		switch (type) {
			case "visited":
				return restaurants.filter(
					(r) => r.status === ERestaurantStatus.Visited,
				);
			case "popular":
				return [...restaurants].sort(
					(a, b) => b.checkIns - a.checkIns,
				);
			case "new":
				return restaurants.filter(
					(r) => r.status === ERestaurantStatus.NotVisited,
				);
			case "recommended":
				return restaurants.filter(
					(r) => r.status === ERestaurantStatus.Recommended,
				);
			default:
				return restaurants;
		}
	}, [restaurants, type]);

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
		<Container style={{ paddingTop: 0 }}>
			<FlatList
				data={filtered}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item) => String(item.id)}
				renderItem={renderItem}
				contentContainerStyle={styles.listContent}
				ListHeaderComponent={
					<View style={styles.header}>
						<TextBold style={styles.title}>
							{config.title}
						</TextBold>
						<Text style={styles.subtitle}>
							{config.subtitle}
						</Text>
					</View>
				}
				ListEmptyComponent={
					<View style={styles.empty}>
						<Text style={styles.emptyText}>
							No restaurants found
						</Text>
					</View>
				}
			/>
		</Container>
	);
}

const styles = StyleSheet.create({
	listContent: {
		paddingHorizontal: horizontalScale(8),
		paddingTop: verticalScale(10),
		paddingBottom: verticalScale(80),
	},
	header: {
		marginBottom: verticalScale(16),
	},
	title: {
		fontSize: moderateScale(26),
		color: "#1A1A1A",
	},
	subtitle: {
		fontSize: moderateScale(14),
		color: "#888",
		marginTop: verticalScale(4),
	},
	empty: {
		alignItems: "center",
		paddingTop: verticalScale(40),
	},
	emptyText: {
		fontSize: moderateScale(14),
		color: "#BBB",
	},
});
