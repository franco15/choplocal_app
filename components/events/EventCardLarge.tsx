import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { IEvent } from "@/lib/types/event";
import { router } from "expo-router";
import { useCallback } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { CustomText as Text, CustomTextBold as TextBold } from "../Texts";

type Props = {
	event: IEvent;
};

const formatDate = (dateStr: string): string => {
	const date = new Date(dateStr);
	const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const months = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
	];
	const now = new Date();
	const tomorrow = new Date(now);
	tomorrow.setDate(now.getDate() + 1);

	const dayName = days[date.getDay()];
	const month = months[date.getMonth()];
	const num = date.getDate();
	const hours = date.getHours();
	const ampm = hours >= 12 ? "pm" : "am";
	const h = hours % 12 || 12;

	// "Tomorrow at 5pm" or "Saturday, Apr 18 at 1pm"
	if (
		date.getDate() === tomorrow.getDate() &&
		date.getMonth() === tomorrow.getMonth()
	) {
		return `Tomorrow at ${h}${ampm}`;
	}
	return `${dayName}, ${month} ${num} at ${h}${ampm}`;
};

const formatPrice = (price: number | null): string => {
	if (price === null || price === 0) return "Free";
	return `$${price.toFixed(2)}`;
};

export default function EventCardLarge({ event }: Props) {
	const onPress = useCallback(() => {
		router.push({ pathname: "/events/[id]", params: { id: event.id } });
	}, [event.id]);

	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [
				styles.card,
				{ transform: [{ scale: pressed ? 0.97 : 1 }] },
			]}
		>
			{/* Poster image */}
			<View style={styles.imageContainer}>
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
			</View>

			{/* Info below image */}
			<View style={styles.info}>
				<TextBold numberOfLines={2} style={styles.title}>
					{event.title}
				</TextBold>
				<Text numberOfLines={1} style={styles.venue}>
					{formatPrice(event.price)} at {event.restaurant.name}
				</Text>
				<Text style={styles.date}>{formatDate(event.startDate)}</Text>
			</View>
		</Pressable>
	);
}

const CARD_WIDTH = horizontalScale(230);
const IMAGE_HEIGHT = verticalScale(290);

const styles = StyleSheet.create({
	card: {
		width: CARD_WIDTH,
	},
	imageContainer: {
		width: CARD_WIDTH,
		height: IMAGE_HEIGHT,
		borderRadius: moderateScale(16),
		overflow: "hidden",
		backgroundColor: "#F0F0F0",
	},
	image: {
		width: "100%",
		height: "100%",
	},
	info: {
		paddingTop: verticalScale(10),
		paddingHorizontal: horizontalScale(4),
	},
	title: {
		fontSize: moderateScale(16),
		color: "#1A1A1A",
		lineHeight: moderateScale(21),
	},
	venue: {
		fontSize: moderateScale(13),
		color: "#888",
		marginTop: verticalScale(3),
	},
	date: {
		fontSize: moderateScale(13),
		color: "#888",
		marginTop: verticalScale(1),
	},
});
