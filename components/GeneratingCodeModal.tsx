import { CustomText as Text, CustomTextBold as TextBold } from "@/components/Texts";
import { moderateScale, verticalScale } from "@/lib/metrics";
import { MotiView } from "moti";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

type Props = {
	visible: boolean;
};

export default function GeneratingCodeModal({ visible }: Props) {
	return (
		<Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
			<View style={styles.backdrop}>
				<View style={styles.content}>
					<MotiView
						from={{ opacity: 0, translateY: 15 }}
						animate={{ opacity: 1, translateY: 0 }}
						transition={{ type: "timing", duration: 400 }}
					>
						<TextBold style={styles.title}>
							Generating your{"\n"}code...
						</TextBold>
					</MotiView>

					<ActivityIndicator
						size="large"
						color="#FFFFFF"
						style={{ marginTop: verticalScale(32) }}
					/>

					<MotiView
						from={{ opacity: 0, translateY: 10 }}
						animate={{ opacity: 1, translateY: 0 }}
						transition={{ type: "timing", duration: 400, delay: 300 }}
					>
						<Text style={styles.subtitle}>
							Hold tight!
						</Text>
					</MotiView>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: "#96190F",
		alignItems: "center",
		justifyContent: "center",
	},
	content: {
		alignItems: "center",
		paddingHorizontal: 40,
	},
	title: {
		fontSize: moderateScale(38),
		color: "#FFFFFF",
		textAlign: "center",
		lineHeight: moderateScale(46),
	},
	subtitle: {
		fontSize: moderateScale(18),
		color: "rgba(255,255,255,0.75)",
		textAlign: "center",
		marginTop: verticalScale(24),
	},
});
