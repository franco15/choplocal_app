import { HeaderBackButton } from "@/components";
import { Stack, useRouter } from "expo-router";

export default function RedeemCodeLayout() {
	const router = useRouter();

	return (
		<Stack
			screenOptions={{
				headerTitle: "",
				headerShadowVisible: false,
				headerStyle: { backgroundColor: "#b5c6f2" },
				headerTintColor: "#1A1A1A",
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					headerLeft: () => <HeaderBackButton />,
				}}
			/>
			<Stack.Screen name="success" options={{ headerShown: false }} />
		</Stack>
	);
}
