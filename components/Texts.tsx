import { Text } from "react-native";

export const CustomText = ({ children, style, ...props }: any) => {
	return (
		<Text
			{...props}
			style={[{ fontFamily: "", color: "black" }, style]}
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
			style={[{ fontFamily: "", color: "black", fontWeight: 900 }, style]}
			allowFontScaling={false}
		>
			{children}
		</Text>
	);
};
