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
		</Stack>
	);
};

export default RegisterLayout;
