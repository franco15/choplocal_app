import { Stack } from "expo-router";

export default function QrLayout() {
	return (
		<Stack>
			<Stack.Screen
				options={{
					headerShown: false
				}}
				name="index"
			/>
		</Stack>
	);
}
