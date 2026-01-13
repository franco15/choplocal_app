import { Stack } from "expo-router";
import { Platform } from "react-native";

const AuthLayout = () => {
	return (
		<Stack>
			<Stack.Screen options={{ headerShown: false }} name="index" />
			<Stack.Screen options={{ headerShown: false }} name="login" />
			<Stack.Screen
				options={{
					headerShown: Platform.OS === "ios" ? true : false,
					headerShadowVisible: false,
					headerTitle: "",
					headerBackTitle: "Back",
				}}
				name="register"
			/>
		</Stack>
	);
};

export default AuthLayout;
