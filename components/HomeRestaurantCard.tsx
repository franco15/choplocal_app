import { CustomText as Text, CustomTextBold as TextBold } from "@/components/Texts";
import { Bookmark, BookmarkSolid } from "@/constants/svgs";
import { moderateScale, verticalScale } from "@/lib/metrics";
import { IRestaurant } from "@/lib/types/restaurant";
import { router } from "expo-router";
import { useCallback } from "react";
import {
	Pressable,
	Share,
	StyleSheet,
	TouchableOpacity,
	useWindowDimensions,
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
	const { width: screenWidth } = useWindowDimensions();
	const cardWidth = 270;

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

				{/* Action row: Recommend | Visit */}
				<View style={styles.actionRow}>
					<Pressable
						onPress={onRecommend}
						style={({ pressed }) => [
							styles.actionBtn,
							{ opacity: pressed ? 0.5 : 1 },
						]}
					>
						<Text style={styles.actionText}>Recommend</Text>
					</Pressable>

					<View style={styles.actionDivider} />

					<Pressable
						onPress={onVisit}
						style={({ pressed }) => [
							styles.actionBtn,
							{ opacity: pressed ? 0.5 : 1 },
						]}
					>
						<TextBold style={styles.actionText}>Visit</TextBold>
					</Pressable>
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
		borderTopWidth: 1,
		borderTopColor: "#F0F0F0",
		paddingVertical: 12,
	},
	actionBtn: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	actionText: {
		fontSize: moderateScale(13),
		color: "#1A1A1A",
	},
	actionDivider: {
		width: 1,
		height: "60%",
		backgroundColor: "#E8E8E8",
	},
});
