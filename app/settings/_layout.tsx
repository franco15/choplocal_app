import { Stack } from "expo-router";

export default function SettingsLayout() {
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
