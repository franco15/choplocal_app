import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Platform, TouchableOpacity } from "react-native";

function CloseButton() {
	const router = useRouter();
	return (
		<TouchableOpacity
			onPress={() => router.replace("/(tabs)")}
			activeOpacity={0.7}
			hitSlop={10}
			style={{ marginRight: Platform.OS === "android" ? 10 : 0 }}
		>
			<Ionicons name="close" size={24} color="#1A1A1A" />
		</TouchableOpacity>
	);
}

export default function GiftCardsLayout() {
	return (
		<Stack
			screenOptions={{
				headerTitle: "",
				headerBackTitle: " ",
				headerBackTitleVisible: false,
				headerShadowVisible: false,
				headerStyle: { backgroundColor: "#FEFCFB" },
				headerRight: () => <CloseButton />,
				headerTintColor: "#1A1A1A",
			}}
		>
			<Stack.Screen name="index" />
			<Stack.Screen name="select-restaurant" />
			<Stack.Screen name="choose-amount" />
			<Stack.Screen name="recipient" />
			<Stack.Screen name="payment" />
			<Stack.Screen name="confirm" />
			<Stack.Screen
				name="success"
				options={{ headerShown: false }}
			/>
			<Stack.Screen name="received" />
			<Stack.Screen name="accepted" />
		</Stack>
	);
}
