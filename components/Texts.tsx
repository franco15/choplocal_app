import { Text } from "react-native";

export const CustomText = ({ children, style, ...props }: any) => {
	return (
		<Text
			{...props}
			style={[{ fontFamily: "Inter_400Regular", color: "black" }, style]}
			allowFontScaling={false}
		>
			{children}
		</Text>
	);
};

export const CustomTextBold = ({ children, style, ...props }: any) => {
	return (
		<Text
			{...props}
			style={[{ fontFamily: "Inter_700Bold ", color: "black", fontWeight: 700 }, style]}
			allowFontScaling={false}
		>
			{children}
		</Text>
	);
};
