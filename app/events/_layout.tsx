import { Stack } from "expo-router";

const EventsLayout = () => {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="[id]" />
			<Stack.Screen name="category" />
			<Stack.Screen name="all-categories" />
			<Stack.Screen name="restaurant-drops" />
			<Stack.Screen name="ticket" />
			<Stack.Screen
				name="payment"
				options={{
					headerShown: true,
					headerTitle: "",
					headerShadowVisible: false,
					headerStyle: { backgroundColor: "#FFFFFF" },
					headerTintColor: "#1A1A1A",
				}}
			/>
			<Stack.Screen name="rsvp-success" />
		</Stack>
	);
};

export default EventsLayout;
