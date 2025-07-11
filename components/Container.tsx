import { StyleProp, View, ViewProps, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type containerProps = ViewProps & {
	children: React.ReactNode;
	style?: StyleProp<ViewStyle>;
};

const Container = ({ children, style, ...props }: containerProps) => {
	const insets = useSafeAreaInsets();
	return (
		<View
			className="flex-1 px-3 bg-background"
			style={[
				{
					paddingTop: insets.top,
				},
				style,
			]}
		>
			{children}
		</View>
	);
};

export default Container;
