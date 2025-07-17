import { Stack } from "expo-router";

const LoginLayout = () => {
	return (
		<Stack>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
				name="index"
			/>
			<Stack.Screen
				options={{ headerTitle: "", headerShadowVisible: false }}
				name="verify"
			/>
		</Stack>
	);
};

export default LoginLayout;
