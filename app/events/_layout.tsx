import { Stack } from "expo-router";

const EventsLayout = () => {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="[id]" />
			<Stack.Screen name="category" />
			<Stack.Screen name="all-categories" />
			<Stack.Screen name="restaurant-drops" />
		</Stack>
	);
};

export default EventsLayout;
