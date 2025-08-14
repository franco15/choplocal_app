import { Stack } from "expo-router";

const RestaurantsLayout = () => {
	return (
		<Stack>
			<Stack.Screen
				options={{
					headerTitle: "Back to home",
					headerShadowVisible: false,
				}}
				name="index"
			/>
			<Stack.Screen
				options={{
					headerTitle: "",
					headerShadowVisible: false,
				}}
				name="[id]"
			/>
		</Stack>
	);
};

export default RestaurantsLayout;
