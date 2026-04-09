import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Platform, TouchableOpacity } from "react-native";

const HeaderBackButton = () => {
	const router = useRouter();
	return (
		<TouchableOpacity
			onPress={() => router.back()}
			activeOpacity={0.7}
			hitSlop={10}
			style={{ marginLeft: Platform.OS === "android" ? 10 : 0 }}
		>
			<Ionicons name="chevron-back" size={28} color="#1A1A1A" />
		</TouchableOpacity>
	);
};

export default HeaderBackButton;
