import { horizontalScale } from "@/lib/metrics";
import { StyleProp, View, ViewProps, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type containerProps = ViewProps & {
	children: React.ReactNode;
	style?: StyleProp<ViewStyle>;
};

const Container = ({ children, style, ...props }: containerProps) => {
	const insets = useSafeAreaInsets();
	return (
		<View className="flex-[1]">
			<View
				className="flex-[1]"
				style={[
					{
						paddingHorizontal: horizontalScale(12),
						paddingTop: insets.top + 30,
						paddingBottom: insets.bottom < 35 ? 0 : insets.bottom,
						backgroundColor: "#FFFFFF",
					},
					style,
				]}
			>
				{children}
			</View>
		</View>
	);
};

export default Container;
