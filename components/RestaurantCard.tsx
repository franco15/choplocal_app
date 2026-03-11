import { CustomText as Text, CustomTextBold as TextBold } from "@/components/Texts";
import { Bookmark, BookmarkSolid } from "@/constants/svgs";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { ERestaurantStatus, IRestaurant } from "@/lib/types/restaurant";
import { router } from "expo-router";
import { MotiView } from "moti";
import { useCallback } from "react";
import { Pressable, Share, StyleSheet, View } from "react-native";

const STATUS_LABELS: Record<number, string> = {
	[ERestaurantStatus.Visited]: "Visited",
	[ERestaurantStatus.Recommended]: "Recommended",
	[ERestaurantStatus.NotVisited]: "New",
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
	onToggleFavorite?: (id: number) => void;
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

	const onRecommend = useCallback(async () => {
		await Share.share({
			message: `Check out ${restaurant.name} on Chop Local!`,
		});
	}, [restaurant.name]);

	const onVisit = useCallback(() => {
		router.push({
			pathname: "/restaurants/[id]",
			params: { id: restaurant.id },
		});
	}, [restaurant.id]);

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
						borderRadius: moderateScale(16),
						marginBottom: verticalScale(14),
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
							},
						]}
					>
						<TextBold
							style={{
								color: "#999",
								fontSize: moderateScale(18),
							}}
						>
							{getInitials(restaurant.name)}
						</TextBold>
					</View>

					{/* Center: Info */}
					<View style={{ flex: 1, justifyContent: "center" }}>
						<TextBold
							numberOfLines={2}
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
							}}
						>
							<Text
								style={{
									fontSize: moderateScale(13),
									color: "#888",
								}}
							>
								{restaurant.checkIns} visitas
							</Text>
							<Text
								style={{
									fontSize: moderateScale(13),
									color: "#888",
									marginLeft: horizontalScale(14),
								}}
							>
								${restaurant.balance.toFixed(2)}
							</Text>
						</View>
					</View>

					{/* Right: Tag + Bookmark in a row */}
					<View
						style={{
							alignItems: "flex-end",
							justifyContent: "center",
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								gap: horizontalScale(8),
							}}
						>
							<View
								style={[
									styles.statusTag,
									{
										paddingHorizontal:
											horizontalScale(10),
										paddingVertical: verticalScale(4),
										borderRadius: moderateScale(10),
										backgroundColor: statusColor.bg,
									},
								]}
							>
								<Text
									style={{
										fontSize: moderateScale(11),
										color: statusColor.text,
									}}
								>
									{statusLabel}
								</Text>
							</View>
							<Pressable
								onPress={onFavorite}
								hitSlop={14}
								style={({ pressed }) => ({
									transform: [
										{ scale: pressed ? 0.8 : 1 },
									],
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
				</View>

				{/* Bottom action row: Visit | Recommend */}
				<View
					style={[
						styles.actionRow,
						{
							paddingVertical: moderateScale(16),
							paddingHorizontal: horizontalScale(24),
						},
					]}
				>
					<Pressable
						onPress={onVisit}
						style={({ pressed }) => ({
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
							marginRight: horizontalScale(16),
							opacity: pressed ? 0.5 : 1,
						})}
					>
						<TextBold
							style={{
								fontSize: moderateScale(15),
								color: "#1A1A1A",
							}}
						>
							Visit
						</TextBold>
					</Pressable>

					<View style={styles.actionDivider} />

					<Pressable
						onPress={onRecommend}
						style={({ pressed }) => ({
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
							marginLeft: horizontalScale(16),
							opacity: pressed ? 0.5 : 1,
						})}
					>
						<TextBold
							style={{
								fontSize: moderateScale(15),
								color: "#1A1A1A",
							}}
						>
							Recommend
						</TextBold>
					</Pressable>
				</View>
			</Pressable>
		</MotiView>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#EDEDED",
		overflow: "hidden",
	},
	avatar: {
		backgroundColor: "#E8E8E8",
		alignItems: "center",
		justifyContent: "center",
	},
	statusTag: {
		backgroundColor: "#F0F0F0",
	},
	actionRow: {
		flexDirection: "row",
		alignItems: "center",
		borderTopWidth: 1,
		borderTopColor: "#EDEDED",
	},
	actionHalf: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	actionDivider: {
		width: 1,
		height: "60%",
		backgroundColor: "#E0E0E0",
	},
});
