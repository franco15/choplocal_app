import { HeaderBackButton } from "@/components";
import { Stack } from "expo-router";

export default function SuggestionsLayout() {
	return (
		<Stack>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTitle: "",
					headerShadowVisible: false,
					headerLeft: () => <HeaderBackButton />,
				}}
				name="index"
			/>
		</Stack>
	);
}
