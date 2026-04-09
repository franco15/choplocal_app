import { HeaderBackButton } from "@/components";
import { Stack } from "expo-router";

export default function SettingsLayout() {
	return (
		<Stack>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTitle: "",
					headerShadowVisible: false,
					headerStyle: {
						backgroundColor: "#FFFFFF",
					},
					headerLeft: () => <HeaderBackButton />,
				}}
				name="index"
			/>
			<Stack.Screen
				name="edit-profile"
				options={{
					headerShown: true,
					headerShadowVisible: false,
					headerTitle: "",
					headerStyle: {
						backgroundColor: "#FFFFFF",
					},
					headerLeft: () => <HeaderBackButton />,
				}}
			/>
			<Stack.Screen
				name="change-phone"
				options={{
					headerShown: true,
					headerShadowVisible: false,
					headerTitle: "",
					headerStyle: {
						backgroundColor: "#FFFFFF",
					},
					headerLeft: () => <HeaderBackButton />,
				}}
			/>
		</Stack>
	);
}
