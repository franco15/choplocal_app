import CityDropdown from "@/components/CityDropdown";
import GiftCardBanner from "@/components/GiftCardBanner";
import RedeemCodeBanner from "@/components/RedeemCodeBanner";
import GradientBackground from "@/components/GradientBackground";
import HomeRestaurantCard from "@/components/HomeRestaurantCard";
import SectionHeader from "@/components/SectionHeader";
import { TextBold, Text } from "@/components";
import { Bell } from "@/constants/svgs";
import { useUserContext } from "@/contexts/UserContext";
import { queryClient, queryKeys } from "@/lib/api/queryClient";
import { useUserApi, useNotificationsApi } from "@/lib/api/useApi";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { isNullOrWhitespace } from "@/lib/utils";
import { ERestaurantStatus, IRestaurant } from "@/lib/types/restaurant";
import { useQuery } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from "react-native";
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
import { AVAILABLE_CITIES } from "@/components/CityDropdown";

const FAVORITES_KEY = "choplocal-favorites";

const COLLAPSE_DISTANCE = 100;

export default function HomeScreen() {
	const { profileComplete, user, isUserLoading } = useUserContext();
	const userApi = useUserApi();
	const notificationsApi = useNotificationsApi();
	const insets = useSafeAreaInsets();
	const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
	const [selectedCity, setSelectedCity] = useState(AVAILABLE_CITIES[0]);
	const [cityModalOpen, setCityModalOpen] = useState(false);
	const scrollY = useSharedValue(0);
	const [refreshing, setRefreshing] = useState(false);

	const { data: restaurants } = useQuery({
		queryKey: [queryKeys.users.restaurants],
		queryFn: async () => {
			const data = await userApi.restaurants(user.id);
			return data;
		},
		enabled: !!user && !isNullOrWhitespace(user?.id),
	});

	const { data: notifications = [] } = useQuery({
		queryKey: queryKeys.notifications.byUser(user?.id ?? ""),
		queryFn: () => notificationsApi.byUser(user!.id),
		enabled: !!user && !isNullOrWhitespace(user?.id),
		staleTime: 10000,
	});

	const hasUnread = notifications.some((n) => !n.read);

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

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await queryClient.invalidateQueries({ queryKey: [queryKeys.users.restaurants] });
		await queryClient.invalidateQueries({ queryKey: queryKeys.notifications.byUser(user?.id ?? "") });
		setRefreshing(false);
	}, [user?.id]);

	// Group restaurants by category
	const groups = useMemo(() => {
		if (!restaurants)
			return { visited: [], recommended: [], popular: [], new: [] };

		return {
			visited: restaurants.filter(
				(r) => r.status === ERestaurantStatus.Visited,
			),
			recommended: restaurants.filter(
				(r) => r.status === ERestaurantStatus.Recommended,
			),
			popular: [...restaurants]
				.sort((a, b) => b.checkIns - a.checkIns)
				.slice(0, 10),
			new: [...restaurants]
				.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
				.slice(0, 15),
		};
	}, [restaurants]);

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
		variant?: "default" | "popular",
	) => {
		const limited = data.slice(0, MAX_CAROUSEL);
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
						variant={variant}
					/>
				)}

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
					style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
				>
					<Text style={styles.stickyText}>Ready to explore </Text>
					<TextBold style={styles.stickyCity}>City</TextBold>
					<Ionicons name="chevron-down" size={moderateScale(16)} color="#1A1A1A" style={{ marginLeft: 4 }} />
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
					{hasUnread && <View style={styles.notifDot} />}
				</Pressable>
			</Animated.View>

			{/* ── Scrollable content ── */}
			<Animated.ScrollView
				onScroll={scrollHandler}
				scrollEventThrottle={16}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#b42406" progressViewOffset={100} />
				}
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
						{hasUnread && <View style={styles.notifDot} />}
					</Pressable>

					{/* "Hello, Name." — fades on scroll */}
					<Animated.View style={helloStyle}>
						<TextBold style={styles.heroHello}>
							Hello, {user.firstName}.
						</TextBold>
					</Animated.View>

					<View>
						<Text style={styles.heroSubtitle}>
							Ready to explore
						</Text>
						<Pressable onPress={() => setCityModalOpen(true)} style={{ flexDirection: "row", alignItems: "center" }}>
							<TextBold style={styles.heroCity}>City</TextBold>
							<Ionicons name="chevron-down" size={moderateScale(18)} color="rgba(0,0,0,0.5)" style={{ marginLeft: 4 }} />
						</Pressable>
					</View>
				</View>

				{/* ── Restaurant Sections ── */}

				{/* Popular */}
				{groups.popular.length > 0 && (
					<View style={styles.section}>
						<SectionHeader
							title="Popular"
							subtitle="Most visited by the community"
							onSeeAll={() => goToSeeAll("popular")}
						/>
						{renderCarousel(groups.popular, "popular", "popular", "popular")}
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

				{/* Redeem Code & Gift Card Banners */}
				<View style={styles.bannerSection}>
					<RedeemCodeBanner />
					<GiftCardBanner />
				</View>

				{/* Stats */}
				<View style={styles.statsRow}>
					<View style={styles.statItem}>
						<TextBold style={styles.statNumber}>
							{restaurants?.filter((r) => r.checkIns >= 1).length ?? 0}
						</TextBold>
						<Text style={styles.statLabel}>Visited</Text>
					</View>
					<View style={styles.statDivider} />
					<View style={styles.statItem}>
						<TextBold style={styles.statNumber}>
							{(restaurants?.length ?? 0) - (restaurants?.filter((r) => r.checkIns >= 1).length ?? 0)}
						</TextBold>
						<Text style={styles.statLabel}>To Explore</Text>
					</View>
					<View style={styles.statDivider} />
					<View style={styles.statItem}>
						<TextBold style={styles.statNumber}>
							{restaurants?.length ?? 0}
						</TextBold>
						<Text style={styles.statLabel}>Total</Text>
					</View>
				</View>

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
			</Animated.ScrollView>

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
	notifDot: {
		position: "absolute",
		top: -2,
		right: -2,
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: "#E53935",
		borderWidth: 1.5,
		borderColor: "#FFFFFF",
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
	/* ── Stats ── */
	statsRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: verticalScale(24),
		paddingVertical: verticalScale(6),
	},
	statItem: {
		flex: 1,
		alignItems: "center",
	},
	statDivider: {
		width: 1,
		height: moderateScale(32),
		backgroundColor: "#EDEDED",
	},
	statNumber: {
		fontSize: moderateScale(34),
		color: "#1A1A1A",
		lineHeight: moderateScale(40),
	},
	statLabel: {
		fontSize: moderateScale(11),
		color: "#BBB",
		marginTop: verticalScale(2),
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
});
