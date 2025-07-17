import { cn } from "@/lib/utils";
import clsx from "clsx";
import { Text } from "react-native";

export const CustomText = ({ children, className, style, ...props }: any) => {
	return (
		<Text
			className={cn("text-black", clsx(className))}
			{...props}
			style={[{ fontFamily: "Inter_400Regular" }, style]}
			allowFontScaling={false}
		>
			{children}
		</Text>
	);
};

export const CustomTextBold = ({
	children,
	className,
	style,
	...props
}: any) => {
	return (
		<Text
			className={cn("text-black", clsx(className))}
			style={[{ fontFamily: "Inter_700Bold ", fontWeight: 700 }, style]}
			allowFontScaling={false}
			{...props}
		>
			{children}
		</Text>
	);
};
