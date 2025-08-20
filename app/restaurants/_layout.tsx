import { Stack } from "expo-router";

const RestaurantsLayout = () => {
	return (
		<Stack screenOptions={{ headerTransparent: true }}>
			<Stack.Screen
				options={{
					headerTitle: "Back to home",
					headerShadowVisible: false,
				}}
				name="index"
			/>
			<Stack.Screen
				options={{
					headerTitle: "Back",
					headerShadowVisible: false,
				}}
				name="[id]"
			/>
		</Stack>
	);
};

export default RestaurantsLayout;
