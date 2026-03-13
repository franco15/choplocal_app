import { Container, Text, TextBold } from "@/components";
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
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { useMemo, useState } from "react";
import {
	FlatList,
	Pressable,
	StyleSheet,
	TextInput,
	View,
} from "react-native";

export default function SelectRestaurant() {
	const router = useRouter();
	const userApi = useUserApi();
	const { user } = useUserContext();
	const [search, setSearch] = useState("");

	const { data: restaurants } = useQuery({
		queryKey: [queryKeys.users.restaurants],
		queryFn: async () => {
			const data = await userApi.restaurants(user.id);
			return data;
		},
		enabled: !isNullOrWhitespace(user?.id),
	});

	const filtered = useMemo(() => {
		if (!restaurants) return [];
		if (!search.trim()) return restaurants;
		const q = search.trim().toLowerCase();
		return restaurants.filter((r) =>
			r.name.toLowerCase().includes(q),
		);
	}, [restaurants, search]);

	const onSelect = (restaurant: IRestaurant) => {
		router.push({
			pathname: "/gift-cards/choose-amount",
			params: {
				restaurantId: String(restaurant.id),
				restaurantName: restaurant.name,
			},
		});
	};

	const getInitials = (name: string) =>
		name
			.split(" ")
			.slice(0, 2)
			.map((w) => w[0])
			.join("")
			.toUpperCase();

	const renderItem = ({
		item,
		index,
	}: {
		item: IRestaurant;
		index: number;
	}) => {
		return (
			<MotiView
				from={{ opacity: 0, translateY: 12 }}
				animate={{ opacity: 1, translateY: 0 }}
				transition={{
					type: "timing",
					duration: 280,
					delay: index * 40,
				}}
			>
				<Pressable
					onPress={() => onSelect(item)}
					style={({ pressed }) => ({
						transform: [{ scale: pressed ? 0.98 : 1 }],
					})}
				>
					<View style={styles.card}>
						<View style={styles.avatar}>
							<TextBold
								style={{
									fontSize: moderateScale(16),
									color: "#999",
								}}
							>
								{getInitials(item.name)}
							</TextBold>
						</View>

						<View style={{ flex: 1 }}>
							<TextBold
								numberOfLines={1}
								style={{
									fontSize: moderateScale(15),
									color: "#1A1A1A",
									lineHeight: moderateScale(20),
								}}
							>
								{item.name}
							</TextBold>
							<Text
								style={{
									fontSize: moderateScale(13),
									color: "#888",
									marginTop: verticalScale(2),
								}}
							>
								{item.checkIns} visitas · ${item.balance.toFixed(2)}
							</Text>
						</View>
					</View>
				</Pressable>
			</MotiView>
		);
	};

	return (
		<Container style={{ paddingTop: 0 }}>
			<FlatList
				data={filtered}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item) => String(item.id)}
				renderItem={renderItem}
				contentContainerStyle={styles.listContent}
				ListHeaderComponent={
					<View style={{ paddingBottom: verticalScale(10) }}>
						{/* Header */}
						<TextBold
							style={{
								fontSize: moderateScale(26),
								color: "#1A1A1A",
							}}
						>
							Send a Gift
						</TextBold>
						<Text
							style={{
								fontSize: moderateScale(14),
								color: "#888",
								marginTop: verticalScale(2),
							}}
						>
							Pick a restaurant to treat someone special
						</Text>

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
	listContent: {
		paddingHorizontal: horizontalScale(8),
		paddingTop: verticalScale(10),
		paddingBottom: verticalScale(80),
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(14),
		paddingHorizontal: horizontalScale(14),
		paddingVertical: verticalScale(12),
		marginTop: verticalScale(12),
		borderWidth: 1,
		borderColor: "#EDEDED",
	},
	searchInput: {
		flex: 1,
		fontSize: moderateScale(14),
		color: "#1A1A1A",
		marginLeft: horizontalScale(10),
		padding: 0,
	},
	card: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: verticalScale(12),
		paddingHorizontal: horizontalScale(4),
		borderBottomWidth: 1,
		borderBottomColor: "#F0F0F0",
	},
	avatar: {
		width: moderateScale(50),
		height: moderateScale(50),
		borderRadius: moderateScale(12),
		backgroundColor: "#F5F5F5",
		borderWidth: 0.5,
		borderColor: "#E0E0E0",
		alignItems: "center",
		justifyContent: "center",
		marginRight: horizontalScale(12),
	},
});
