import { CustomText as Text, CustomTextBold as TextBold } from "@/components/Texts";
import EventListRow from "@/components/events/EventListRow";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { getEventsByRestaurant } from "@/lib/services/eventsService";
import { IEvent } from "@/lib/types/event";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RestaurantDropsScreen() {
	const { restaurantId, restaurantName } = useLocalSearchParams<{
		restaurantId: string;
		restaurantName: string;
	}>();
	const insets = useSafeAreaInsets();
	const [events, setEvents] = useState<IEvent[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			try {
				const data = await getEventsByRestaurant(
					restaurantId || "",
					restaurantName || "",
				);
				setEvents(data);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, [restaurantId, restaurantName]);

	const goBack = useCallback(() => {
		router.back();
	}, []);

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			{/* Header */}
			<View style={styles.header}>
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
				<View style={styles.headerCenter}>
					<TextBold style={styles.headerTitle} numberOfLines={1}>
						{restaurantName || "Restaurant"}
					</TextBold>
					<Text style={styles.headerSubtitle}>
						{events.length} {events.length === 1 ? "drop" : "drops"}
					</Text>
				</View>
				<View style={{ width: moderateScale(24) }} />
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
						No upcoming drops for this spot
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
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: horizontalScale(16),
		paddingVertical: verticalScale(14),
		borderBottomWidth: 1,
		borderBottomColor: "#F3F3F3",
	},
	headerCenter: {
		flex: 1,
		alignItems: "center",
	},
	headerTitle: {
		fontSize: moderateScale(18),
		color: "#1A1A1A",
	},
	headerSubtitle: {
		fontSize: moderateScale(12),
		color: "#999",
		marginTop: 2,
	},
	emptyText: {
		fontSize: moderateScale(15),
		color: "#BBB",
	},
});
