import { Stack } from "expo-router";

export default function QrLayout() {
	return (
		<Stack screenOptions={{ headerTransparent: true }}>
			<Stack.Screen
				options={{
					headerTitle: "Back",
					headerShadowVisible: false,
				}}
				name="index"
			/>
		</Stack>
	);
}
