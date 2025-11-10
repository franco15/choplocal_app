import { Stack } from "expo-router";

const RestaurantsLayout = () => {
	return (
		<Stack>
			<Stack.Screen
				options={{ headerShown: false }}
				name="[id]"
			/>
			<Stack.Screen
				options={{ headerShown: false }}
				name="news"
			/>
			<Stack.Screen
				options={{ headerShown: false }}
				name="transactions"
			/>
		</Stack>
	);
};

export default RestaurantsLayout;
