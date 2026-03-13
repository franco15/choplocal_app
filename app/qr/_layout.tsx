import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function QrLayout() {
	return (
		<Stack>
			<Stack.Screen
				options={{
					headerTitle: "",
					headerShadowVisible: false,
					headerTransparent: true,
					headerStyle: { backgroundColor: "transparent" },
					headerBlurEffect: undefined,
				}}
				name="index"
			/>
		</Stack>
	);
}
