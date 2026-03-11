import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

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
					headerLeft: () => (
						<TouchableOpacity
							onPress={() => router.back()}
							activeOpacity={0.7}
							style={{ marginLeft: -4 }}
						>
							<Ionicons
								name="chevron-back"
								size={28}
								color="#1A1A1A"
							/>
						</TouchableOpacity>
					),
				}}
			/>
			<Stack.Screen
				name="success"
				options={{ headerShown: false }}
			/>
		</Stack>
	);
}
