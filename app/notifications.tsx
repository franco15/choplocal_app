import { Text, TextBold } from "@/components";
import { useUserContext } from "@/contexts/UserContext";
import { queryClient, queryKeys } from "@/lib/api/queryClient";
import { useNotificationsApi } from "@/lib/api/useApi";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import {
	IGiftCardNotificationData,
	INotification,
	NotificationType,
} from "@/lib/types/notification";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Animated,
	Pressable,
	RefreshControl,
	SectionList,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import {
	GestureHandlerRootView,
	Swipeable,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TYPE_CONFIG: Record<
	string,
	{ icon: keyof typeof Ionicons.glyphMap; bg: string; color: string }
> = {
	[NotificationType.GiftCard]: {
		icon: "gift-outline",
		bg: "#FBF6F5",
		color: "#b42406",
	},
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
	if (isNaN(date.getTime())) return "Newest";
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const notifDay = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	);
	const diffDays = Math.floor(
		(today.getTime() - notifDay.getTime()) / (24 * 60 * 60 * 1000),
	);
	if (diffDays === 0) return "Today";
	if (diffDays <= 7) return "This Week";
	return "Newest";
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
		staleTime: 10000,
	});

	const sections = useMemo(() => {
		// Sort all notifications by date, newest first
		const sorted = [...notifications].sort(
			(a, b) =>
				new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
		);

		const grouped: Record<string, INotification[]> = {};
		const order = ["Today", "This Week", "Newest"];

		for (const n of sorted) {
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
		await queryClient.invalidateQueries({
			queryKey: queryKeys.notifications.byUser(user.id),
		});
		setRefreshing(false);
	}, [user.id]);

	const isRead = (n: INotification) => n.read || (n as any).isRead;
	const unreadCount = notifications.filter((n) => !isRead(n)).length;

	const onDeleteNotification = useCallback(
		(id: string) => {
			queryClient.setQueryData<INotification[]>(
				queryKeys.notifications.byUser(user?.id ?? ""),
				(old) => old?.filter((n) => n.id !== id),
			);
		},
		[user?.id],
	);

	const renderRightActions = useCallback(
		(
			progress: Animated.AnimatedInterpolation<number>,
			_dragX: Animated.AnimatedInterpolation<number>,
			id: string,
		) => {
			const translateX = progress.interpolate({
				inputRange: [0, 1],
				outputRange: [80, 0],
			});
			return (
				<Animated.View
					style={{ transform: [{ translateX }], justifyContent: "center" }}
				>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => onDeleteNotification(id)}
						style={styles.deleteBtn}
					>
						<Ionicons
							name="trash-outline"
							size={moderateScale(22)}
							color="#FFFFFF"
						/>
					</TouchableOpacity>
				</Animated.View>
			);
		},
		[onDeleteNotification],
	);

	const onNotificationPress = useCallback(
		(item: INotification) => {
			if (item.type === NotificationType.GiftCard) {
				const parsed = parseNotificationData<IGiftCardNotificationData>(
					item.data,
				);
				const giftCardId = parsed?.GiftCardId ?? item.giftCardId ?? "";

				router.push({
					pathname: "/gift-cards/notification-detail",
					params: {
						giftCardId,
						notificationId: item.read ? "" : item.id,
					},
				});
				return;
			}

			router.push({
				pathname: "/gift-cards/notification-detail",
				params: {
					giftCardId: item.giftCardId ?? "",
					notificationId: item.read ? "" : item.id,
				},
			});
		},
		[router],
	);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View style={[styles.root, {}]}>
				{isPending ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color="#b42406" />
					</View>
				) : (
					<SectionList
						sections={sections}
						showsVerticalScrollIndicator={false}
						refreshControl={
							<RefreshControl
								refreshing={refreshing}
								onRefresh={onRefresh}
								tintColor="#b42406"
								progressViewOffset={100}
							/>
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
									<Text style={styles.subtitle}>{unreadCount} unread</Text>
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
								<Swipeable
									renderRightActions={(progress, dragX) =>
										renderRightActions(progress, dragX, item.id)
									}
									overshootRight={false}
								>
									<Pressable
										onPress={() => onNotificationPress(item)}
										style={styles.card}
									>
										{/* Unread dot */}
										{!isRead(item) && <View style={styles.unreadDot} />}

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
												<TextBold style={styles.cardTitle} numberOfLines={1}>
													{item.title}
												</TextBold>
												<Text style={styles.cardTime}>
													{getRelativeTime(item.timestamp)}
												</Text>
											</View>
											<Text style={styles.cardDescription} numberOfLines={2}>
												{item.description}
											</Text>
										</View>
									</Pressable>
								</Swipeable>
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
		</GestureHandlerRootView>
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

	/* Delete */
	deleteBtn: {
		backgroundColor: "#FF3B30",
		width: moderateScale(64),
		height: "100%",
		borderRadius: moderateScale(16),
		alignItems: "center",
		justifyContent: "center",
		marginLeft: horizontalScale(8),
		marginBottom: verticalScale(10),
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
