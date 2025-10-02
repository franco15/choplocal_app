import { Stack } from "expo-router";

const RestaurantsLayout = () => {
	return (
		<Stack screenOptions={{ headerTransparent: true }}>
			<Stack.Screen
				options={{
					headerTitle: "Back",
					headerShadowVisible: false,
				}}
				name="news"
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
