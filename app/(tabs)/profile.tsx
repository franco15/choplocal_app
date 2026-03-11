import { Text, TextBold } from "@/components";
import { useUserContext } from "@/contexts/UserContext";
import { queryKeys } from "@/lib/api/queryClient";
import { useUserApi } from "@/lib/api/useApi";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { isNullOrWhitespace } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
	const { user } = useUserContext();
	const userApi = useUserApi();
	const insets = useSafeAreaInsets();

	const { data: restaurants } = useQuery({
		queryKey: [queryKeys.users.restaurants],
		queryFn: async () => {
			const data = await userApi.restaurants(user.id);
			return data;
		},
		enabled: !!user && !isNullOrWhitespace(user?.id),
	});

	const initials = useMemo(() => {
		if (!user) return "";
		return `${(user.firstName?.[0] ?? "").toUpperCase()}${(user.lastName?.[0] ?? "").toUpperCase()}`;
	}, [user]);

	const stats = useMemo(() => {
		if (!restaurants) return { visited: 0, remaining: 0 };
		const visited = restaurants.filter((r) => r.checkIns >= 1).length;
		return {
			visited,
			remaining: restaurants.length - visited,
		};
	}, [restaurants]);

	const topRestaurants = useMemo(() => {
		if (!restaurants) return [];
		return [...restaurants]
			.filter((r) => r.checkIns >= 1)
			.sort((a, b) => b.checkIns - a.checkIns)
			.slice(0, 3);
	}, [restaurants]);

	if (!user) return null;

	return (
		<View style={styles.root}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: verticalScale(120) }}
			>
				{/* Red Header */}
				<View style={[styles.redHeader, { paddingTop: insets.top + verticalScale(16) }]}>
					{/* Settings gear */}
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={() => router.push("/settings")}
						hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
						style={{
							position: "absolute",
							top: insets.top + verticalScale(16),
							right: horizontalScale(16),
							width: moderateScale(40),
							height: moderateScale(40),
							borderRadius: moderateScale(20),
							backgroundColor: "rgba(255,255,255,0.2)",
							alignItems: "center",
							justifyContent: "center",
							zIndex: 10,
						}}
					>
						<Ionicons name="settings-outline" size={moderateScale(22)} color="#FFFFFF" />
					</TouchableOpacity>

					{/* Avatar */}
					<View style={styles.avatarCircle}>
						<TextBold style={styles.avatarText}>{initials}</TextBold>
					</View>

					{/* Name */}
					<TextBold style={styles.name}>
						{user.firstName} {user.lastName}
					</TextBold>
				</View>

				{/* Content */}
				<View style={styles.content}>
					{/* Info Card */}
					<View style={styles.card}>
						{user.email ? (
							<View style={styles.infoRow}>
								<Ionicons name="mail-outline" size={moderateScale(18)} color="#96190F" />
								<Text style={styles.infoText}>{user.email}</Text>
							</View>
						) : null}

						{user.phoneNumber ? (
							<View style={[styles.infoRow, styles.infoRowBorder]}>
								<Ionicons name="call-outline" size={moderateScale(18)} color="#96190F" />
								<Text style={styles.infoText}>{user.phoneNumber}</Text>
							</View>
						) : null}

						{user.birthDate ? (
							<View style={[styles.infoRow, styles.infoRowBorder]}>
								<Ionicons name="calendar-outline" size={moderateScale(18)} color="#96190F" />
								<Text style={styles.infoText}>
									{new Date(user.birthDate).toLocaleDateString("en-US", {
										month: "long",
										day: "numeric",
										year: "numeric",
									})}
								</Text>
							</View>
						) : null}
					</View>

					{/* Stats */}
					<View style={styles.statsCard}>
						<View style={styles.statsInner}>
							<TextBold style={styles.statVisited}>
								{String(stats.visited).padStart(2, "0")}
							</TextBold>
							<View style={styles.statDivider} />
							<Text style={styles.statTotal}>
								{restaurants?.length ?? 0}
							</Text>
							<Text style={styles.statDescription}>
								Restaurants you have{"\n"}visited
							</Text>
						</View>
					</View>

					{/* Top Restaurants */}
					<View style={styles.card}>
						<TextBold style={styles.sectionTitle}>Top Restaurants</TextBold>
						{topRestaurants.length > 0 ? (
							topRestaurants.map((r, i) => (
								<TouchableOpacity
									key={r.id}
									activeOpacity={0.7}
									onPress={() =>
										router.push({
											pathname: "/restaurants/[id]",
											params: { id: r.id },
										})
									}
									style={[
										styles.topItem,
										i < topRestaurants.length - 1 && styles.topItemBorder,
									]}
								>
									<View style={styles.topRank}>
										<TextBold style={styles.topRankText}>{i + 1}</TextBold>
									</View>
									<View style={{ flex: 1 }}>
										<TextBold style={styles.topName}>{r.name}</TextBold>
										<Text style={styles.topVisits}>
											{r.checkIns} {r.checkIns === 1 ? "visit" : "visits"}
										</Text>
									</View>
									<Ionicons name="chevron-forward" size={18} color="#CCC" />
								</TouchableOpacity>
							))
						) : (
							<View style={styles.emptyTop}>
								<Ionicons
									name="restaurant-outline"
									size={moderateScale(32)}
									color="#CCC"
								/>
								<Text style={styles.emptyTopText}>
									Visit your first restaurant!
								</Text>
							</View>
						)}
					</View>

					{/* Suggest a Restaurant Banner */}
					<TouchableOpacity
						activeOpacity={0.85}
						onPress={() => router.push("/suggest-restaurant")}
						style={styles.banner}
					>
						<View style={[styles.bannerIcon, { backgroundColor: "#EEF7F7" }]}>
							<Ionicons
								name="add-circle-outline"
								size={moderateScale(24)}
								color="#438989"
							/>
						</View>
						<View style={{ flex: 1, marginLeft: horizontalScale(14) }}>
							<TextBold style={styles.bannerTitle}>Suggest a Restaurant</TextBold>
							<Text style={styles.bannerSub}>
								Tell us which restaurants you'd like to see
							</Text>
						</View>
						<Ionicons name="chevron-forward" size={moderateScale(18)} color="#CCC" />
					</TouchableOpacity>

					{/* My Gift Cards Banner */}
					<TouchableOpacity
						activeOpacity={0.85}
						onPress={() => router.push("/gift-cards")}
						style={styles.banner}
					>
						<View style={[styles.bannerIcon, { backgroundColor: "#FBF6F5" }]}>
							<Ionicons
								name="gift-outline"
								size={moderateScale(24)}
								color="#96190F"
							/>
						</View>
						<View style={{ flex: 1, marginLeft: horizontalScale(14) }}>
							<TextBold style={styles.bannerTitle}>My Gift Cards</TextBold>
							<Text style={styles.bannerSub}>
								View your gift cards and balances
							</Text>
						</View>
						<Ionicons name="chevron-forward" size={moderateScale(18)} color="#CCC" />
					</TouchableOpacity>

				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: "#FEFCFB",
	},

	/* Red Header */
	redHeader: {
		backgroundColor: "#96190F",
		alignItems: "center",
		paddingBottom: verticalScale(40),
		borderBottomLeftRadius: moderateScale(30),
		borderBottomRightRadius: moderateScale(30),
	},
	avatarCircle: {
		width: moderateScale(80),
		height: moderateScale(80),
		borderRadius: moderateScale(40),
		backgroundColor: "#FFFFFF",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: verticalScale(12),
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	avatarText: {
		fontSize: moderateScale(28),
		color: "#96190F",
	},
	name: {
		fontSize: moderateScale(24),
		color: "#FFFFFF",
	},

	/* Content */
	content: {
		paddingHorizontal: horizontalScale(16),
		marginTop: -verticalScale(10),
	},

	/* Cards */
	card: {
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(16),
		borderWidth: 1,
		borderColor: "#EDEDED",
		padding: moderateScale(16),
		marginTop: verticalScale(16),
	},

	/* Info */
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: verticalScale(14),
	},
	infoRowBorder: {
		borderTopWidth: 1,
		borderTopColor: "#F0F0F0",
	},
	infoText: {
		fontSize: moderateScale(15),
		color: "#1A1A1A",
		marginLeft: horizontalScale(12),
	},

	/* Stats */
	statsCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(16),
		borderWidth: 1,
		borderColor: "#EDEDED",
		paddingVertical: verticalScale(24),
		paddingHorizontal: horizontalScale(20),
		marginTop: verticalScale(16),
	},
	statsInner: {
		flexDirection: "row",
		alignItems: "center",
	},
	statVisited: {
		fontSize: moderateScale(36),
		color: "#1A1A1A",
	},
	statDivider: {
		width: 1.5,
		height: moderateScale(36),
		backgroundColor: "#1A1A1A",
		marginHorizontal: horizontalScale(14),
	},
	statTotal: {
		fontSize: moderateScale(36),
		color: "#CCC",
	},
	statDescription: {
		fontSize: moderateScale(16),
		color: "#1A1A1A",
		marginLeft: horizontalScale(16),
		lineHeight: moderateScale(22),
	},

	/* Top Restaurants */
	sectionTitle: {
		fontSize: moderateScale(17),
		color: "#1A1A1A",
		marginBottom: verticalScale(12),
	},
	topItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: verticalScale(12),
	},
	topItemBorder: {
		borderBottomWidth: 1,
		borderBottomColor: "#F0F0F0",
	},
	topRank: {
		width: moderateScale(30),
		height: moderateScale(30),
		borderRadius: moderateScale(15),
		backgroundColor: "#FBF6F5",
		alignItems: "center",
		justifyContent: "center",
		marginRight: horizontalScale(12),
	},
	topRankText: {
		fontSize: moderateScale(13),
		color: "#96190F",
	},
	topName: {
		fontSize: moderateScale(15),
		color: "#1A1A1A",
	},
	topVisits: {
		fontSize: moderateScale(12),
		color: "#AAA",
		marginTop: verticalScale(2),
	},
	emptyTop: {
		alignItems: "center",
		paddingVertical: verticalScale(20),
	},
	emptyTopText: {
		fontSize: moderateScale(13),
		color: "#AAA",
		marginTop: verticalScale(8),
	},

	/* Banners */
	banner: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#EDEDED",
		borderRadius: moderateScale(16),
		padding: moderateScale(16),
		marginTop: verticalScale(10),
	},
	bannerIcon: {
		width: moderateScale(48),
		height: moderateScale(48),
		borderRadius: moderateScale(24),
		alignItems: "center",
		justifyContent: "center",
	},
	bannerTitle: {
		fontSize: moderateScale(16),
		color: "#1A1A1A",
	},
	bannerSub: {
		fontSize: moderateScale(13),
		color: "#888",
		marginTop: verticalScale(2),
	},
});
