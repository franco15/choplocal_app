import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function SuggestionsLayout() {
	return (
		<Stack screenOptions={{ headerTransparent: true }}>
			<Stack.Screen
				options={{
					headerShown: Platform.OS === "ios" ? false : true,
					headerTitle: "",
					headerShadowVisible: false,
				}}
				name="index"
			/>
			<Stack.Screen
				options={{
					headerShown: Platform.OS === "ios" ? false : true,
					headerTitle: "",
					headerShadowVisible: false,
				}}
				name="thanks"
			/>
		</Stack>
	);
}
