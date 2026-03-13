import { CustomText as Text, CustomTextBold as TextBold } from "@/components/Texts";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

// Will be populated by API when backend supports cities
export const AVAILABLE_CITIES = [
	"All",
];

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
	const onPick = (city: string) => {
		onSelectCity(city);
		onClose();
	};

	return (
		<Modal
			isVisible={isOpen}
			onBackdropPress={onClose}
			onSwipeComplete={onClose}
			swipeDirection="down"
			backdropOpacity={0.4}
			style={styles.modal}
		>
			<View style={styles.sheet}>
				{/* Handle */}
				<View style={styles.handle} />

				<TextBold style={styles.sheetTitle}>Select City</TextBold>

				{AVAILABLE_CITIES.map((city) => {
					const isSelected = city === selectedCity;
					return (
						<TouchableOpacity
							key={city}
							onPress={() => onPick(city)}
							activeOpacity={0.7}
							style={[
								styles.option,
								isSelected && styles.optionSelected,
							]}
						>
							<Text
								style={[
									styles.optionText,
									isSelected && styles.optionTextSelected,
								]}
							>
								{city}
							</Text>
							{isSelected && (
								<TextBold style={styles.check}>✓</TextBold>
							)}
						</TouchableOpacity>
					);
				})}
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modal: {
		justifyContent: "flex-end",
		margin: 0,
	},
	sheet: {
		backgroundColor: "#FFFFFF",
		borderTopLeftRadius: moderateScale(20),
		borderTopRightRadius: moderateScale(20),
		paddingHorizontal: horizontalScale(20),
		paddingBottom: verticalScale(40),
		paddingTop: verticalScale(12),
	},
	handle: {
		width: horizontalScale(36),
		height: verticalScale(4),
		borderRadius: 2,
		backgroundColor: "#E0E0E0",
		alignSelf: "center",
		marginBottom: verticalScale(16),
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
