import { CustomText as Text, CustomTextBold as TextBold } from "@/components/Texts";
import { useAuthContext } from "@/contexts/AuthContext";
import { useDropsList } from "@/lib/api/queries/dropQueries";
import { ALL_CATEGORIES } from "@/lib/constants/dropCategories";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useMemo } from "react";
import {
	ActivityIndicator,
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AllCategoriesScreen() {
	const insets = useSafeAreaInsets();
	const { userAuth } = useAuthContext();
	const userId = userAuth?.id;

	const { data, isLoading } = useDropsList(userId);

	const counts = useMemo(() => {
		const result: Record<string, number> = {};
		const published = (data ?? []).filter((e) => e.status === "published");
		for (const cat of ALL_CATEGORIES) {
			result[cat.name] = published.filter((e) =>
				e.tags.includes(cat.name),
			).length;
		}
		return result;
	}, [data]);

	const navigateToCategory = useCallback((tag: string) => {
		router.push({
			pathname: "/events/category",
			params: { tag },
		});
	}, []);

	if (isLoading) {
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
				<TouchableOpacity
					onPress={() => router.back()}
					activeOpacity={0.7}
					hitSlop={10}
				>
					<Ionicons
						name="chevron-back"
						size={moderateScale(24)}
						color="#1A1A1A"
					/>
				</TouchableOpacity>
				<TextBold style={styles.headerTitle}>All Categories</TextBold>
				<View style={{ width: moderateScale(24) }} />
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.list}
			>
				{ALL_CATEGORIES.map((cat) => (
					<Pressable
						key={cat.name}
						onPress={() => navigateToCategory(cat.name)}
						style={({ pressed }) => [
							styles.categoryCard,
							{
								opacity: pressed ? 0.85 : 1,
								transform: [{ scale: pressed ? 0.98 : 1 }],
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
							<TextBold style={styles.categoryName}>
								{cat.name.toLowerCase()}
							</TextBold>
							<Text style={styles.categoryCount}>
								{counts[cat.name] ?? 0}{" "}
								{(counts[cat.name] ?? 0) === 1
									? "drop"
									: "drops"}
							</Text>
						</View>
					</Pressable>
				))}
			</ScrollView>
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
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: horizontalScale(16),
		paddingVertical: verticalScale(14),
	},
	headerTitle: {
		fontSize: moderateScale(18),
		color: "#1A1A1A",
	},
	list: {
		paddingHorizontal: horizontalScale(16),
		paddingBottom: verticalScale(40),
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
		fontSize: moderateScale(14),
		color: "rgba(255,255,255,0.8)",
	},
});
