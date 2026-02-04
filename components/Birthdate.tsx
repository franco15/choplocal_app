import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";

interface IProps {
	onChange: (value: string) => void;
	value: string;
}

export default function Birthdate({ onChange, value }: IProps) {
	// const [value, setValue] = useState("");
	const [error, setError] = useState("");

	const currentValue = value ?? "";

	const isLeapYear = (year: number) =>
		year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

	const daysInMonth = (month: number, year?: number) => {
		if (month === 2) return year && isLeapYear(year) ? 29 : 28;
		if ([4, 6, 9, 11].includes(month)) return 30;
		return 31;
	};

	const handleChange = (text: string) => {
		// allow deletion naturally
		if (text.length < currentValue.length) {
			onChange(text);
			setError("");
			return text;
		}

		// keep only numbers
		const cleaned = text.replace(/\D/g, "");

		let mm = cleaned.slice(0, 2);
		let dd = cleaned.slice(2, 4);
		let yyyy = cleaned.slice(4, 8);

		// month validation
		if (mm.length === 2) {
			const month = Number(mm);
			if (month < 1 || month > 12) return;
		}

		// day validation (only when month exists)
		if (dd.length === 2 && mm.length === 2) {
			const month = Number(mm);
			const day = Number(dd);
			const year = yyyy.length === 4 ? Number(yyyy) : undefined;

			if (day < 1 || day > daysInMonth(month, year)) return;
		}

		let formatted = mm;
		if (dd) formatted += "/" + dd;
		if (yyyy) formatted += "/" + yyyy;

		onChange(formatted);

		// final validation once complete
		if (formatted.length === 10) {
			const month = Number(mm);
			const day = Number(dd);
			const year = Number(yyyy);

			const maxDay = daysInMonth(month, year);
			if (day > maxDay) {
				setError("Invalid date");
			} else {
				setError("");
			}
		}
	};
	return (
		<TextInput
			className="justify-center items-center text-black border-[#1A1C20]"
			value={value}
			onChangeText={handleChange}
			placeholder="MM/DD/YYYY"
			keyboardType="number-pad"
			maxLength={10}
			style={[styles.input]}
		/>
	);
}

const styles = StyleSheet.create({
	input: {
		height: verticalScale(40),
		borderRadius: moderateScale(27),
		borderWidth: moderateScale(0.5),
		paddingHorizontal: horizontalScale(20),
		fontSize: moderateScale(13),
	},
});
