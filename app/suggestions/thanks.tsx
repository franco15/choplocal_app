import { Text, TextBold } from "@/components";
import { Chef } from "@/constants/svgs";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import { useRouter } from "expo-router";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const { width, height } = Dimensions.get("screen");

export default function ThanksScreen() {
	const insets = useSafeAreaInsets();
	const router = useRouter();
	return (
		<View className="flex-1">
			<Canvas
				style={[
					StyleSheet.absoluteFill,
					{ position: "absolute", zIndex: -1, width, height },
				]}
			>
				<Rect x={0} y={0} width={width} height={height}>
					<LinearGradient
						start={vec(0, 0)}
						end={vec(0, height)}
						colors={["#EFEECD", "#EFEECD"]}
					/>
				</Rect>
			</Canvas>
			<View
				className="flex-1 bg-[#EFEECD] mt-20 px-3"
				style={{ paddingTop: insets.top }}
			>
				<View className="flex ml-14 items-center">
					<Chef width={232} height={384} />
				</View>
				<TextBold className="text-[35px] mt-14 text-center">
					Thank you!
				</TextBold>
				<Text className="text-[13px] text-center mt-3">
					{"Thanks for supporting chop local\nwe will make it happen"}
				</Text>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => router.replace("/")}
					className="mt-32 flex self-center w-[171px]"
				>
					<View className="flex bg-black h-[54px] rounded-[30px] self-center items-center justify-center w-full">
						<Text className="text-[14px] text-white">Okay</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
}
