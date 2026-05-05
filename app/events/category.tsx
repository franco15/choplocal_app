import { CustomText as Text, CustomTextBold as TextBold } from "@/components/Texts";
import EventListRow from "@/components/events/EventListRow";
import { useAuthContext } from "@/contexts/AuthContext";
import { useDropsList } from "@/lib/api/queries/dropQueries";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo } from "react";
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CategoryScreen() {
	const { tag } = useLocalSearchParams<{ tag: string }>();
	const insets = useSafeAreaInsets();
	const { userAuth } = useAuthContext();
	const userId = userAuth?.id;

	const { data, isLoading } = useDropsList(userId);

	const events = useMemo(() => {
		const published = (data ?? [])
			.filter((e) => e.status === "published")
			.sort(
				(a, b) =>
					new Date(a.startDate).getTime() -
					new Date(b.startDate).getTime(),
			);
		if (tag === "trending") {
			return [...published].sort((a, b) => b.rsvpCount - a.rsvpCount);
		}
		return published.filter((e) => e.tags.includes(tag || ""));
	}, [data, tag]);

	const goBack = useCallback(() => {
		router.back();
	}, []);

	const displayName = tag === "trending" ? "trending" : (tag || "").toLowerCase();

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			{/* Back button */}
			<View style={styles.topBar}>
				<TouchableOpacity
					onPress={goBack}
					activeOpacity={0.7}
					hitSlop={10}
				>
					<Ionicons
						name="chevron-back"
						size={moderateScale(24)}
						color="#1A1A1A"
					/>
				</TouchableOpacity>
			</View>

			{/* Big centered title */}
			<View style={styles.titleWrap}>
				<TextBold style={styles.bigTitle}>{displayName}</TextBold>
			</View>

			{/* Event list */}
			{isLoading ? (
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

	/* Top bar */
	topBar: {
		paddingHorizontal: horizontalScale(16),
		paddingTop: verticalScale(8),
		paddingBottom: verticalScale(4),
	},

	/* Big title */
	titleWrap: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: verticalScale(20),
		paddingBottom: verticalScale(24),
	},
	bigTitle: {
		fontSize: moderateScale(40),
		color: "#1A1A1A",
		textTransform: "lowercase",
		letterSpacing: 0.5,
	},
});
