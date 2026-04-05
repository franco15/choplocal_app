import { Container, Text } from "@/components";
import ChopLogoVertical from "@/constants/svgs/ChopLogoVertical";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { Link } from "expo-router";
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	TouchableWithoutFeedback,
	View,
} from "react-native";

export default function LoginScreen() {
	return (
		<Container>
			<KeyboardAvoidingView
				behavior={Platform.OS == "ios" ? "padding" : "height"}
			>
				<ScrollView>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View
							className="flex-1 h-full"
							style={{ paddingHorizontal: horizontalScale(20) }}
						>
							<View
								style={{
									alignSelf: "center",
									marginTop: verticalScale(75),
									marginBottom: verticalScale(75),
								}}
							>
								<ChopLogoVertical
									width={horizontalScale(200)}
									height={verticalScale(248)}
								/>
							</View>
							<Link href="/register" asChild>
								<Pressable
									className={`w-2/3 flex self-center items-center justify-center`}
									style={{
										marginTop: verticalScale(60),
										height: verticalScale(54),
										borderRadius: moderateScale(30),
										backgroundColor: "#b42406",
									}}
								>
									<Text
										className="text-center"
										style={{ color: "#FFFFFF", fontSize: moderateScale(14) }}
									>
										Create an account
									</Text>
								</Pressable>
							</Link>
							<Link href="/login" asChild>
								<Pressable
									className={`w-2/3 flex self-center items-center justify-center`}
									style={{
										marginTop: verticalScale(30),
										height: verticalScale(54),
										borderRadius: moderateScale(30),
										backgroundColor: "#b42406",
									}}
								>
									<Text
										className="text-center"
										style={{ color: "#FFFFFF", fontSize: moderateScale(14) }}
									>
										Log in
									</Text>
								</Pressable>
							</Link>
						</View>
					</TouchableWithoutFeedback>
				</ScrollView>
			</KeyboardAvoidingView>
		</Container>
	);
}
