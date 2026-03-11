import { Container, Text, TextBold } from "@/components";
import { Gift } from "@/constants/svgs";
import { useGiftCardContext } from "@/contexts/GiftCardContext";
import {
	horizontalScale,
	moderateScale,
	verticalScale,
} from "@/lib/metrics";
import { EGiftCardStatus } from "@/lib/types/giftcard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function GiftCardReceived() {
	const router = useRouter();
	const { giftCardId } = useLocalSearchParams<{
		giftCardId: string;
	}>();
	const { getGiftCardById, acceptGiftCard, declineGiftCard } =
		useGiftCardContext();

	const giftCard = getGiftCardById(giftCardId ?? "");

	if (!giftCard) {
		return (
			<Container>
				<View style={styles.content}>
					<Text
						style={{
							fontSize: moderateScale(15),
							color: "#888",
							textAlign: "center",
						}}
					>
						Gift card not found.
					</Text>
				</View>
			</Container>
		);
	}

	const isAvailable = giftCard.status === EGiftCardStatus.Available;

	const onAccept = async () => {
		await acceptGiftCard(giftCard.id);
		router.replace({
			pathname: "/gift-cards/accepted",
			params: {
				restaurantId: String(giftCard.restaurantId),
				restaurantName: giftCard.restaurantName,
			},
		});
	};

	const onDecline = async () => {
		await declineGiftCard(giftCard.id);
		router.back();
	};

	return (
		<Container>
			<View style={styles.content}>
				<MotiView
					from={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ type: "timing", duration: 350 }}
				>
					{/* Gift card visual */}
					<View style={styles.card}>
						<View style={styles.giftIconCircle}>
							<Gift
								width={horizontalScale(28)}
								height={verticalScale(28)}
							/>
						</View>
						<TextBold
							style={{
								fontSize: moderateScale(22),
								color: "#1A1A1A",
								marginTop: verticalScale(14),
							}}
						>
							{giftCard.restaurantName}
						</TextBold>
						<TextBold
							style={{
								fontSize: moderateScale(38),
								color: "#1A1A1A",
								marginTop: verticalScale(6),
							}}
						>
							${giftCard.value}.00
						</TextBold>

						{/* Status badge */}
						<View
							style={[
								styles.statusBadge,
								{
									backgroundColor: isAvailable
										? "#D4EDDA"
										: giftCard.status ===
											  EGiftCardStatus.Used
											? "#E8E8E8"
											: "#FFF3CD",
								},
							]}
						>
							<Text
								style={{
									fontSize: moderateScale(12),
									color: isAvailable
										? "#2D6A3F"
										: giftCard.status ===
											  EGiftCardStatus.Used
											? "#666"
											: "#856404",
								}}
							>
								{giftCard.status}
							</Text>
						</View>
					</View>
				</MotiView>

				{/* Sender info */}
				<View style={styles.messageBox}>
					<Text
						style={{
							fontSize: moderateScale(14),
							color: "#1A1A1A",
							lineHeight: moderateScale(20),
						}}
					>
						{giftCard.senderName} sent you this gift card
						{giftCard.message
							? `: "${giftCard.message}"`
							: "."}
					</Text>
				</View>

				{/* Action buttons (only for Available) */}
				{isAvailable && (
					<View style={{ marginTop: verticalScale(28) }}>
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={onAccept}
						>
							<View style={styles.primaryButton}>
								<Text
									style={{
										fontSize: moderateScale(15),
										color: "#FFFFFF",
									}}
								>
									Accept
								</Text>
							</View>
						</TouchableOpacity>

						<TouchableOpacity
							activeOpacity={0.8}
							onPress={onDecline}
							style={{
								alignSelf: "center",
								marginTop: verticalScale(16),
							}}
						>
							<Text
								style={{
									fontSize: moderateScale(14),
									color: "#888",
									textDecorationLine: "underline",
								}}
							>
								Decline
							</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		paddingHorizontal: horizontalScale(24),
		justifyContent: "center",
	},
	card: {
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(24),
		borderWidth: 1,
		borderColor: "#EDEDED",
		padding: moderateScale(28),
		alignItems: "center",
	},
	giftIconCircle: {
		width: moderateScale(56),
		height: moderateScale(56),
		borderRadius: moderateScale(28),
		backgroundColor: "#FBF6F5",
		alignItems: "center",
		justifyContent: "center",
	},
	statusBadge: {
		marginTop: verticalScale(12),
		paddingHorizontal: horizontalScale(12),
		paddingVertical: verticalScale(4),
		borderRadius: moderateScale(10),
	},
	messageBox: {
		backgroundColor: "#F5F5F5",
		borderRadius: moderateScale(14),
		padding: moderateScale(16),
		marginTop: verticalScale(20),
	},
	primaryButton: {
		backgroundColor: "#000000",
		height: verticalScale(54),
		borderRadius: moderateScale(30),
		alignItems: "center",
		justifyContent: "center",
	},
});
