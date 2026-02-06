import { Container, Text, TextBold } from "@/components";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { useRouter } from "expo-router";
import { Dimensions, TouchableOpacity, View } from "react-native";
const { width, height } = Dimensions.get("screen");

export default function ThanksScreen() {
	const router = useRouter();
	return (
		<Container style={{ backgroundColor: "#EFEECD" }}>
			<View
				className="justify-center"
				style={{
					flex: 1,
					marginTop: verticalScale(80),
					paddingHorizontal: horizontalScale(12),
				}}
			>
				<TextBold
					className="text-center"
					style={{ fontSize: moderateScale(35), marginTop: verticalScale(15) }}
				>
					Thank you!
				</TextBold>
				<Text
					className="text-center"
					style={{ fontSize: moderateScale(15), marginTop: verticalScale(15) }}
				>
					{"Thanks for supporting chop local\nwe will make it happen"}
				</Text>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => router.replace("/(tabs)")}
					className="flex self-center"
					style={{ marginTop: verticalScale(60), width: horizontalScale(170) }}
				>
					<View
						className="flex bg-black h-[54px] rounded-[30px] self-center items-center justify-center w-full"
						style={{
							height: verticalScale(54),
							borderRadius: moderateScale(30),
						}}
					>
						<Text
							className="text-white"
							style={{ fontSize: moderateScale(14) }}
						>
							Okay
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		</Container>
	);
}
