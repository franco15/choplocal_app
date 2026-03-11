import { CustomText as Text, CustomTextBold as TextBold } from "@/components/Texts";
import { Gift } from "@/constants/svgs";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function GiftCardBanner() {
	return (
		<TouchableOpacity
			activeOpacity={0.85}
			onPress={() => router.push("/gift-cards/select-restaurant")}
			style={styles.banner}
		>
			<View style={styles.iconCircle}>
				<Gift
					width={horizontalScale(24)}
					height={verticalScale(24)}
				/>
			</View>
			<View style={{ flex: 1, marginLeft: horizontalScale(14) }}>
				<TextBold
					style={{
						fontSize: moderateScale(16),
						color: "#1A1A1A",
					}}
				>
					Send a Gift Card
				</TextBold>
				<Text
					style={{
						fontSize: moderateScale(13),
						color: "#888",
						marginTop: verticalScale(2),
					}}
				>
					Treat a friend to a local restaurant
				</Text>
			</View>
			<Text
				style={{
					fontSize: moderateScale(22),
					color: "#CCC",
				}}
			>
				›
			</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	banner: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#EDEDED",
		borderRadius: moderateScale(16),
		padding: moderateScale(16),
		marginVertical: verticalScale(8),
		marginHorizontal: horizontalScale(4),
	},
	iconCircle: {
		width: moderateScale(48),
		height: moderateScale(48),
		borderRadius: moderateScale(24),
		backgroundColor: "#FBF6F5",
		alignItems: "center",
		justifyContent: "center",
	},
});
