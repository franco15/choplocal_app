import { Container, Text, TextBold } from "@/components";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { MotiView } from "moti";
import { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RsvpSuccess() {
	const insets = useSafeAreaInsets();
	const { id } = useLocalSearchParams<{ id: string }>();

	useEffect(() => {
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
	}, []);

	return (
		<Container style={{ paddingTop: 0 }}>
			<View style={[styles.root, { paddingBottom: insets.bottom + verticalScale(16) }]}>
				<View style={styles.center}>
					<MotiView
						from={{ opacity: 0, scale: 0.6 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ type: "spring", damping: 12 }}
						style={styles.iconCircle}
					>
						<Ionicons
							name="checkmark"
							size={moderateScale(54)}
							color="#FFFFFF"
						/>
					</MotiView>

					<MotiView
						from={{ opacity: 0, translateY: 10 }}
						animate={{ opacity: 1, translateY: 0 }}
						transition={{ type: "timing", duration: 300, delay: 150 }}
					>
						<TextBold style={styles.title}>You&apos;re in!</TextBold>
						<Text style={styles.subtitle}>
							Payment successful — your ticket is confirmed.
						</Text>
					</MotiView>
				</View>

				<View style={styles.actions}>
					<TouchableOpacity
						activeOpacity={0.85}
						onPress={() =>
							router.replace({
								pathname: "/events/ticket",
								params: { id },
							})
						}
						style={styles.primaryBtn}
					>
						<Ionicons
							name="ticket-outline"
							size={18}
							color="#FFFFFF"
							style={{ marginRight: 8 }}
						/>
						<TextBold style={styles.primaryBtnText}>View ticket</TextBold>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={0.7}
						onPress={() =>
							router.replace({
								pathname: "/events/[id]",
								params: { id },
							})
						}
						style={styles.secondaryBtn}
					>
						<Text style={styles.secondaryBtnText}>Back to event</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		paddingHorizontal: horizontalScale(8),
	},
	center: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	iconCircle: {
		width: moderateScale(96),
		height: moderateScale(96),
		borderRadius: moderateScale(48),
		backgroundColor: "#10B981",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: verticalScale(24),
	},
	title: {
		fontSize: moderateScale(26),
		color: "#1A1A1A",
		textAlign: "center",
	},
	subtitle: {
		fontSize: moderateScale(14),
		color: "#888",
		textAlign: "center",
		marginTop: verticalScale(8),
		paddingHorizontal: horizontalScale(20),
	},
	actions: {
		gap: verticalScale(10),
	},
	primaryBtn: {
		flexDirection: "row",
		backgroundColor: "#000000",
		height: verticalScale(54),
		borderRadius: moderateScale(30),
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
	primaryBtnText: {
		fontSize: moderateScale(16),
		color: "#FFFFFF",
	},
	secondaryBtn: {
		alignItems: "center",
		paddingVertical: verticalScale(12),
	},
	secondaryBtnText: {
		fontSize: moderateScale(14),
		color: "#999",
	},
});
