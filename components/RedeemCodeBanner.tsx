import { CustomText as Text, CustomTextBold as TextBold } from "./Texts";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function RedeemCodeBanner() {
	return (
		<TouchableOpacity
			activeOpacity={0.85}
			onPress={() => router.push("/redeem-code")}
			style={styles.banner}
		>
			<View style={styles.iconCircle}>
				<Ionicons
					name="ticket-outline"
					size={moderateScale(24)}
					color="#b42406"
				/>
			</View>
			<View style={{ flex: 1, marginLeft: horizontalScale(14) }}>
				<TextBold
					style={{
						fontSize: moderateScale(16),
						color: "#1A1A1A",
					}}
				>
					Redeem a Code
				</TextBold>
				<Text
					style={{
						fontSize: moderateScale(13),
						color: "#888",
						marginTop: verticalScale(2),
					}}
				>
					Got a gift card or recommendation code?
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
		marginVertical: verticalScale(4),
		marginHorizontal: horizontalScale(4),
	},
	iconCircle: {
		width: moderateScale(48),
		height: moderateScale(48),
		borderRadius: moderateScale(24),
		backgroundColor: "#FDF0EF",
		alignItems: "center",
		justifyContent: "center",
	},
});
