import { Text, TextBold } from "@/components";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
	Platform,
	SectionList,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NotificationType = "gift" | "recommendation" | "system";

interface INotification {
	id: string;
	type: NotificationType;
	title: string;
	description: string;
	timestamp: Date;
	read: boolean;
}

const TYPE_CONFIG: Record<
	NotificationType,
	{ icon: keyof typeof Ionicons.glyphMap; bg: string; color: string }
> = {
	gift: { icon: "gift-outline", bg: "#FBF6F5", color: "#96190F" },
	recommendation: { icon: "people-outline", bg: "#EEF7F7", color: "#438989" },
	system: { icon: "megaphone-outline", bg: "#E8F0FE", color: "#3B6CD4" },
};

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);
const daysAgo = (d: number) =>
	new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

const MOCK_NOTIFICATIONS: INotification[] = [
	{
		id: "1",
		type: "gift",
		title: "Gift Card Received",
		description: "You received a $25 gift card from Maria Garcia",
		timestamp: hoursAgo(2),
		read: false,
	},
	{
		id: "2",
		type: "recommendation",
		title: "Recommendation Used",
		description:
			"John used your recommendation code for Tacos El Güero",
		timestamp: hoursAgo(5),
		read: false,
	},
	{
		id: "3",
		type: "gift",
		title: "Gift Card Expiring",
		description: "Your gift card for Pizza Plaza expires in 3 days",
		timestamp: daysAgo(1),
		read: true,
	},
	{
		id: "4",
		type: "system",
		title: "Welcome to Chop Local!",
		description:
			"Start exploring restaurants near you and earn cashback on every visit",
		timestamp: daysAgo(2),
		read: true,
	},
	{
		id: "5",
		type: "system",
		title: "New Restaurant",
		description: "La Nacional has just been added to Chop Local",
		timestamp: daysAgo(3),
		read: true,
	},
	{
		id: "6",
		type: "recommendation",
		title: "Reward Earned",
		description:
			"Sarah redeemed your recommendation for O'BeerLine — you earned $7!",
		timestamp: daysAgo(4),
		read: true,
	},
];

function getRelativeTime(date: Date): string {
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	if (diffMins < 60) return `${diffMins}m ago`;
	const diffHours = Math.floor(diffMins / 60);
	if (diffHours < 24) return `${diffHours}h ago`;
	const diffDays = Math.floor(diffHours / 24);
	if (diffDays === 1) return "Yesterday";
	return `${diffDays}d ago`;
}

function getSectionTitle(date: Date): string {
	const diffMs = now.getTime() - date.getTime();
	const diffHours = diffMs / (60 * 60 * 1000);
	if (diffHours < 24) return "Today";
	if (diffHours < 48) return "Yesterday";
	return "Earlier";
}

export default function NotificationsScreen() {
	const insets = useSafeAreaInsets();
	const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

	const sections = useMemo(() => {
		const grouped: Record<string, INotification[]> = {};
		const order = ["Today", "Yesterday", "Earlier"];

		for (const n of notifications) {
			const section = getSectionTitle(n.timestamp);
			if (!grouped[section]) grouped[section] = [];
			grouped[section].push(n);
		}

		return order
			.filter((title) => grouped[title])
			.map((title) => ({ title, data: grouped[title] }));
	}, [notifications]);

	const markAsRead = (id: string) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
		);
	};

	const unreadCount = notifications.filter((n) => !n.read).length;

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
			<SectionList
				sections={sections}
				showsVerticalScrollIndicator={false}
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
					const config = TYPE_CONFIG[item.type];
					return (
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => markAsRead(item.id)}
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
						</TouchableOpacity>
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
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: "#FFFFFF",
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
