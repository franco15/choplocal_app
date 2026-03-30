import {
	CustomText as Text,
	CustomTextBold as TextBold,
} from "@/components/Texts";
import { Bookmark, BookmarkSolid } from "@/constants/svgs";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { ERestaurantStatus, IRestaurant } from "@/lib/types/restaurant";
import { router } from "expo-router";
import { MotiView } from "moti";
import { useCallback } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

const STATUS_LABELS: Record<number, string> = {
	[ERestaurantStatus.Visited]: "Visited",
	[ERestaurantStatus.Recommended]: "Recommended",
	[ERestaurantStatus.NotVisited]: "Not Visited",
};

const STATUS_COLORS: Record<number, { bg: string; text: string }> = {
	[ERestaurantStatus.Visited]: { bg: "#D4EDDA", text: "#2D6A3F" },
	[ERestaurantStatus.Recommended]: { bg: "#FFF3CD", text: "#856404" },
	[ERestaurantStatus.NotVisited]: { bg: "#D6E9F8", text: "#31708F" },
};

type Props = {
	restaurant: IRestaurant;
	index: number;
	isFavorited?: boolean;
	onToggleFavorite?: (id: string) => void;
};

export default function RestaurantCard({
	restaurant,
	index,
	isFavorited = false,
	onToggleFavorite,
}: Props) {
	const statusLabel =
		STATUS_LABELS[restaurant.status] ??
		STATUS_LABELS[ERestaurantStatus.NotVisited];
	const statusColor =
		STATUS_COLORS[restaurant.status] ??
		STATUS_COLORS[ERestaurantStatus.NotVisited];

	const getInitials = (name: string) =>
		name
			.split(" ")
			.slice(0, 2)
			.map((w) => w[0])
			.join("")
			.toUpperCase();

	const onFavorite = useCallback(() => {
		onToggleFavorite?.(restaurant.id);
	}, [restaurant.id, onToggleFavorite]);

	const onVisit = useCallback(() => {
		router.push({
			pathname: "/restaurants/[id]",
			params: { id: restaurant.id, name: restaurant.name },
		});
	}, [restaurant.id, restaurant.name]);

	return (
		<MotiView
			from={{ opacity: 0, translateY: 12 }}
			animate={{ opacity: 1, translateY: 0 }}
			transition={{ type: "timing", duration: 280, delay: index * 40 }}
		>
			<Pressable
				onPress={onVisit}
				style={({ pressed }) => [
					styles.card,
					{
						transform: [{ scale: pressed ? 0.985 : 1 }],
					},
				]}
			>
				{/* Main content row */}
				<View
					style={{
						flexDirection: "row",
						padding: moderateScale(14),
					}}
				>
					{/* Left: Avatar square */}
					<View
						style={[
							styles.avatar,
							{
								width: moderateScale(70),
								height: moderateScale(70),
								borderRadius: moderateScale(12),
								marginRight: horizontalScale(12),
								overflow: "hidden",
							},
						]}
					>
						{restaurant.logo ? (
							<Image
								source={{ uri: restaurant.logo }}
								style={{ width: "100%", height: "100%" }}
								resizeMode="cover"
							/>
						) : (
							<TextBold
								style={{
									color: "#999",
									fontSize: moderateScale(18),
								}}
							>
								{getInitials(restaurant.name)}
							</TextBold>
						)}
					</View>

					{/* Center: Info */}
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							paddingRight: horizontalScale(8),
						}}
					>
						<TextBold
							numberOfLines={1}
							style={{
								fontSize: moderateScale(15),
								color: "#1A1A1A",
								lineHeight: moderateScale(20),
							}}
						>
							{restaurant.name}
						</TextBold>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginTop: verticalScale(6),
								gap: horizontalScale(8),
								flexWrap: "nowrap",
							}}
						>
							<View
								style={[
									styles.statusTag,
									{
										paddingHorizontal: horizontalScale(8),
										paddingVertical: verticalScale(4),
										borderRadius: moderateScale(10),
										backgroundColor: statusColor.bg,
										flexShrink: 1,
									},
								]}
							>
								<Text
									numberOfLines={1}
									style={{
										fontSize: moderateScale(11),
										color: statusColor.text,
									}}
								>
									{statusLabel}
								</Text>
							</View>
							<Text
								numberOfLines={1}
								style={{
									fontSize: moderateScale(13),
									color: "#888",
									flexShrink: 0,
								}}
							>
								{restaurant.checkIns} visitas
							</Text>
							<Text
								numberOfLines={1}
								style={{
									fontSize: moderateScale(13),
									color: "#888",
									flexShrink: 0,
								}}
							>
								${restaurant.balance.toFixed(2)}
							</Text>
						</View>
					</View>

					{/* Right: Bookmark */}
					<View
						style={{
							alignItems: "flex-end",
							justifyContent: "center",
						}}
					>
						<Pressable
							onPress={onFavorite}
							hitSlop={14}
							style={({ pressed }) => ({
								transform: [{ scale: pressed ? 0.8 : 1 }],
							})}
						>
							{isFavorited ? (
								<BookmarkSolid
									width={horizontalScale(22)}
									height={verticalScale(22)}
									fill="#1A1A1A"
								/>
							) : (
								<Bookmark
									width={horizontalScale(22)}
									height={verticalScale(22)}
									fill="#CCC"
								/>
							)}
						</Pressable>
					</View>
				</View>
			</Pressable>
		</MotiView>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: "transparent",
		overflow: "hidden",
	},
	avatar: {
		backgroundColor: "#FFFFFF",
		borderWidth: 0.5,
		borderColor: "#CCCCCC",
		alignItems: "center",
		justifyContent: "center",
	},
	statusTag: {
		backgroundColor: "#F0F0F0",
	},
});
