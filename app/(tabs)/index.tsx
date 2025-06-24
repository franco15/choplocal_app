import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
	return (
		<View className="flex-1 justify-center items-center">
			<Text className="text-5xl mb-4">Chop Local</Text>
			<Link href="/restaurantExample">Restaurant Example
			</Link>
			{/* <Link
				href={{
					pathname: "/restaurant/[id]",
					params: { id: "center" },
				}}
			>
				restaurant
			</Link> */}
		</View>
	);
}
