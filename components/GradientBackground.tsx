import {
	Canvas,
	Group,
	Rect,
	SweepGradient,
	vec,
} from "@shopify/react-native-skia";
import { Dimensions, StyleSheet } from "react-native";

// const { width, height } = Dimensions.get("window");
const { width, height } = Dimensions.get("screen");

export default function GradientBackground() {
	return (
		<Canvas
			style={[
				StyleSheet.absoluteFill,
				{ position: "absolute", zIndex: -1, width, height },
			]}
		>
			<Group
				transform={[
					{ rotate: Math.PI }, // 180 degrees in radians
					{ translateX: -width }, // shift back after rotation
					{ translateY: -height },
				]}
			>
				<Rect x={0} y={0} width={width} height={height}>
					<SweepGradient
						c={vec(width / 3, height / 3)}
						colors={["#CCE6E7", "#FFFFFF", "#061251", "#DF7740", "#CCE6E7"]}
						positions={[0.01, 0.25, 0.62, 0.86, 0.96]}
					/>
				</Rect>
			</Group>
		</Canvas>
	);
}
