import { HeaderBackButton, HeaderCloseButton } from "@/components";
import { Stack } from "expo-router";

export default function GiftCardsLayout() {
	return (
		<Stack
			screenOptions={{
				headerTitle: "",
				headerBackTitle: "Back",
				headerShadowVisible: false,
				headerStyle: { backgroundColor: "#FFFFFF" },
				headerTintColor: "#1A1A1A",
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					headerLeft: () => <HeaderBackButton />,
				}}
			/>
			<Stack.Screen
				name="select-restaurant"
				options={{
					headerLeft: () => <HeaderBackButton />,
				}}
			/>
			<Stack.Screen
				name="choose-amount"
				options={{
					headerLeft: () => <HeaderBackButton />,
					headerRight: () => <HeaderCloseButton />,
				}}
			/>
			<Stack.Screen
				name="recipient"
				options={{
					headerLeft: () => <HeaderBackButton />,
					headerRight: () => <HeaderCloseButton />,
				}}
			/>
			<Stack.Screen
				name="payment"
				options={{
					headerLeft: () => <HeaderBackButton />,
					headerRight: () => <HeaderCloseButton />,
				}}
			/>
			<Stack.Screen
				name="confirm"
				options={{
					headerLeft: () => <HeaderBackButton />,
					headerRight: () => <HeaderCloseButton />,
				}}
			/>
			<Stack.Screen name="success" options={{ headerShown: false }} />
			<Stack.Screen name="received" />
			<Stack.Screen name="accepted" />
			<Stack.Screen
				name="card-detail"
				options={{
					headerLeft: () => <HeaderBackButton />,
				}}
			/>
			<Stack.Screen
				name="notification-detail"
				options={{
					headerLeft: () => <HeaderBackButton />,
				}}
			/>
		</Stack>
	);
}
