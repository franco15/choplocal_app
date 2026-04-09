import { HeaderBackButton } from "@/components";
import { Stack } from "expo-router";

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
					headerLeft: () => <HeaderBackButton />,
				}}
				name="index"
			/>
		</Stack>
	);
}
