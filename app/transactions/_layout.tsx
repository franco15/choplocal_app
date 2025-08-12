import { Stack } from "expo-router";

const TransactionsLayout = () => {
	return (
		<Stack>
			<Stack.Screen
				options={{
					headerTitle: "Back to home",
					headerShadowVisible: false,
				}}
				name="index"
			/>
		</Stack>
	);
};

export default TransactionsLayout;
