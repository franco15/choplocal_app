import { CustomText as Text, CustomTextBold as TextBold } from "@/components/Texts";
import EventListRow from "@/components/events/EventListRow";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { ALL_CATEGORIES } from "@/lib/mock/eventsMock";
import { getEvents, getEventsByTag } from "@/lib/services/eventsService";
import { IEvent } from "@/lib/types/event";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Image,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CategoryScreen() {
	const { tag } = useLocalSearchParams<{ tag: string }>();
	const insets = useSafeAreaInsets();
	const [events, setEvents] = useState<IEvent[]>([]);
	const [loading, setLoading] = useState(true);

	const category = ALL_CATEGORIES.find((c) => c.name === tag);
	const accentColor = category?.color || "#1A1A1A";
	const categoryImage = category?.image;

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			try {
				const data =
					tag === "trending"
						? await getEvents()
						: await getEventsByTag(tag || "");
				setEvents(data);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, [tag]);

	const goBack = useCallback(() => {
		router.back();
	}, []);

	const displayName = tag === "trending" ? "trending" : (tag || "").toLowerCase();

	return (
		<View style={styles.container}>
			{/* Hero header */}
			<View style={styles.hero}>
				{categoryImage ? (
					<Image
						source={{ uri: categoryImage }}
						style={styles.heroImage}
						resizeMode="cover"
					/>
				) : null}
				<LinearGradient
					colors={[`${accentColor}DD`, `${accentColor}88`]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={styles.heroOverlay}
				/>

				{/* Back button */}
				<TouchableOpacity
					onPress={goBack}
					activeOpacity={0.7}
					style={[styles.backBtn, { top: insets.top + verticalScale(8) }]}
				>
					<Ionicons
						name="chevron-back"
						size={moderateScale(24)}
						color="#FFFFFF"
					/>
				</TouchableOpacity>

				{/* Category name centered */}
				<TextBold style={styles.heroTitle}>{displayName}</TextBold>
			</View>

			{/* Filter chips */}
			<View style={styles.filters}>
				{["Date", "Price", "Location"].map((filter) => (
					<TouchableOpacity
						key={filter}
						activeOpacity={0.7}
						style={styles.filterChip}
					>
						<Text style={styles.filterText}>{filter}</Text>
					</TouchableOpacity>
				))}
			</View>

			{/* Event list */}
			{loading ? (
				<View style={styles.centered}>
					<ActivityIndicator size="large" color="#1A1A1A" />
				</View>
			) : events.length > 0 ? (
				<FlatList
					data={events}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => <EventListRow event={item} />}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						paddingBottom: verticalScale(40),
					}}
				/>
			) : (
				<View style={styles.centered}>
					<Ionicons
						name="calendar-outline"
						size={moderateScale(48)}
						color="#DDD"
					/>
					<Text style={styles.emptyText}>
						No drops in this category yet
					</Text>
				</View>
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
		gap: verticalScale(12),
	},
	emptyText: {
		fontSize: moderateScale(15),
		color: "#BBB",
	},

	/* Hero */
	hero: {
		height: verticalScale(200),
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
		overflow: "hidden",
	},
	heroImage: {
		...StyleSheet.absoluteFillObject,
		width: "100%",
		height: "100%",
	},
	heroOverlay: {
		...StyleSheet.absoluteFillObject,
	},
	backBtn: {
		position: "absolute",
		left: horizontalScale(16),
		zIndex: 2,
		width: moderateScale(36),
		height: moderateScale(36),
		borderRadius: moderateScale(18),
		backgroundColor: "rgba(0,0,0,0.3)",
		alignItems: "center",
		justifyContent: "center",
	},
	heroTitle: {
		fontSize: moderateScale(32),
		color: "#FFFFFF",
		letterSpacing: 1,
		zIndex: 1,
	},

	/* Filters */
	filters: {
		flexDirection: "row",
		paddingHorizontal: horizontalScale(16),
		paddingVertical: verticalScale(14),
		gap: horizontalScale(8),
		borderBottomWidth: 1,
		borderBottomColor: "#F3F3F3",
	},
	filterChip: {
		paddingHorizontal: horizontalScale(16),
		paddingVertical: verticalScale(8),
		borderRadius: moderateScale(20),
		borderWidth: 1,
		borderColor: "#E0E0E0",
	},
	filterText: {
		fontSize: moderateScale(13),
		color: "#666",
	},
});
