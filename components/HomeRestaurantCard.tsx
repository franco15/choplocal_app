import {
	CustomText as Text,
	CustomTextBold as TextBold,
} from "@/components/Texts";
import { Bookmark, BookmarkSolid } from "@/constants/svgs";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { IRestaurant } from "@/lib/types/restaurant";
import { router } from "expo-router";
import { useCallback } from "react";
import {
	Image,
	Pressable,
	Share,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";

type Props = {
	restaurant: IRestaurant;
	isFavorited?: boolean;
	onToggleFavorite?: (id: string) => void;
	variant?: "default" | "popular";
};

export default function HomeRestaurantCard({
	restaurant,
	isFavorited = false,
	onToggleFavorite,
	variant = "default",
}: Props) {
	const cardWidth = 270;

	const getInitials = (name: string) =>
		name
			.split(" ")
			.slice(0, 2)
			.map((w) => w[0])
			.join("")
			.toUpperCase();

	const restaurantImage = restaurant.image || restaurant.logo;

	const onFavorite = useCallback(() => {
		onToggleFavorite?.(restaurant.id);
	}, [restaurant.id, onToggleFavorite]);

	const onRecommend = useCallback(async () => {
		const code = restaurant.referralCode;
		if (!code) return;
		try {
			await Share.share({
				message: `Check out ${restaurant.name} on Chop Local! Use my recommendation code: ${code}`,
			});
		} catch {
			// User cancelled share
		}
	}, [restaurant]);

	const onVisit = useCallback(() => {
		router.push({
			pathname: "/restaurants/[id]",
			params: { id: restaurant.id, name: restaurant.name },
		});
	}, [restaurant.id, restaurant.name]);

	return (
		<View style={{ width: cardWidth }}>
			<Pressable
				onPress={onVisit}
				style={({ pressed }) => [
					styles.card,
					{ transform: [{ scale: pressed ? 0.97 : 1 }] },
				]}
			>
				{/* Image area */}
				<View style={styles.imageArea}>
					{restaurantImage ? (
						<Image
							source={{ uri: restaurantImage }}
							style={styles.image}
							resizeMode="cover"
						/>
					) : (
						<TextBold style={styles.initials}>
							{getInitials(restaurant.name)}
						</TextBold>
					)}

					{/* Bookmark — top-right, white circle */}
					<TouchableOpacity
						onPress={onFavorite}
						activeOpacity={0.7}
						hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
						style={styles.bookmarkCircle}
					>
						{isFavorited ? (
							<BookmarkSolid width={22} height={22} fill="#1A1A1A" />
						) : (
							<Bookmark width={22} height={22} fill="#999" />
						)}
					</TouchableOpacity>
				</View>

				{/* Info section */}
				<View style={styles.infoSection}>
					<TextBold numberOfLines={1} style={styles.name}>
						{restaurant.name}
					</TextBold>
					<Text numberOfLines={1} style={styles.details}>
						{variant === "popular"
							? `Total of Chop Local visits: ${restaurant.totalCheckins}`
							: `${restaurant.checkIns} visitas · $${restaurant.balance.toFixed(2)}`}
					</Text>
				</View>

				{/* Action row */}
				{(restaurant.checkIns ?? 0) >= 1 && !!restaurant.referralCode && (
					<View style={styles.actionRow}>
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={onRecommend}
							style={styles.actionBtnOutline}
						>
							<TextBold style={styles.actionTextOutline}>Recommend</TextBold>
						</TouchableOpacity>
					</View>
				)}
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
	image: {
		width: "100%",
		height: "100%",
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
		borderWidth: 0.5,
		borderColor: "#CCCCCC",
		backgroundColor: "#FFFFFF",
	},
	actionTextOutline: {
		fontSize: moderateScale(13),
		color: "#1A1A1A",
	},
});
