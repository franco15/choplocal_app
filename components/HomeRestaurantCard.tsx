import { CustomText as Text, CustomTextBold as TextBold } from "@/components/Texts";
import GeneratingCodeModal from "@/components/GeneratingCodeModal";
import { Bookmark, BookmarkSolid } from "@/constants/svgs";
import { useRedeemCodeContext } from "@/contexts/RedeemCodeContext";
import { MOCK_REDEEM_CODES } from "@/lib/mock/redeemCodes";
import { moderateScale, verticalScale, horizontalScale } from "@/lib/metrics";
import { IRestaurant } from "@/lib/types/restaurant";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
	Alert,
	Pressable,
	Share,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";

type Props = {
	restaurant: IRestaurant;
	isFavorited?: boolean;
	onToggleFavorite?: (id: number) => void;
};

export default function HomeRestaurantCard({
	restaurant,
	isFavorited = false,
	onToggleFavorite,
}: Props) {
	const cardWidth = 270;
	const { getOrCreateRecommendationCode, hasRecommendationCode } =
		useRedeemCodeContext();
	const [isGeneratingCode, setIsGeneratingCode] = useState(false);

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
		<View style={{ width: cardWidth }}>
			<GeneratingCodeModal visible={isGeneratingCode} />
			<Pressable
				onPress={onVisit}
				style={({ pressed }) => [
					styles.card,
					{ transform: [{ scale: pressed ? 0.97 : 1 }] },
				]}
			>
				{/* Image area */}
				<View style={styles.imageArea}>
					<TextBold style={styles.initials}>
						{getInitials(restaurant.name)}
					</TextBold>

					{/* Bookmark — top-right, white circle */}
					<TouchableOpacity
						onPress={onFavorite}
						activeOpacity={0.7}
						hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
						style={styles.bookmarkCircle}
					>
						{isFavorited ? (
							<BookmarkSolid
								width={22}
								height={22}
								fill="#1A1A1A"
							/>
						) : (
							<Bookmark
								width={22}
								height={22}
								fill="#999"
							/>
						)}
					</TouchableOpacity>
				</View>

				{/* Info section */}
				<View style={styles.infoSection}>
					<TextBold numberOfLines={1} style={styles.name}>
						{restaurant.name}
					</TextBold>
					<Text numberOfLines={1} style={styles.details}>
						{restaurant.checkIns} visitas · ${restaurant.balance.toFixed(2)}
					</Text>
				</View>

				{/* Action row */}
				<View style={styles.actionRow}>
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={onRecommend}
						style={styles.actionBtnOutline}
					>
						<TextBold style={styles.actionTextOutline}>Recommend</TextBold>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={0.7}
						onPress={onVisit}
						style={styles.actionBtnFilled}
					>
						<TextBold style={styles.actionTextFilled}>Visit</TextBold>
					</TouchableOpacity>
				</View>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(16),
		borderWidth: 1,
		borderColor: "#EDEDED",
		overflow: "hidden",
	},
	imageArea: {
		height: 220,
		backgroundColor: "#F0F0F0",
		alignItems: "center",
		justifyContent: "center",
	},
	initials: {
		fontSize: moderateScale(40),
		color: "#D0D0D0",
	},
	bookmarkCircle: {
		position: "absolute",
		top: 12,
		right: 12,
		zIndex: 10,
		width: 46,
		height: 46,
		borderRadius: 23,
		backgroundColor: "#FFFFFF",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 4,
		elevation: 4,
	},
	infoSection: {
		paddingHorizontal: 14,
		paddingTop: 12,
		paddingBottom: 10,
	},
	name: {
		fontSize: moderateScale(19),
		color: "#1A1A1A",
		lineHeight: moderateScale(24),
	},
	details: {
		fontSize: moderateScale(15),
		color: "#888",
		marginTop: 4,
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
