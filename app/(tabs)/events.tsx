import { CustomText as Text, CustomTextBold as TextBold } from "@/components/Texts";
import EventCardLarge from "@/components/events/EventCardLarge";
import EventListRow from "@/components/events/EventListRow";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import {
	getAllCategories,
	getEvents,
	getEventCountByTag,
	getRestaurantsWithEvents,
	getTrendingEvents,
} from "@/lib/services/eventsService";
import { ICategory, IEvent, IEventRestaurant } from "@/lib/types/event";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DropsScreen() {
	const insets = useSafeAreaInsets();
	const [events, setEvents] = useState<IEvent[]>([]);
	const [trending, setTrending] = useState<IEvent[]>([]);
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
	const [spotsWithDrops, setSpotsWithDrops] = useState<
		(IEventRestaurant & { eventCount: number })[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchActive, setSearchActive] = useState(false);

	const loadData = useCallback(async () => {
		setLoading(true);
		try {
			const [evts, trendingData, cats, counts, spots] = await Promise.all([
				getEvents(),
				getTrendingEvents(5),
				getAllCategories(),
				getEventCountByTag(),
				getRestaurantsWithEvents(),
			]);
			setEvents(evts);
			setTrending(trendingData);
			setCategories(cats);
			setEventCounts(counts);
			setSpotsWithDrops(spots);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	// Show first 6 categories
	const visibleCategories = categories.slice(0, 6);

	// Categories that actually have events — split into first 2 and rest
	const categoriesWithEvents = useMemo(() => {
		return categories.filter((cat) =>
			events.some((e) => e.tags.includes(cat.name)),
		);
	}, [categories, events]);

	const firstCategoryCarousels = categoriesWithEvents.slice(0, 2);
	const remainingCategoryCarousels = categoriesWithEvents.slice(2);

	// Search results
	const searchResults = useMemo(() => {
		if (!searchQuery.trim()) return [];
		const q = searchQuery.toLowerCase();
		return events.filter(
			(e) =>
				e.title.toLowerCase().includes(q) ||
				e.restaurant.name.toLowerCase().includes(q),
		);
	}, [events, searchQuery]);

	const navigateToCategory = useCallback((tag: string) => {
		router.push({
			pathname: "/events/category",
			params: { tag },
		});
	}, []);

	if (loading) {
		return (
			<View style={[styles.centered, { paddingTop: insets.top }]}>
				<ActivityIndicator size="large" color="#1A1A1A" />
			</View>
		);
	}

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			{/* Header */}
			<View style={styles.header}>
				<TextBold style={styles.headerTitle}>Drops</TextBold>
				<TouchableOpacity
					onPress={() => setSearchActive(!searchActive)}
					hitSlop={10}
					style={styles.searchBtn}
				>
					<Ionicons
						name="search"
						size={moderateScale(22)}
						color="#1A1A1A"
					/>
				</TouchableOpacity>
			</View>

			{/* Search bar */}
			{searchActive && (
				<View style={styles.searchContainer}>
					<Ionicons
						name="search-outline"
						size={moderateScale(18)}
						color="#BBB"
						style={styles.searchIcon}
					/>
					<TextInput
						value={searchQuery}
						onChangeText={setSearchQuery}
						placeholder="Search drops..."
						placeholderTextColor="#BBB"
						style={styles.searchInput}
						autoFocus
						returnKeyType="search"
					/>
					{searchQuery.length > 0 && (
						<TouchableOpacity
							onPress={() => setSearchQuery("")}
							hitSlop={8}
						>
							<Ionicons
								name="close-circle"
								size={moderateScale(18)}
								color="#CCC"
							/>
						</TouchableOpacity>
					)}
				</View>
			)}

			{/* Search results */}
			{searchActive && searchQuery.trim().length > 0 ? (
				<View style={styles.searchResults}>
					<Text style={styles.searchResultsHeader}>
						{searchResults.length} results · "{searchQuery}"
					</Text>
					{searchResults.length > 0 ? (
						<FlatList
							data={searchResults}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => (
								<EventListRow event={item} />
							)}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{
								paddingBottom: verticalScale(120),
							}}
						/>
					) : (
						<View style={styles.emptyState}>
							<Ionicons
								name="search-outline"
								size={moderateScale(48)}
								color="#DDD"
							/>
							<Text style={styles.emptyText}>
								No drops found
							</Text>
						</View>
					)}
				</View>
			) : (
				/* Main content */
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						paddingBottom: verticalScale(120),
					}}
				>
					{/* ── Trending ── */}
					{trending.length > 0 && (
						<View style={styles.section}>
							<View style={styles.sectionHeader}>
								<View>
									<TextBold style={styles.sectionTitle}>
										trending
									</TextBold>
									<Text style={styles.sectionSubtitle}>
										what people are loving
									</Text>
								</View>
								<TouchableOpacity
									onPress={() =>
										navigateToCategory("trending")
									}
									hitSlop={10}
								>
									<Text style={styles.seeAll}>all →</Text>
								</TouchableOpacity>
							</View>
							<FlatList
								data={trending}
								horizontal
								showsHorizontalScrollIndicator={false}
								keyExtractor={(item) => `trend_${item.id}`}
								contentContainerStyle={styles.carouselContent}
								renderItem={({ item }) => (
									<EventCardLarge event={item} />
								)}
							/>
						</View>
					)}

					{/* ── First 2 category carousels ── */}
					{firstCategoryCarousels.map((cat) => {
						const tagEvents = events.filter((e) =>
							e.tags.includes(cat.name),
						);
						return (
							<View key={cat.name} style={styles.section}>
								<View style={styles.sectionHeader}>
									<View>
										<TextBold
											style={styles.sectionTitle}
										>
											{cat.name.toLowerCase()}
										</TextBold>
									</View>
									<TouchableOpacity
										onPress={() =>
											navigateToCategory(cat.name)
										}
										hitSlop={10}
									>
										<Text style={styles.seeAll}>
											all →
										</Text>
									</TouchableOpacity>
								</View>
								<FlatList
									data={tagEvents.slice(0, 5)}
									horizontal
									showsHorizontalScrollIndicator={false}
									keyExtractor={(item) =>
										`${cat.name}_${item.id}`
									}
									contentContainerStyle={
										styles.carouselContent
									}
									renderItem={({ item }) => (
										<EventCardLarge event={item} />
									)}
								/>
							</View>
						);
					})}

					{/* ── Spots with Drops ── */}
					{spotsWithDrops.length > 0 && (
						<View style={styles.section}>
							<View style={styles.sectionHeaderNoPad}>
								<TextBold style={styles.sectionTitle}>
									spots with drops
								</TextBold>
								<Text style={styles.sectionSubtitle}>
									restaurants hosting events
								</Text>
							</View>

							<FlatList
								data={spotsWithDrops}
								horizontal
								showsHorizontalScrollIndicator={false}
								keyExtractor={(item) => `spot_${item.id}`}
								contentContainerStyle={styles.carouselContent}
								renderItem={({ item }) => (
									<Pressable
										onPress={() =>
											router.push({
												pathname: "/events/restaurant-drops",
												params: {
													restaurantId: item.id,
													restaurantName: item.name,
												},
											})
										}
										style={({ pressed }) => [
											styles.spotCard,
											{
												transform: [
													{
														scale: pressed
															? 0.97
															: 1,
													},
												],
											},
										]}
									>
										<View style={styles.spotImageWrap}>
											{item.image ? (
												<Image
													source={{
														uri: item.image,
													}}
													style={styles.spotImage}
													resizeMode="cover"
												/>
											) : (
												<View
													style={[
														styles.spotImage,
														{
															backgroundColor:
																"#F0F0F0",
														},
													]}
												>
													<Ionicons
														name="restaurant-outline"
														size={
															moderateScale(28)
														}
														color="#CCC"
													/>
												</View>
											)}
										</View>
										<View style={styles.spotInfo}>
											<TextBold
												numberOfLines={1}
												style={styles.spotName}
											>
												{item.name}
											</TextBold>
											<Text style={styles.spotCount}>
												{item.eventCount}{" "}
												{item.eventCount === 1
													? "drop"
													: "drops"}
											</Text>
										</View>
									</Pressable>
								)}
							/>
						</View>
					)}

					{/* ── Discover more (category cards) ── */}
					<View style={styles.section}>
						<View style={styles.sectionHeaderNoPad}>
							<TextBold style={styles.sectionTitle}>
								discover more
							</TextBold>
							<Text style={styles.sectionSubtitle}>
								explore categories to find your vibe
							</Text>
						</View>

						{/* Category cards — gradient + grain */}
						<View style={styles.categoryCards}>
							{visibleCategories.map((cat) => (
								<Pressable
									key={cat.name}
									onPress={() =>
										navigateToCategory(cat.name)
									}
									style={({ pressed }) => [
										styles.categoryCard,
										{
											opacity: pressed ? 0.85 : 1,
											transform: [
												{ scale: pressed ? 0.98 : 1 },
											],
										},
									]}
								>
									<LinearGradient
										colors={[
											cat.color,
											`${cat.color}BB`,
											`${cat.color}77`,
										]}
										start={{ x: 0, y: 0 }}
										end={{ x: 1, y: 1 }}
										style={styles.categoryGradient}
									/>
									<Image
										source={{
											uri: "https://www.transparenttextures.com/patterns/asfalt-dark.png",
										}}
										style={styles.categoryGrain}
										resizeMode="repeat"
									/>
									<View style={styles.categoryContent}>
										<TextBold
											style={styles.categoryName}
										>
											{cat.name.toLowerCase()}
										</TextBold>
										<Text
											style={styles.categoryCount}
										>
											{eventCounts[cat.name] ?? 0} drops
										</Text>
									</View>
								</Pressable>
							))}
						</View>

						{/* See all categories button */}
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() =>
								router.push("/events/all-categories")
							}
							style={styles.seeAllBtn}
						>
							<Text style={styles.seeAllBtnText}>
								See all categories
							</Text>
							<Ionicons
								name="chevron-forward"
								size={moderateScale(16)}
								color="#888"
							/>
						</TouchableOpacity>
					</View>

					{/* ── Remaining category carousels ── */}
					{remainingCategoryCarousels.map((cat) => {
						const tagEvents = events.filter((e) =>
							e.tags.includes(cat.name),
						);
						return (
							<View key={cat.name} style={styles.section}>
								<View style={styles.sectionHeader}>
									<View>
										<TextBold
											style={styles.sectionTitle}
										>
											{cat.name.toLowerCase()}
										</TextBold>
									</View>
									<TouchableOpacity
										onPress={() =>
											navigateToCategory(cat.name)
										}
										hitSlop={10}
									>
										<Text style={styles.seeAll}>
											all →
										</Text>
									</TouchableOpacity>
								</View>
								<FlatList
									data={tagEvents.slice(0, 5)}
									horizontal
									showsHorizontalScrollIndicator={false}
									keyExtractor={(item) =>
										`${cat.name}_${item.id}`
									}
									contentContainerStyle={
										styles.carouselContent
									}
									renderItem={({ item }) => (
										<EventCardLarge event={item} />
									)}
								/>
							</View>
						);
					})}
				</ScrollView>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	centered: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FFFFFF",
	},

	/* Header */
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: horizontalScale(16),
		paddingTop: verticalScale(8),
		paddingBottom: verticalScale(12),
	},
	headerTitle: {
		fontSize: moderateScale(30),
		color: "#1A1A1A",
	},
	searchBtn: {
		width: moderateScale(40),
		height: moderateScale(40),
		borderRadius: moderateScale(20),
		backgroundColor: "#F5F5F5",
		alignItems: "center",
		justifyContent: "center",
	},

	/* Search */
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: horizontalScale(16),
		marginBottom: verticalScale(8),
		paddingHorizontal: horizontalScale(12),
		height: verticalScale(44),
		backgroundColor: "#F5F5F5",
		borderRadius: moderateScale(12),
	},
	searchIcon: {
		marginRight: horizontalScale(8),
	},
	searchInput: {
		flex: 1,
		fontSize: moderateScale(15),
		color: "#1A1A1A",
		fontFamily: "Inter_400Regular",
	},
	searchResults: {
		flex: 1,
	},
	searchResultsHeader: {
		fontSize: moderateScale(13),
		color: "#999",
		paddingHorizontal: horizontalScale(16),
		paddingVertical: verticalScale(8),
	},
	emptyState: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingTop: verticalScale(60),
		gap: verticalScale(12),
	},
	emptyText: {
		fontSize: moderateScale(15),
		color: "#BBB",
	},

	/* Sections */
	section: {
		marginTop: verticalScale(24),
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
		paddingHorizontal: horizontalScale(16),
		marginBottom: verticalScale(14),
	},
	sectionHeaderNoPad: {
		paddingHorizontal: horizontalScale(16),
		marginBottom: verticalScale(14),
	},
	sectionTitle: {
		fontSize: moderateScale(22),
		color: "#1A1A1A",
	},
	sectionSubtitle: {
		fontSize: moderateScale(13),
		color: "#999",
		marginTop: verticalScale(2),
	},
	seeAll: {
		fontSize: moderateScale(14),
		color: "#888",
		marginTop: verticalScale(4),
	},
	carouselContent: {
		paddingHorizontal: horizontalScale(16),
		gap: horizontalScale(14),
	},

	/* ── Spot cards ── */
	spotCard: {
		width: horizontalScale(140),
	},
	spotImageWrap: {
		width: horizontalScale(140),
		height: horizontalScale(140),
		borderRadius: moderateScale(16),
		overflow: "hidden",
		backgroundColor: "#F0F0F0",
	},
	spotImage: {
		width: "100%",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	spotInfo: {
		paddingTop: verticalScale(8),
		paddingHorizontal: horizontalScale(4),
	},
	spotName: {
		fontSize: moderateScale(14),
		color: "#1A1A1A",
		lineHeight: moderateScale(19),
	},
	spotCount: {
		fontSize: moderateScale(12),
		color: "#888",
		marginTop: verticalScale(2),
	},

	/* ── Category cards (unified) ── */
	categoryCards: {
		paddingHorizontal: horizontalScale(16),
		gap: verticalScale(8),
	},
	categoryCard: {
		minHeight: 100,
		borderRadius: 14,
		overflow: "hidden",
	},
	categoryGradient: {
		...StyleSheet.absoluteFillObject,
	},
	categoryGrain: {
		...StyleSheet.absoluteFillObject,
		opacity: 0.12,
	},
	categoryContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingVertical: 20,
	},
	categoryName: {
		fontSize: moderateScale(22),
		color: "#FFFFFF",
		letterSpacing: 0.5,
	},
	categoryCount: {
		fontSize: moderateScale(13),
		color: "rgba(255,255,255,0.8)",
	},

	/* ── See all button ── */
	seeAllBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: horizontalScale(16),
		marginTop: verticalScale(12),
		paddingVertical: verticalScale(14),
		borderRadius: moderateScale(14),
		borderWidth: 1,
		borderColor: "#E8E8E8",
		gap: horizontalScale(4),
	},
	seeAllBtnText: {
		fontSize: moderateScale(14),
		color: "#888",
	},
});
