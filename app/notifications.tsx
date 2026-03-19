import { Text, TextBold } from "@/components";
import { useUserContext } from "@/contexts/UserContext";
import { queryClient, queryKeys } from "@/lib/api/queryClient";
import { useNotificationsApi } from "@/lib/api/useApi";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { INotification, IGiftCardNotificationData, NotificationType } from "@/lib/types/notification";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Platform,
	Pressable,
	RefreshControl,
	SectionList,
	StyleSheet,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TYPE_CONFIG: Record<
	string,
	{ icon: keyof typeof Ionicons.glyphMap; bg: string; color: string }
> = {
	[NotificationType.GiftCard]: { icon: "gift-outline", bg: "#FBF6F5", color: "#b42406" },
	default: { icon: "megaphone-outline", bg: "#E8F0FE", color: "#3B6CD4" },
};

function getRelativeTime(dateStr: string): string {
	const date = new Date(dateStr);
	if (isNaN(date.getTime())) return "";
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	if (diffMins < 1) return "Just now";
	if (diffMins < 60) return `${diffMins}m ago`;
	const diffHours = Math.floor(diffMins / 60);
	if (diffHours < 24) return `${diffHours}h ago`;
	const diffDays = Math.floor(diffHours / 24);
	if (diffDays === 1) return "Yesterday";
	if (diffDays < 7) return `${diffDays}d ago`;
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getSectionTitle(dateStr: string): string {
	const date = new Date(dateStr);
	if (isNaN(date.getTime())) return "Before That";
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const notifDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const diffDays = Math.floor((today.getTime() - notifDay.getTime()) / (24 * 60 * 60 * 1000));
	if (diffDays === 0) return "Today";
	if (diffDays <= 7) return "This Week";
	return "Before That";
}

function getNotificationIcon(item: INotification): {
	icon: keyof typeof Ionicons.glyphMap;
	bg: string;
	color: string;
} {
	return TYPE_CONFIG[item.type] ?? TYPE_CONFIG.default;
}

function parseNotificationData<T>(data?: string): T | null {
	if (!data) return null;
	try {
		return JSON.parse(data) as T;
	} catch {
		return null;
	}
}

export default function NotificationsScreen() {
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const { user } = useUserContext();
	const notificationsApi = useNotificationsApi();

	const { data: notifications = [], isPending } = useQuery({
		queryKey: queryKeys.notifications.byUser(user?.id ?? ""),
		queryFn: () => notificationsApi.byUser(user!.id),
		enabled: !!user?.id,
		staleTime: 10000
	});

	const sections = useMemo(() => {
		const grouped: Record<string, INotification[]> = {};
		const order = ["Today", "This Week", "Before That"];

		for (const n of notifications) {
			const section = getSectionTitle(n.timestamp);
			if (!grouped[section]) grouped[section] = [];
			grouped[section].push(n);
		}

		return order
			.filter((title) => grouped[title])
			.map((title) => ({ title, data: grouped[title] }));
	}, [notifications]);

	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await queryClient.invalidateQueries({ queryKey: queryKeys.notifications.byUser(user.id) });
		setRefreshing(false);
	}, [user.id]);

	const unreadCount = notifications.filter((n) => !n.read).length;

	const onNotificationPress = useCallback(async (item: INotification) => {
		// Mark as read
		if (!item.read) {
			try {
				await notificationsApi.markAsRead(item.id);
				queryClient.invalidateQueries({
					queryKey: queryKeys.notifications.byUser(user.id),
				});
			} catch (_) {
				// Continue navigating even if mark-as-read fails
			}
		}

		if (item.type === NotificationType.GiftCard) {
			const parsed = parseNotificationData<IGiftCardNotificationData>(item.data);
			const giftCardId = parsed?.GiftCardId ?? item.giftCardId ?? "";

			router.push({
				pathname: "/gift-cards/notification-detail",
				params: { giftCardId },
			});
			return;
		}

		router.push({
			pathname: "/gift-cards/notification-detail",
			params: {
				giftCardId: item.giftCardId ?? "",
			},
		});
	}, [router, notificationsApi, user.id]);

	return (
		<View
			style={[
				styles.root,
				{
					paddingTop:
						Platform.OS === "ios" ? 0 : insets.top + verticalScale(16),
				},
			]}
		>
			{isPending ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#b42406" />
				</View>
			) : (
				<SectionList
					sections={sections}
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#b42406" progressViewOffset={100} />
					}
					stickySectionHeadersEnabled={false}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{
						paddingHorizontal: horizontalScale(16),
						paddingBottom: verticalScale(60),
					}}
					ListHeaderComponent={
						<View style={{ paddingBottom: verticalScale(8) }}>
							<TextBold style={styles.title}>Notifications</TextBold>
							{unreadCount > 0 && (
								<Text style={styles.subtitle}>
									{unreadCount} unread
								</Text>
							)}
						</View>
					}
					renderSectionHeader={({ section: { title } }) => (
						<View style={styles.sectionHeader}>
							<TextBold style={styles.sectionTitle}>{title}</TextBold>
						</View>
					)}
					renderItem={({ item }) => {
						const config = getNotificationIcon(item);
						return (
							<Pressable
								onPress={() => onNotificationPress(item)}
								style={styles.card}
							>
								{/* Unread dot */}
								{!item.read && <View style={styles.unreadDot} />}

								{/* Icon */}
								<View
									style={[
										styles.iconCircle,
										{ backgroundColor: config.bg },
									]}
								>
									<Ionicons
										name={config.icon}
										size={moderateScale(20)}
										color={config.color}
									/>
								</View>

								{/* Content */}
								<View style={{ flex: 1 }}>
									<View style={styles.cardHeader}>
										<TextBold
											style={styles.cardTitle}
											numberOfLines={1}
										>
											{item.title}
										</TextBold>
										<Text style={styles.cardTime}>
											{getRelativeTime(item.timestamp)}
										</Text>
									</View>
									<Text
										style={styles.cardDescription}
										numberOfLines={2}
									>
										{item.description}
									</Text>
								</View>
							</Pressable>
						);
					}}
					ListEmptyComponent={
						<View style={styles.emptyContainer}>
							<View style={styles.emptyIcon}>
								<Ionicons
									name="notifications-outline"
									size={moderateScale(32)}
									color="#CCC"
								/>
							</View>
							<TextBold style={styles.emptyTitle}>
								No notifications yet
							</TextBold>
							<Text style={styles.emptyText}>
								You'll see gift card updates, recommendations,
								{"\n"}and more here
							</Text>
						</View>
					}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	loadingContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: moderateScale(30),
		color: "#1A1A1A",
	},
	subtitle: {
		fontSize: moderateScale(14),
		color: "#888",
		marginTop: verticalScale(4),
	},

	/* Section */
	sectionHeader: {
		paddingTop: verticalScale(16),
		paddingBottom: verticalScale(8),
	},
	sectionTitle: {
		fontSize: moderateScale(15),
		color: "#999",
	},

	/* Card */
	card: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(16),
		borderWidth: 1,
		borderColor: "#EDEDED",
		padding: moderateScale(14),
		marginBottom: verticalScale(10),
	},
	unreadDot: {
		position: "absolute",
		top: moderateScale(14),
		left: moderateScale(14),
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#3B82F6",
		zIndex: 1,
	},
	iconCircle: {
		width: moderateScale(44),
		height: moderateScale(44),
		borderRadius: moderateScale(22),
		alignItems: "center",
		justifyContent: "center",
		marginRight: horizontalScale(12),
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	cardTitle: {
		fontSize: moderateScale(15),
		color: "#1A1A1A",
		flex: 1,
	},
	cardTime: {
		fontSize: moderateScale(12),
		color: "#AAA",
		marginLeft: horizontalScale(8),
	},
	cardDescription: {
		fontSize: moderateScale(13),
		color: "#888",
		marginTop: verticalScale(4),
		lineHeight: moderateScale(18),
	},

	/* Empty */
	emptyContainer: {
		alignItems: "center",
		paddingTop: verticalScale(80),
	},
	emptyIcon: {
		width: moderateScale(72),
		height: moderateScale(72),
		borderRadius: moderateScale(36),
		backgroundColor: "#F5F5F5",
		alignItems: "center",
		justifyContent: "center",
	},
	emptyTitle: {
		fontSize: moderateScale(16),
		color: "#1A1A1A",
		marginTop: verticalScale(16),
	},
	emptyText: {
		fontSize: moderateScale(13),
		color: "#999",
		marginTop: verticalScale(4),
		textAlign: "center",
	},
});
