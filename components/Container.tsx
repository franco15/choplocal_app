import { StyleProp, View, ViewProps, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GradientBackground from "./GradientBackground";

type containerProps = ViewProps & {
	children: React.ReactNode;
	style?: StyleProp<ViewStyle>;
	useGradient?: boolean;
};

const Container = ({
	children,
	style,
	useGradient = true,
	...props
}: containerProps) => {
	const insets = useSafeAreaInsets();
	return (
		<View className="flex-[1]">
			{useGradient && <GradientBackground />}
			<View
				className="flex-[1] px-3"
				style={[
					{
						paddingTop: insets.top,
						paddingBottom: insets.bottom,
						backgroundColor: useGradient ? "transparent" : "#FFFFFF",
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
