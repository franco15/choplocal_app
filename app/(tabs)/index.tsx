import CityDropdown from "@/components/CityDropdown";
import GiftCardBanner from "@/components/GiftCardBanner";
import RedeemCodeBanner from "@/components/RedeemCodeBanner";
import GradientBackground from "@/components/GradientBackground";
import HomeRestaurantCard from "@/components/HomeRestaurantCard";
import SectionHeader from "@/components/SectionHeader";
import { TextBold, Text } from "@/components";
import { Bell } from "@/constants/svgs";
import { useUserContext } from "@/contexts/UserContext";
import { queryKeys } from "@/lib/api/queryClient";
import { useUserApi } from "@/lib/api/useApi";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { isNullOrWhitespace } from "@/lib/utils";
import { ERestaurantStatus, IRestaurant } from "@/lib/types/restaurant";
import { useQuery } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	interpolate,
	Extrapolation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeSkeleton from "../skeletons/home";

const FAVORITES_KEY = "choplocal-favorites";

// Mock: replace with restaurant.city when backend supports it
const MOCK_CITIES = ["Monterrey", "CDMX", "Guadalajara"];
const getRestaurantCity = (restaurant: IRestaurant) => {
	// TODO: When backend has city field, change to: return restaurant.city;
	return MOCK_CITIES[parseInt(restaurant.id, 10) % 3];
};

const COLLAPSE_DISTANCE = 100;

// TODO: Replace with real recommended data from API when backend supports it
const MOCK_RECOMMENDED: IRestaurant[] = [
	{
		id: "3",
		name: "Sushi Heaven",
		checkIns: 12,
		status: ERestaurantStatus.Recommended,
		balance: 0,
		image: "",
	},
	{
		id: "9001",
		name: "La Nacional",
		checkIns: 87,
		status: ERestaurantStatus.Recommended,
		balance: 0,
		image: "",
	},
	{
		id: "9002",
		name: "Café Regina",
		checkIns: 54,
		status: ERestaurantStatus.Recommended,
		balance: 0,
		image: "",
	},
];

export default function HomeScreen() {
	const { profileComplete, user, isUserLoading } = useUserContext();
	const userApi = useUserApi();
	const insets = useSafeAreaInsets();
	const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
	const [selectedCity, setSelectedCity] = useState("All Cities");
	const [cityModalOpen, setCityModalOpen] = useState(false);
	const scrollY = useSharedValue(0);

	const { data: restaurants } = useQuery({
		queryKey: [queryKeys.users.restaurants],
		queryFn: async () => {
			const data = await userApi.restaurants(user.id);
			return data;
		},
		enabled: !!user && !isNullOrWhitespace(user?.id),
	});

	useEffect(() => {
		if (!profileComplete) router.replace("/complete-profile");
	}, [profileComplete]);

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

	// Display name for city in header
	const cityDisplay =
		selectedCity === "All Cities" ? "the city" : selectedCity;

	// Group restaurants by category, filtered by city
	const groups = useMemo(() => {
		if (!restaurants)
			return { visited: [], recommended: [], popular: [], new: [] };

		const filtered =
			selectedCity === "All Cities"
				? restaurants
				: restaurants.filter(
						(r) => getRestaurantCity(r) === selectedCity,
					);

		return {
			visited: filtered.filter(
				(r) => r.status === ERestaurantStatus.Visited,
			),
			// TODO: Replace MOCK_RECOMMENDED with API data when backend is ready
			recommended: MOCK_RECOMMENDED,
			popular: [...filtered]
				.sort((a, b) => b.checkIns - a.checkIns)
				.slice(0, 10),
			new: filtered.filter(
				(r) => r.status === ERestaurantStatus.NotVisited,
			),
		};
	}, [restaurants, selectedCity]);

	// Navigate to independent "See All" page
	const goToSeeAll = useCallback(
		(type: string) => {
			router.push({ pathname: "/restaurant-list", params: { type } });
		},
		[],
	);

	// Animated scroll handler
	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y;
		},
	});

	// "Hello, Name" fades and collapses on scroll
	const helloStyle = useAnimatedStyle(() => ({
		opacity: interpolate(
			scrollY.value,
			[0, COLLAPSE_DISTANCE * 0.6],
			[1, 0],
			Extrapolation.CLAMP,
		),
		maxHeight: interpolate(
			scrollY.value,
			[0, COLLAPSE_DISTANCE],
			[60, 0],
			Extrapolation.CLAMP,
		),
		overflow: "hidden" as const,
	}));

	// Sticky header fades in as user scrolls
	const stickyOpacity = useAnimatedStyle(() => ({
		opacity: interpolate(
			scrollY.value,
			[COLLAPSE_DISTANCE * 0.5, COLLAPSE_DISTANCE],
			[0, 1],
			Extrapolation.CLAMP,
		),
	}));

	if (!user || isUserLoading) return <HomeSkeleton />;

	const MAX_CAROUSEL = 5;

	const renderCarousel = (
		data: IRestaurant[],
		keyPrefix: string,
		type: string,
	) => {
		const limited = data.slice(0, MAX_CAROUSEL);
		const hasMore = data.length > MAX_CAROUSEL;

		return (
			<FlatList
				data={limited}
				horizontal
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => `${keyPrefix}_${item.id}`}
				contentContainerStyle={styles.carouselContent}
				renderItem={({ item }) => (
					<HomeRestaurantCard
						restaurant={item}
						isFavorited={favoriteIds.includes(item.id)}
						onToggleFavorite={toggleFavorite}
					/>
				)}
				ListFooterComponent={
					hasMore ? (
						<Pressable
							onPress={() => goToSeeAll(type)}
							style={({ pressed }) => [
								styles.seeAllCard,
								{ opacity: pressed ? 0.6 : 1 },
							]}
						>
							<Ionicons
								name="arrow-forward-circle"
								size={moderateScale(36)}
								color="#CCC"
							/>
							<Text style={styles.seeAllCardText}>
								See all
							</Text>
						</Pressable>
					) : null
				}
			/>
		);
	};

	return (
		<View style={{ flex: 1 }}>
			<GradientBackground />

			{/* ── Sticky collapsed header ── */}
			<Animated.View
				style={[
					styles.stickyHeader,
					{ paddingTop: insets.top + verticalScale(8) },
					stickyOpacity,
				]}
			>
				<Pressable
					onPress={() => setCityModalOpen(true)}
					style={({ pressed }) => ({
						flexDirection: "row",
						alignItems: "center",
						flex: 1,
						opacity: pressed ? 0.6 : 1,
					})}
				>
					<Text style={styles.stickyText}>Ready to explore </Text>
					<TextBold
						style={styles.stickyCity}
						numberOfLines={1}
					>
						{cityDisplay}
					</TextBold>
					<Ionicons
						name="chevron-down"
						size={moderateScale(16)}
						color="#999"
						style={{
							marginLeft: horizontalScale(4),
							flexShrink: 0,
						}}
					/>
				</Pressable>

				<Pressable
					onPress={() => router.push("/notifications")}
					hitSlop={10}
					style={({ pressed }) => ({
						opacity: pressed ? 0.6 : 1,
						marginLeft: horizontalScale(12),
					})}
				>
					<Bell
						width={horizontalScale(24)}
						height={verticalScale(24)}
					/>
				</Pressable>
			</Animated.View>

			{/* ── Scrollable content ── */}
			<Animated.ScrollView
				onScroll={scrollHandler}
				scrollEventThrottle={16}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={[
					styles.scrollContent,
					{
						paddingTop: insets.top + verticalScale(16),
						paddingBottom: verticalScale(100),
					},
				]}
			>
				{/* ── Hero Header (collapses on scroll) ── */}
				<View style={styles.heroHeader}>
					{/* Bell icon — top right */}
					<Pressable
						onPress={() => router.push("/notifications")}
						hitSlop={10}
						style={[
							styles.heroBell,
							{ top: verticalScale(4) },
						]}
					>
						<Bell
							width={horizontalScale(26)}
							height={verticalScale(26)}
						/>
					</Pressable>

					{/* "Hello, Name." — fades on scroll */}
					<Animated.View style={helloStyle}>
						<TextBold style={styles.heroHello}>
							Hello, {user.firstName}.
						</TextBold>
					</Animated.View>

					{/* "Ready to explore City ▼" */}
					<Text style={styles.heroSubtitle}>
						Ready to explore
					</Text>
					<Pressable
						onPress={() => setCityModalOpen(true)}
						style={({ pressed }) => ({
							flexDirection: "row",
							alignItems: "center",
							opacity: pressed ? 0.6 : 1,
							maxWidth: "85%",
						})}
					>
						<TextBold
							style={styles.heroCity}
							numberOfLines={1}
						>
							{cityDisplay}
						</TextBold>
						<Ionicons
							name="chevron-down"
							size={moderateScale(24)}
							color="#999"
							style={{
								marginLeft: horizontalScale(6),
								flexShrink: 0,
							}}
						/>
					</Pressable>
				</View>

				{/* ── Restaurant Sections ── */}

				{/* Recently Visited */}
				{groups.visited.length > 0 && (
					<View style={styles.section}>
						<SectionHeader
							title="Recently Visited"
							subtitle="Your latest check-ins"
							onSeeAll={() => goToSeeAll("visited")}
						/>
						{renderCarousel(groups.visited, "visited", "visited")}
					</View>
				)}

				{/* Recommended */}
				{groups.recommended.length > 0 && (
					<View style={styles.section}>
						<SectionHeader
							title="Recommended"
							subtitle="Suggested by people you know"
							onSeeAll={() => goToSeeAll("recommended")}
						/>
						{renderCarousel(groups.recommended, "recommended", "recommended")}
					</View>
				)}

				{/* Gift Card & Redeem Code Banners */}
				<View style={styles.bannerSection}>
					<GiftCardBanner />
					<RedeemCodeBanner />
				</View>

				{/* Stats */}
				<View style={styles.statsSection}>
					<View style={styles.statsRow}>
						<View style={styles.statCard}>
							<TextBold style={styles.statNumber}>
								{restaurants?.length ?? 0}
							</TextBold>
							<Text style={styles.statLabel}>
								Restaurants{"\n"}on Chop Local
							</Text>
						</View>
						<View style={styles.statCard}>
							<TextBold style={styles.statNumber}>
								{restaurants?.filter((r) => r.checkIns >= 1).length ?? 0}
							</TextBold>
							<Text style={styles.statLabel}>
								Restaurants{"\n"}you've visited
							</Text>
						</View>
					</View>
				</View>

				{/* Popular */}
				{groups.popular.length > 0 && (
					<View style={styles.section}>
						<SectionHeader
							title="Popular"
							subtitle="Most visited by the community"
							onSeeAll={() => goToSeeAll("popular")}
						/>
						{renderCarousel(groups.popular, "popular", "popular")}
					</View>
				)}

				{/* New on Chop Local */}
				{groups.new.length > 0 && (
					<View style={styles.section}>
						<SectionHeader
							title="New on Chop Local"
							subtitle="Recently added restaurants"
							onSeeAll={() => goToSeeAll("new")}
						/>
						{renderCarousel(groups.new, "new", "new")}
					</View>
				)}
			</Animated.ScrollView>

			{/* ── City Picker Modal ── */}
			<CityDropdown
				isOpen={cityModalOpen}
				onClose={() => setCityModalOpen(false)}
				selectedCity={selectedCity}
				onSelectCity={setSelectedCity}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	/* ── Sticky collapsed header ── */
	stickyHeader: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: horizontalScale(16),
		paddingBottom: verticalScale(10),
		backgroundColor: "#FFFFFF",
	},
	stickyText: {
		fontSize: moderateScale(18),
		color: "#888",
	},
	stickyCity: {
		fontSize: moderateScale(18),
		color: "#1A1A1A",
		flexShrink: 1,
	},

	/* ── Scroll content ── */
	scrollContent: {
		paddingHorizontal: horizontalScale(16),
	},

	/* ── Hero header ── */
	heroHeader: {
		marginBottom: verticalScale(24),
		position: "relative",
	},
	heroBell: {
		position: "absolute",
		right: 0,
		zIndex: 2,
	},
	heroHello: {
		fontSize: moderateScale(34),
		color: "#1A1A1A",
		lineHeight: moderateScale(40),
	},
	heroSubtitle: {
		fontSize: moderateScale(34),
		color: "#888",
		lineHeight: moderateScale(40),
	},
	heroCity: {
		fontSize: moderateScale(34),
		color: "#1A1A1A",
		lineHeight: moderateScale(40),
		flexShrink: 1,
	},

	/* ── Sections ── */
	section: {
		marginTop: verticalScale(24),
	},
	bannerSection: {
		marginTop: verticalScale(16),
	},
	carouselContent: {
		paddingHorizontal: horizontalScale(4),
		gap: horizontalScale(12),
	},
	seeAllCard: {
		width: horizontalScale(120),
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(16),
		borderWidth: 1,
		borderColor: "#EDEDED",
		alignItems: "center",
		justifyContent: "center",
		marginLeft: horizontalScale(4),
	},
	seeAllCardText: {
		fontSize: moderateScale(14),
		color: "#999",
		marginTop: verticalScale(8),
	},

	/* ── Stats ── */
	statsSection: {
		marginTop: verticalScale(24),
	},
	statsRow: {
		flexDirection: "row",
		gap: horizontalScale(12),
	},
	statCard: {
		flex: 1,
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(16),
		borderWidth: 1,
		borderColor: "#EDEDED",
		paddingVertical: verticalScale(20),
		paddingHorizontal: horizontalScale(16),
		alignItems: "center",
	},
	statNumber: {
		fontSize: moderateScale(32),
		color: "#1A1A1A",
		lineHeight: moderateScale(38),
	},
	statLabel: {
		fontSize: moderateScale(13),
		color: "#888",
		textAlign: "center",
		marginTop: verticalScale(4),
		lineHeight: moderateScale(18),
	},
});
