import { Stack } from "expo-router";

const RegisterLayout = () => {
	return (
		<Stack>
			<Stack.Screen
				options={{ headerTitle: "", headerShadowVisible: false }}
				name="index"
			/>
			<Stack.Screen
				options={{ headerTitle: "", headerShadowVisible: false }}
				name="verify"
			/>
			<Stack.Screen
				options={{ headerTitle: "", headerShadowVisible: false }}
				name="user-info"
			/>
		</Stack>
	);
};

export default RegisterLayout;
