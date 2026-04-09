import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Platform, TouchableOpacity } from "react-native";

const HeaderCloseButton = () => {
	const router = useRouter();
	return (
		<TouchableOpacity
			onPress={() => {
				router.dismissAll();
				router.replace("/(tabs)");
			}}
			activeOpacity={0.7}
			hitSlop={10}
			style={{ marginRight: Platform.OS === "android" ? 10 : 0 }}
		>
			<Ionicons name="close" size={26} color="#1A1A1A" />
		</TouchableOpacity>
	);
};

export default HeaderCloseButton;
