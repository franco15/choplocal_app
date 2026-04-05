import { HeaderBackButton } from "@/components";
import { Ionicons } from "@expo/vector-icons";
// import { HeaderBackButton } from "@react-navigation/elements";
import { Stack, useRouter } from "expo-router";
import { Platform, TouchableOpacity } from "react-native";

const RestaurantsLayout = () => {
	const router = useRouter();

	return (
		<Stack>
			<Stack.Screen
				name="[id]"
				options={{
					// headerShown: Platform.OS === "ios",
					headerShadowVisible: false,
					headerTitle: "",
					headerStyle: { backgroundColor: "#FFFFFF" },
					headerTintColor: "#1A1A1A",
					headerLeft: () => <HeaderBackButton />,
					headerRightContainerStyle: {
						backgroundColor: "transparent",
						flexDirection: "row",
						alignItems: "center",
					},
					headerRight: () => (
						<>
							<TouchableOpacity
								activeOpacity={0.7}
								onPress={() => router.push("/qr")}
								style={{
									width: 44,
									height: 44,
									borderRadius: 22,
									backgroundColor: "#F5F5F5",
									alignItems: "center",
									justifyContent: "center",
									marginRight: 8,
								}}
							>
								<Ionicons name="qr-code-outline" size={20} color="#1A1A1A" />
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.7}
								onPress={() => router.push("/redeem-code")}
								style={{
									width: 44,
									height: 44,
									borderRadius: 22,
									backgroundColor: "#F0FAFA",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Ionicons name="ticket-outline" size={22} color="#438989" />
							</TouchableOpacity>
						</>
					),
				}}
			/>
			<Stack.Screen options={{ headerShown: false }} name="news" />
			<Stack.Screen
				name="transactions"
				options={{
					headerShown: Platform.OS === "ios",
					headerShadowVisible: false,
					headerTitle: "",
					headerBackTitle: "Back",
					headerTintColor: "#1A1A1A",
					headerStyle: { backgroundColor: "#FFFFFF" },
				}}
			/>
			<Stack.Screen
				name="restaurant-list"
				options={{
					headerShadowVisible: false,
					headerTitle: "",
					headerBackTitle: "Home",
					headerStyle: {
						backgroundColor: "#FFFFFF",
					},
					headerLeft: () => <HeaderBackButton />,
				}}
			/>
		</Stack>
	);
};

export default RestaurantsLayout;
