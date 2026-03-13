import { Container, Text, TextBold } from "@/components";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { ScrollView, View } from "react-native";

export default function NewsScreen() {
	return (
		<Container useGradient={false}>
			<ScrollView
				className="flex-1"
				style={{
					paddingHorizontal: horizontalScale(12),
					marginTop: verticalScale(50),
				}}
			>
				<View className="flex items-center">
					<TextBold className="" style={{ fontSize: moderateScale(35) }}>
						What is happening
					</TextBold>
				</View>

				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center",
						marginTop: verticalScale(60),
					}}
				>
					<Text
						style={{
							fontSize: moderateScale(15),
							color: "#888",
							textAlign: "center",
						}}
					>
						No news yet. Check back later!
					</Text>
				</View>
			</ScrollView>
		</Container>
	);
}
