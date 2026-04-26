import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { CustomText as Text, CustomTextBold as TextBold } from "./Texts";

// Will be populated by API when backend supports cities
export const AVAILABLE_CITIES = ["All"];

type Props = {
	isOpen: boolean;
	onClose: () => void;
	selectedCity: string;
	onSelectCity: (city: string) => void;
};

export default function CityDropdown({
	isOpen,
	onClose,
	selectedCity,
	onSelectCity,
}: Props) {
	const sheetRef = useRef<BottomSheetModal>(null);

	useEffect(() => {
		if (isOpen) sheetRef.current?.present();
		else sheetRef.current?.dismiss();
	}, [isOpen]);

	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				opacity={0.4}
				pressBehavior="close"
			/>
		),
		[],
	);

	const onPick = (city: string) => {
		onSelectCity(city);
		sheetRef.current?.dismiss();
	};

	return (
		<BottomSheetModal
			ref={sheetRef}
			enableDynamicSizing
			enablePanDownToClose
			onDismiss={onClose}
			backdropComponent={renderBackdrop}
			handleIndicatorStyle={styles.handleIndicator}
			backgroundStyle={styles.sheetBackground}
		>
			<BottomSheetView style={styles.sheetContent}>
				<TextBold style={styles.sheetTitle}>Select City</TextBold>

				{AVAILABLE_CITIES.map((city) => {
					const isSelected = city === selectedCity;
					return (
						<TouchableOpacity
							key={city}
							onPress={() => onPick(city)}
							activeOpacity={0.7}
							style={[styles.option, isSelected && styles.optionSelected]}
						>
							<Text
								style={[
									styles.optionText,
									isSelected && styles.optionTextSelected,
								]}
							>
								{city}
							</Text>
							{isSelected && <TextBold style={styles.check}>✓</TextBold>}
						</TouchableOpacity>
					);
				})}
			</BottomSheetView>
		</BottomSheetModal>
	);
}

const styles = StyleSheet.create({
	sheetBackground: {
		backgroundColor: "#FFFFFF",
		borderTopLeftRadius: moderateScale(20),
		borderTopRightRadius: moderateScale(20),
	},
	handleIndicator: {
		backgroundColor: "#E0E0E0",
		width: horizontalScale(36),
		height: verticalScale(4),
	},
	sheetContent: {
		paddingHorizontal: horizontalScale(20),
		paddingBottom: verticalScale(40),
		paddingTop: verticalScale(4),
	},
	sheetTitle: {
		fontSize: moderateScale(18),
		color: "#1A1A1A",
		marginBottom: verticalScale(16),
	},
	option: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: verticalScale(14),
		paddingHorizontal: horizontalScale(12),
		borderRadius: moderateScale(12),
		marginBottom: verticalScale(4),
	},
	optionSelected: {
		backgroundColor: "#F5F5F5",
	},
	optionText: {
		fontSize: moderateScale(15),
		color: "#666",
	},
	optionTextSelected: {
		color: "#1A1A1A",
	},
	check: {
		fontSize: moderateScale(16),
		color: "#1A1A1A",
	},
});
