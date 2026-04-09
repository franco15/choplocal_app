import { CustomText as Text, CustomTextBold as TextBold } from "./Texts";
import { Ionicons } from "@expo/vector-icons";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
	title: string;
	subtitle?: string;
	onSeeAll?: () => void;
};

export default function SectionHeader({ title, subtitle, onSeeAll }: Props) {
	return (
		<View style={styles.container}>
			<View style={{ flex: 1 }}>
				<TextBold style={styles.title}>{title}</TextBold>
				{subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
			</View>
			{onSeeAll && (
				<Pressable
					onPress={onSeeAll}
					hitSlop={10}
					style={({ pressed }) => ({
						flexDirection: "row",
						alignItems: "center",
						opacity: pressed ? 0.5 : 1,
						gap: horizontalScale(4),
					})}
				>
					<Text style={styles.seeAll}>all</Text>
					<Ionicons
						name="arrow-forward"
						size={moderateScale(16)}
						color="#888"
					/>
				</Pressable>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "space-between",
		paddingHorizontal: horizontalScale(4),
		marginBottom: verticalScale(14),
	},
	title: {
		fontSize: moderateScale(20),
		color: "#1A1A1A",
	},
	subtitle: {
		fontSize: moderateScale(13),
		color: "#999",
		marginTop: verticalScale(2),
	},
	seeAll: {
		fontSize: moderateScale(14),
		color: "#888",
	},
});
