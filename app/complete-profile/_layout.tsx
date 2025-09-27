import { Stack } from "expo-router";

export default function CompleteProfileLayout() {
	return (
		<Stack screenOptions={{ headerTitle: "", headerShadowVisible: false }}>
			<Stack.Screen options={{ headerShown: false }} name="index" />
		</Stack>
	);
}
