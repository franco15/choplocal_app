import { Container, Text, TextBold } from "@/components";
import { Gift } from "@/constants/svgs";
import {
	horizontalScale,
	moderateScale,
	verticalScale,
} from "@/lib/metrics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function GiftCardAccepted() {
	const router = useRouter();
	const { restaurantId, restaurantName } = useLocalSearchParams<{
		restaurantId: string;
		restaurantName: string;
	}>();

	return (
		<Container style={{ backgroundColor: "#F0FFF4" }}>
			<View style={styles.content}>
				<MotiView
					from={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ type: "timing", duration: 400 }}
					style={{ alignItems: "center" }}
				>
					<View style={styles.iconCircle}>
						<Gift
							width={horizontalScale(36)}
							height={verticalScale(36)}
						/>
					</View>
					<TextBold
						style={{
							fontSize: moderateScale(30),
							color: "#1A1A1A",
							marginTop: verticalScale(20),
							textAlign: "center",
						}}
					>
						Gift Card Accepted!
					</TextBold>
					<Text
						style={{
							fontSize: moderateScale(15),
							color: "#888",
							marginTop: verticalScale(12),
							textAlign: "center",
							lineHeight: moderateScale(22),
						}}
					>
						You can use it at{"\n"}
						{restaurantName}
					</Text>
				</MotiView>

				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() =>
						router.push({
							pathname: "/restaurants/[id]",
							params: { id: restaurantId },
						})
					}
					style={styles.buttonWrapper}
				>
					<View style={styles.primaryButton}>
						<Text
							style={{
								fontSize: moderateScale(15),
								color: "#FFFFFF",
							}}
						>
							View Restaurant
						</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => router.replace("/(tabs)")}
					style={{
						alignSelf: "center",
						marginTop: verticalScale(16),
					}}
				>
					<Text
						style={{
							fontSize: moderateScale(14),
							color: "#888",
							textDecorationLine: "underline",
						}}
					>
						Done
					</Text>
				</TouchableOpacity>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: horizontalScale(24),
	},
	iconCircle: {
		width: moderateScale(80),
		height: moderateScale(80),
		borderRadius: moderateScale(40),
		backgroundColor: "#D4EDDA",
		alignItems: "center",
		justifyContent: "center",
	},
	buttonWrapper: {
		alignSelf: "center",
		marginTop: verticalScale(40),
		width: "100%",
	},
	primaryButton: {
		backgroundColor: "#000000",
		height: verticalScale(54),
		borderRadius: moderateScale(30),
		alignItems: "center",
		justifyContent: "center",
	},
});
