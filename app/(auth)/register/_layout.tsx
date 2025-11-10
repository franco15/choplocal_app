import { Stack } from "expo-router";
import { Platform } from "react-native";

const RegisterLayout = () => {
	return (
		<Stack>
			<Stack.Screen
				options={{ headerShown: Platform.OS === "ios" ? false : true, headerTitle: "", headerShadowVisible: false }}
				name="index"
			/>
			<Stack.Screen
				options={{ headerShown: Platform.OS === "ios" ? false : true, headerTitle: "", headerShadowVisible: false }}
				name="verify"
			/>
		</Stack>
	);
};

export default RegisterLayout;
