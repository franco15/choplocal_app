import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { StyleSheet, View } from "react-native";
import { CustomText as Text, CustomTextBold as TextBold } from "./Texts";

export type CardTheme = {
	id: string;
	label: string;
	bg: string;
	blob1: string;
	blob2: string;
	blob3: string;
};

export const CARD_THEMES: CardTheme[] = [
	{
		id: "ruby",
		label: "Ruby",
		bg: "#C62828",
		blob1: "#EF5350",
		blob2: "#7F0000",
		blob3: "#FF8A80",
	},
	{
		id: "burgundy",
		label: "Burgundy",
		bg: "#880E4F",
		blob1: "#C2185B",
		blob2: "#560027",
		blob3: "#F48FB1",
	},
	{
		id: "coral",
		label: "Coral",
		bg: "#D84315",
		blob1: "#FF7043",
		blob2: "#BF360C",
		blob3: "#FFAB91",
	},
	{
		id: "crimson",
		label: "Crimson",
		bg: "#B71C1C",
		blob1: "#E53935",
		blob2: "#7F0000",
		blob3: "#EF9A9A",
	},
	{
		id: "rose",
		label: "Rose",
		bg: "#AD1457",
		blob1: "#EC407A",
		blob2: "#790E3E",
		blob3: "#F48FB1",
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
	const cardHeight = isLarge ? verticalScale(210) : verticalScale(195);
	const amountSize = isLarge ? moderateScale(36) : moderateScale(30);
	const titleSize = isLarge ? moderateScale(38) : moderateScale(32);
	const nameSize = isLarge ? moderateScale(13) : moderateScale(11);

	return (
		<View
			style={[
				styles.card,
				{ height: cardHeight, backgroundColor: theme.bg },
			]}
		>
			{/* Decorative blobs */}
			<View
				style={[
					styles.blob,
					styles.blob1,
					{ backgroundColor: theme.blob1 },
				]}
			/>
			<View
				style={[
					styles.blob,
					styles.blob2,
					{ backgroundColor: theme.blob2 },
				]}
			/>
			<View
				style={[
					styles.blob,
					styles.blob3,
					{ backgroundColor: theme.blob3 },
				]}
			/>
			<View
				style={[
					styles.blob,
					styles.blob4,
					{ backgroundColor: theme.blob1 },
				]}
			/>

			{/* Content overlay */}
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
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		borderRadius: moderateScale(18),
		overflow: "hidden",
		width: "100%",
	},
	blob: {
		position: "absolute",
		borderRadius: 999,
	},
	blob1: {
		width: moderateScale(150),
		height: moderateScale(150),
		top: moderateScale(-40),
		right: moderateScale(-25),
		opacity: 0.25,
	},
	blob2: {
		width: moderateScale(120),
		height: moderateScale(120),
		bottom: moderateScale(-30),
		left: moderateScale(-20),
		opacity: 0.22,
	},
	blob3: {
		width: moderateScale(70),
		height: moderateScale(70),
		top: moderateScale(60),
		right: moderateScale(70),
		opacity: 0.15,
	},
	blob4: {
		width: moderateScale(90),
		height: moderateScale(90),
		bottom: moderateScale(10),
		right: moderateScale(-10),
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
