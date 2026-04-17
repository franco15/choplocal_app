import { IEvent } from "@/lib/types/event";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { CustomText as Text, CustomTextBold as TextBold } from "../Texts";

type Props = {
	event: IEvent;
};

const formatDate = (dateStr: string): string => {
	const date = new Date(dateStr);
	const days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	const now = new Date();
	const tomorrow = new Date(now);
	tomorrow.setDate(now.getDate() + 1);

	const month = months[date.getMonth()];
	const num = date.getDate();
	const hours = date.getHours();
	const ampm = hours >= 12 ? "pm" : "am";
	const h = hours % 12 || 12;
	const dayName = days[date.getDay()];

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

export default function EventListRow({ event }: Props) {
	const onPress = useCallback(() => {
		router.push({ pathname: "/events/[id]", params: { id: event.id } });
	}, [event.id]);

	return (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={0.7}
			style={rowStyles.container}
		>
			<View style={rowStyles.content}>
				{/* Thumbnail */}
				{event.coverImage ? (
					<Image
						source={{ uri: event.coverImage }}
						style={rowStyles.thumb}
					/>
				) : (
					<View
						style={[
							rowStyles.thumb,
							{ backgroundColor: event.accentColor },
						]}
					/>
				)}

				{/* Text block */}
				<View style={rowStyles.textBlock}>
					<TextBold numberOfLines={2} style={rowStyles.name}>
						{event.title}
					</TextBold>
					<Text numberOfLines={1} style={rowStyles.meta}>
						{formatPrice(event.price)} · {event.restaurant.name}
					</Text>
					<Text numberOfLines={1} style={rowStyles.when}>
						{formatDate(event.startDate)}
					</Text>
				</View>

				{/* Bookmark icon */}
				<View style={rowStyles.bookmarkWrap}>
					<Ionicons
						name="bookmark-outline"
						size={22}
						color="#CCC"
					/>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const rowStyles = StyleSheet.create({
	container: {
		backgroundColor: "#FFFFFF",
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "#EBEBEB",
	},
	content: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		paddingLeft: 16,
		paddingRight: 16,
	},
	thumb: {
		width: 80,
		height: 80,
		borderRadius: 10,
		backgroundColor: "#F0F0F0",
	},
	textBlock: {
		flex: 1,
		marginLeft: 12,
		marginRight: 8,
		justifyContent: "center",
	},
	name: {
		fontSize: 15,
		color: "#1A1A1A",
		lineHeight: 20,
	},
	meta: {
		fontSize: 13,
		color: "#888",
		marginTop: 4,
	},
	when: {
		fontSize: 13,
		color: "#888",
		marginTop: 2,
	},
	bookmarkWrap: {
		width: 30,
		alignItems: "center",
		justifyContent: "center",
	},
});
