import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { IEvent } from "@/lib/types/event";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback } from "react";
import { Image, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { CustomText as Text, CustomTextBold as TextBold } from "../Texts";

type Props = {
	event: IEvent;
	onRsvp?: (event: IEvent) => void;
	containerStyle?: ViewStyle;
};

const formatDateCompact = (dateStr: string): string => {
	const date = new Date(dateStr);
	const months = [
		"Ene",
		"Feb",
		"Mar",
		"Abr",
		"May",
		"Jun",
		"Jul",
		"Ago",
		"Sep",
		"Oct",
		"Nov",
		"Dic",
	];
	const num = date.getDate();
	const month = months[date.getMonth()];
	const hours = date.getHours();
	const ampm = hours >= 12 ? "PM" : "AM";
	const h = hours % 12 || 12;
	return `${num} ${month} · ${h}${ampm}`;
};

export default function EventCardSmall({ event, onRsvp, containerStyle }: Props) {
	const isSoldOut =
		event.capacity !== null && event.rsvpCount >= event.capacity;
	const spotsLeft =
		event.capacity !== null ? event.capacity - event.rsvpCount : null;

	const onPress = useCallback(() => {
		router.push({ pathname: "/events/[id]", params: { id: event.id } });
	}, [event.id]);

	const visibleTags = event.tags.slice(0, 2);
	const extraTags = event.tags.length - 2;

	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [
				styles.card,
				containerStyle,
				{ transform: [{ scale: pressed ? 0.97 : 1 }] },
			]}
		>
			{/* Image area */}
			<View style={styles.imageArea}>
				{event.coverImage ? (
					<Image
						source={{ uri: event.coverImage }}
						style={styles.image}
						resizeMode="cover"
					/>
				) : (
					<View
						style={[
							styles.image,
							{ backgroundColor: event.accentColor },
						]}
					/>
				)}
				<LinearGradient
					colors={["transparent", "rgba(0,0,0,0.6)"]}
					style={styles.gradient}
				/>

				{/* Status badge */}
				{isSoldOut ? (
					<View style={[styles.badge, styles.badgeSoldOut]}>
						<TextBold style={styles.badgeText}>Sold out</TextBold>
					</View>
				) : event.userRsvp === "confirmed" ? (
					<View style={[styles.badge, styles.badgeConfirmed]}>
						<TextBold style={styles.badgeText}>{"✓"}</TextBold>
					</View>
				) : event.userRsvp === "pending" ? (
					<View style={[styles.badge, styles.badgePending]}>
						<TextBold style={styles.badgeTextDark}>{"⏳"}</TextBold>
					</View>
				) : null}
			</View>

			{/* Info */}
			<View style={styles.info}>
				<TextBold numberOfLines={2} style={styles.title}>
					{event.title}
				</TextBold>

				<Text numberOfLines={1} style={styles.restaurant}>
					{event.restaurant.name}
				</Text>

				<Text style={styles.date}>{formatDateCompact(event.startDate)}</Text>

				{/* Tags */}
				<View style={styles.tagsRow}>
					{visibleTags.map((tag) => (
						<View
							key={tag}
							style={[
								styles.tagChip,
								{ backgroundColor: `${event.accentColor}18` },
							]}
						>
							<Text
								style={[
									styles.tagText,
									{ color: event.accentColor },
								]}
							>
								{tag}
							</Text>
						</View>
					))}
					{extraTags > 0 && (
						<View style={styles.tagChip}>
							<Text style={styles.tagTextExtra}>+{extraTags}</Text>
						</View>
					)}
				</View>

				{/* Capacity indicator */}
				{isSoldOut ? (
					<Text style={styles.soldOutText}>Sold out</Text>
				) : spotsLeft !== null && spotsLeft <= 10 ? (
					<Text style={styles.spotsText}>
						{spotsLeft} {spotsLeft === 1 ? "lugar" : "lugares"}
					</Text>
				) : null}
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	card: {
		width: 200,
		borderRadius: moderateScale(16),
		overflow: "hidden",
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#EDEDED",
	},
	imageArea: {
		height: 130,
		position: "relative",
	},
	image: {
		width: "100%",
		height: "100%",
	},
	gradient: {
		...StyleSheet.absoluteFillObject,
	},
	badge: {
		position: "absolute",
		top: 8,
		right: 8,
		paddingHorizontal: horizontalScale(8),
		paddingVertical: verticalScale(3),
		borderRadius: moderateScale(6),
	},
	badgeSoldOut: {
		backgroundColor: "#EF4444",
	},
	badgeConfirmed: {
		backgroundColor: "#10B981",
	},
	badgePending: {
		backgroundColor: "#FBBF24",
	},
	badgeText: {
		color: "#FFFFFF",
		fontSize: moderateScale(10),
	},
	badgeTextDark: {
		color: "#1A1A1A",
		fontSize: moderateScale(10),
	},
	info: {
		padding: moderateScale(12),
	},
	title: {
		fontSize: moderateScale(15),
		color: "#1A1A1A",
		lineHeight: moderateScale(20),
		marginBottom: verticalScale(4),
	},
	restaurant: {
		fontSize: moderateScale(12),
		color: "#888",
		marginBottom: verticalScale(2),
	},
	date: {
		fontSize: moderateScale(12),
		color: "#888",
		marginBottom: verticalScale(8),
	},
	tagsRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: horizontalScale(4),
		marginBottom: verticalScale(6),
	},
	tagChip: {
		paddingHorizontal: horizontalScale(8),
		paddingVertical: verticalScale(2),
		borderRadius: moderateScale(6),
		backgroundColor: "#F5F5F5",
	},
	tagText: {
		fontSize: moderateScale(10),
	},
	tagTextExtra: {
		fontSize: moderateScale(10),
		color: "#999",
	},
	soldOutText: {
		fontSize: moderateScale(11),
		color: "#EF4444",
		fontWeight: "600",
	},
	spotsText: {
		fontSize: moderateScale(11),
		color: "#10B981",
		fontWeight: "600",
	},
});
