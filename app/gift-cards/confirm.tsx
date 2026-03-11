import { Container, Text, TextBold } from "@/components";
import { useGiftCardContext } from "@/contexts/GiftCardContext";
import {
	horizontalScale,
	moderateScale,
	verticalScale,
} from "@/lib/metrics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";

export default function GiftCardConfirm() {
	const router = useRouter();
	const { sendGiftCard } = useGiftCardContext();
	const [sending, setSending] = useState(false);

	const { restaurantId, restaurantName, value, recipientPhone, message } =
		useLocalSearchParams<{
			restaurantId: string;
			restaurantName: string;
			value: string;
			recipientPhone: string;
			message: string;
		}>();

	const onConfirm = async () => {
		setSending(true);
		const giftCard = await sendGiftCard({
			restaurantId: Number(restaurantId),
			restaurantName: restaurantName ?? "",
			value: Number(value),
			recipientPhone: recipientPhone ?? "",
			message: message ?? "",
		});
		setSending(false);
		router.replace({
			pathname: "/gift-cards/success",
			params: {
				restaurantName,
				value,
				recipientPhone,
				code: giftCard.code,
				message: message ?? "",
			},
		});
	};

	return (
		<Container>
			<View style={styles.content}>
				<TextBold
					style={{
						fontSize: moderateScale(28),
						color: "#1A1A1A",
						lineHeight: moderateScale(34),
					}}
				>
					Confirm Gift Card
				</TextBold>
				<Text
					style={{
						fontSize: moderateScale(14),
						color: "#888",
						marginTop: verticalScale(8),
					}}
				>
					Review the details before sending.
				</Text>

				{/* Summary card */}
				<View style={styles.summaryCard}>
					<View style={styles.summaryRow}>
						<Text style={styles.label}>Restaurant</Text>
						<TextBold style={styles.value}>
							{restaurantName}
						</TextBold>
					</View>
					<View style={styles.divider} />
					<View style={styles.summaryRow}>
						<Text style={styles.label}>Value</Text>
						<TextBold style={styles.value}>
							${value}.00
						</TextBold>
					</View>
					<View style={styles.divider} />
					<View style={styles.summaryRow}>
						<Text style={styles.label}>To</Text>
						<TextBold style={styles.value}>
							{recipientPhone}
						</TextBold>
					</View>
					{message ? (
						<>
							<View style={styles.divider} />
							<View style={styles.summaryRow}>
								<Text style={styles.label}>Message</Text>
								<Text
									style={[
										styles.value,
										{ color: "#666" },
									]}
									numberOfLines={2}
								>
									{message}
								</Text>
							</View>
						</>
					) : null}
				</View>

				{/* Buttons */}
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={onConfirm}
					disabled={sending}
					style={styles.buttonWrapper}
				>
					<View style={styles.primaryButton}>
						{sending ? (
							<ActivityIndicator color="#FFFFFF" />
						) : (
							<Text
								style={{
									fontSize: moderateScale(15),
									color: "#FFFFFF",
								}}
							>
								Confirm & Send
							</Text>
						)}
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => router.back()}
					style={{ alignSelf: "center", marginTop: verticalScale(16) }}
				>
					<Text
						style={{
							fontSize: moderateScale(14),
							color: "#888",
							textDecorationLine: "underline",
						}}
					>
						Edit
					</Text>
				</TouchableOpacity>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		paddingHorizontal: horizontalScale(24),
		paddingTop: verticalScale(60),
	},
	summaryCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(16),
		borderWidth: 1,
		borderColor: "#EDEDED",
		padding: moderateScale(20),
		marginTop: verticalScale(28),
	},
	summaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: verticalScale(12),
	},
	divider: {
		height: 1,
		backgroundColor: "#F0F0F0",
	},
	label: {
		fontSize: moderateScale(13),
		color: "#999",
	},
	value: {
		fontSize: moderateScale(15),
		color: "#1A1A1A",
		maxWidth: "60%",
		textAlign: "right",
	},
	buttonWrapper: {
		alignSelf: "center",
		marginTop: verticalScale(32),
		width: "100%",
	},
	primaryButton: {
		backgroundColor: "#000000",
		height: verticalScale(54),
		borderRadius: moderateScale(30),
		alignItems: "center",
		justifyContent: "center",
	},
});
