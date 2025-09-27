import { Stack } from "expo-router";

export default function SuggestionsLayout() {
	return (
		<Stack screenOptions={{ headerTransparent: true }}>
			<Stack.Screen
				options={{
					headerTitle: "Back",
					headerShadowVisible: false,
				}}
				name="index"
			/>
			<Stack.Screen
				options={{
					headerShown: false,
					headerTitle: "",
					headerShadowVisible: false,
				}}
				name="thanks"
			/>
		</Stack>
	);
}
