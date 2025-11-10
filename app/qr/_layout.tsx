import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function QrLayout() {
	return (
		<Stack>
			<Stack.Screen
				options={{
					headerShown: Platform.OS === "ios" ? false : true,
					headerTitle: "",
					headerShadowVisible: false,
				}}
				name="index"
			/>
		</Stack>
	);
}
