import React, { Dispatch, useRef, useState } from "react";
import { Dimensions, StyleSheet, TextInput, View } from "react-native";

interface IProps {
	length: number; // this will be the required length of the input, and dictate how many segments we create
	onChange: Dispatch<string>;
	error: boolean;
}

interface RefMapping {
	[key: number]: TextInput | null;
}

const SegmentedInput = ({ length, onChange, error }: IProps) => {
	const refs = useRef<RefMapping>({});
	const [code, setCode] = useState(Array.from({ length }, () => ""));
	const [focusedIndex, setFocusedIndex] = useState(0);
	const WIDTH = Dimensions.get("window").width;
	const XPADDING = 20;

	const handlePaste = async (text: string) => {
		const currentCode = text.substring(0, length).split("");
		// get the length of the string as an index so that we can use this to move the cursor to the next box (if available)
		const endIndex = currentCode.length - 1;
		// if the length of the clipboard value is less than our input, then pad the end of the array with empty strings
		if (currentCode.length < length) {
			do {
				currentCode.push("");
			} while (currentCode.length < length);
		}
		// then move the cursor to the next relevant input box
		refs.current[endIndex < length - 1 ? endIndex + 1 : endIndex]?.focus();
		setCode(currentCode);
		onChange(currentCode.join(""));
	};

	const handleType = (value: string, index: number) => {
		// check if there is no value but there previously was a value
		const hasDeleted = !value && code[index] !== "";
		const currentCode = code.map((curr, i) => {
			if (i === index) {
				return value;
			}
			return curr;
		});

		// moves to next  or previuos input
		if (!hasDeleted && index < length - 1) {
			refs.current[index + 1]?.focus();
		} else if (hasDeleted && index > 0) refs.current[index - 1]?.focus();
		setCode(currentCode);
		onChange(currentCode.join(""));
	};

	const handleChange = async (text: string, index: number) => {
		if (!code.includes("")) return;
		if (text.length > 1) {
			await handlePaste(text);
			return;
		}
		const numericValue = text.replace(/[^0-9]/g, "");
		handleType(numericValue, index);
	};
	return (
		<View className="flex flex-row justify-between py-5 px-2 items-center">
			{Array.from({ length }, (_, i) => i).map((_, i) => {
				const isFocused = i === focusedIndex;
				return (
					<TextInput
						className="h-16 justify-center items-center text-center text-black rounded-[8px] bg-[#EEEEEE]"
						value={code[i]}
						onChangeText={(text) => {
							handleChange(text, i);
						}}
						onFocus={() => setFocusedIndex(i)}
						ref={(el) => {
							refs.current[i] = el;
						}}
						key={_}
						keyboardType="number-pad"
						maxLength={6}
						style={[
							{
								width:
									// total width - horizontalPadding at either side of screen - horizontalPadding / 2 multiplied by number of inputs
									// this will give us evenly spaced inputs that have 20 pixels at either side
									(WIDTH - XPADDING * 2 - (XPADDING / 2) * length) / length,
							},
							isFocused ? styles.focused : null,
							error ? styles.errorBorder : null,
						]}
					/>
				);
			})}
		</View>
	);
};

export const styles = StyleSheet.create({
	focused: {
		borderColor: "#60a5fa",
		borderWidth: 1,
	},
	errorBorder: {
		borderColor: "red",
		borderWidth: 1,
	},
});

export default SegmentedInput;
