import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, View } from "react-native";
import { CustomText as Text, CustomTextBold as TextBold } from "./Texts";

export type CardTheme = {
	id: string;
	label: string;
	bg: string;
	gradientColors: [string, string, string];
};

export const CARD_THEMES: CardTheme[] = [
	{
		id: "blue-sky",
		label: "Blue Sky",
		bg: "#4164FF",
		gradientColors: ["#4164FF", "#5A93FF", "#7CC3FF"],
	},
	{
		id: "coral-flame",
		label: "Coral Flame",
		bg: "#FE6237",
		gradientColors: ["#FFB6BE", "#FE6237", "#FE6237"],
	},
	{
		id: "ruby-cream",
		label: "Ruby Cream",
		bg: "#BC2D29",
		gradientColors: ["#BC2D29", "#D4705A", "#F5E9CE"],
	},
	{
		id: "royal-night",
		label: "Royal Night",
		bg: "#516AC8",
		gradientColors: ["#26428B", "#516AC8", "#FAEBD7"],
	},
];

type Props = {
	restaurantName: string;
	amount: number | string;
	size?: "normal" | "large";
	theme?: CardTheme;
};

export default function GiftCardVisual({
	restaurantName,
	amount,
	size = "normal",
	theme = CARD_THEMES[0],
}: Props) {
	const isLarge = size === "large";
	const cardHeight = isLarge ? verticalScale(230) : verticalScale(215);
	const amountSize = isLarge ? moderateScale(36) : moderateScale(30);
	const titleSize = isLarge ? moderateScale(38) : moderateScale(32);
	const nameSize = isLarge ? moderateScale(13) : moderateScale(11);

	return (
		<LinearGradient
			colors={theme.gradientColors ?? [theme.bg, theme.bg, theme.bg]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={[styles.card, { height: cardHeight }]}
		>
			<Image
				source={require("@/assets/images/noise.png")}
				resizeMode="repeat"
				style={styles.noiseOverlay}
			/>
			<View style={styles.cardContent}>
				{/* Top row: restaurant name (left) + amount (right) */}
				<View style={styles.topRow}>
					<TextBold
						style={[
							styles.restaurantName,
							{ fontSize: nameSize },
						]}
						numberOfLines={1}
					>
						{restaurantName}
					</TextBold>
					<TextBold
						style={[styles.amount, { fontSize: amountSize }]}
					>
						${amount}
					</TextBold>
				</View>

				{/* Bottom left: Gift Card in two lines */}
				<View style={styles.bottomLeft}>
					<TextBold
						style={[styles.giftText, { fontSize: titleSize }]}
					>
						Gift
					</TextBold>
					<TextBold
						style={[
							styles.giftText,
							{
								fontSize: titleSize,
								marginTop: verticalScale(-6),
							},
						]}
					>
						Card
					</TextBold>
				</View>
			</View>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	card: {
		borderRadius: moderateScale(18),
		overflow: "hidden",
		width: "100%",
	},
	noiseOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		width: 1000,
		height: 1000,
		opacity: 0.12,
	},
	cardContent: {
		flex: 1,
		padding: moderateScale(20),
		justifyContent: "space-between",
	},
	topRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	restaurantName: {
		color: "rgba(255,255,255,0.7)",
		letterSpacing: 0.5,
		textTransform: "uppercase",
		flex: 1,
		marginRight: horizontalScale(8),
	},
	amount: {
		color: "#FFFFFF",
	},
	bottomLeft: {
		marginTop: "auto",
	},
	giftText: {
		color: "#FFFFFF",
		lineHeight: undefined,
	},
});
