import { Stack } from "expo-router";

const AuthLayout = () => {
	return (
		<Stack>
			<Stack.Screen options={{ headerShown: false }} name="sign-in" />
			<Stack.Screen
				options={{ headerTitle: "", headerShadowVisible: false }}
				name="sign-up"
			/>
		</Stack>
	);
};

export default AuthLayout;
