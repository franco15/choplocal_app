import { CustomText as Text, CustomTextBold as TextBold } from "@/components/Texts";
import GeneratingCodeModal from "@/components/GeneratingCodeModal";
import { Bookmark, BookmarkSolid } from "@/constants/svgs";
import { useRedeemCodeContext } from "@/contexts/RedeemCodeContext";
import { MOCK_REDEEM_CODES } from "@/lib/mock/redeemCodes";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { ERestaurantStatus, IRestaurant } from "@/lib/types/restaurant";
import { router } from "expo-router";
import { MotiView } from "moti";
import { useCallback, useState } from "react";
import { Alert, Pressable, Share, StyleSheet, TouchableOpacity, View } from "react-native";

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
	const { getOrCreateRecommendationCode, hasRecommendationCode } =
		useRedeemCodeContext();
	const [isGeneratingCode, setIsGeneratingCode] = useState(false);

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
		if ((restaurant.checkIns ?? 0) < 1) {
			Alert.alert(
				"You haven't visited yet!",
				"Visit this restaurant at least once before recommending it to your friends.",
				[{ text: "Got it" }],
			);
			return;
		}
		const rewardValue =
			MOCK_REDEEM_CODES.find((c) => c.restaurantId === restaurant.id && c.type === "recommendation")?.rewardValue ?? 0;
		const alreadyGenerated = hasRecommendationCode(restaurant.id);
		if (!alreadyGenerated) setIsGeneratingCode(true);
		try {
			const code = await getOrCreateRecommendationCode(restaurant.id);
			const rewardText = rewardValue > 0 ? `\nYour friend will get a $${rewardValue} reward!` : "";
			setIsGeneratingCode(false);
			await new Promise((r) => setTimeout(r, 400));
			await Share.share({
				message: `Check out ${restaurant.name} on Chop Local! Use my recommendation code: ${code}${rewardText}`,
			});
		} catch {
			setIsGeneratingCode(false);
		}
	}, [restaurant, hasRecommendationCode, getOrCreateRecommendationCode]);

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
			<GeneratingCodeModal visible={isGeneratingCode} />
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

				{/* Bottom action row */}
				<View style={styles.actionRow}>
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={onRecommend}
						style={styles.actionBtnOutline}
					>
						<TextBold style={styles.actionTextOutline}>
							Recommend
						</TextBold>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={0.7}
						onPress={onVisit}
						style={styles.actionBtnFilled}
					>
						<TextBold style={styles.actionTextFilled}>
							Visit
						</TextBold>
					</TouchableOpacity>
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
		paddingHorizontal: horizontalScale(14),
		paddingBottom: moderateScale(14),
		gap: horizontalScale(10),
	},
	actionBtnOutline: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: verticalScale(10),
		borderRadius: moderateScale(12),
		borderWidth: 1.5,
		borderColor: "#1A1A1A",
		backgroundColor: "#FFFFFF",
	},
	actionBtnFilled: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: verticalScale(10),
		borderRadius: moderateScale(12),
		backgroundColor: "#1A1A1A",
	},
	actionTextOutline: {
		fontSize: moderateScale(13),
		color: "#1A1A1A",
	},
	actionTextFilled: {
		fontSize: moderateScale(13),
		color: "#FFFFFF",
	},
});
