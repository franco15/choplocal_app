import { Stack } from "expo-router";
import { Platform } from "react-native";

const RestaurantsLayout = () => {
	return (
		<Stack>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
				name="[id]"
			/>
			<Stack.Screen options={{ headerShown: false }} name="news" />
			<Stack.Screen
				options={{
					headerShown: Platform.OS === "ios" ? false : true,
					headerTitle: "",
					headerShadowVisible: false,
				}}
				name="transactions"
			/>
		</Stack>
	);
};

export default RestaurantsLayout;
