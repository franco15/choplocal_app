import { Home } from "@/constants/svgs";
import { Text, View } from "react-native";

export default function Index() {
	return (
		<View className="flex-1 justify-center items-center">
			<Text className="text-5xl">Hello</Text>
			{/* <Link
				href={{
					pathname: "/restaurant/[id]",
					params: { id: "center" },
				}}
			>
				restaurant
			</Link> */}
			<Home width={50} height={50} fill="#000000" />
		</View>
	);
}
