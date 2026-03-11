import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Platform, TouchableOpacity } from "react-native";

function BackButton() {
	const router = useRouter();
	return (
		<TouchableOpacity
			onPress={() => router.back()}
			activeOpacity={0.7}
			hitSlop={10}
			style={{ marginLeft: Platform.OS === "android" ? 10 : 0 }}
		>
			<Ionicons name="chevron-back" size={28} color="#1A1A1A" />
		</TouchableOpacity>
	);
}

function CloseButton() {
	const router = useRouter();
	return (
		<TouchableOpacity
			onPress={() => {
				router.dismissAll();
				router.replace("/(tabs)");
			}}
			activeOpacity={0.7}
			hitSlop={10}
			style={{ marginRight: Platform.OS === "android" ? 10 : 0 }}
		>
			<Ionicons name="close" size={26} color="#1A1A1A" />
		</TouchableOpacity>
	);
}

export default function GiftCardsLayout() {
	return (
		<Stack
			screenOptions={{
				headerTitle: "",
				headerBackTitle: "Back",
				headerShadowVisible: false,
				headerStyle: { backgroundColor: "#FEFCFB" },
				headerTintColor: "#1A1A1A",
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					headerLeft: () => <BackButton />,
				}}
			/>
			<Stack.Screen
				name="select-restaurant"
				options={{
					headerLeft: () => <BackButton />,
				}}
			/>
			<Stack.Screen
				name="choose-amount"
				options={{
					headerLeft: () => <BackButton />,
					headerRight: () => <CloseButton />,
				}}
			/>
			<Stack.Screen
				name="recipient"
				options={{
					headerLeft: () => <BackButton />,
					headerRight: () => <CloseButton />,
				}}
			/>
			<Stack.Screen
				name="payment"
				options={{
					headerLeft: () => <BackButton />,
					headerRight: () => <CloseButton />,
				}}
			/>
			<Stack.Screen
				name="confirm"
				options={{
					headerLeft: () => <BackButton />,
					headerRight: () => <CloseButton />,
				}}
			/>
			<Stack.Screen
				name="success"
				options={{ headerShown: false }}
			/>
			<Stack.Screen name="received" />
			<Stack.Screen name="accepted" />
		</Stack>
	);
}
