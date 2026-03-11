import {
	CustomText as Text,
	CustomTextBold as TextBold,
} from "@/components/Texts";
import { Gift } from "@/constants/svgs";
import {
	horizontalScale,
	moderateScale,
	verticalScale,
} from "@/lib/metrics";
import { EGiftCardStatus, IGiftCard } from "@/lib/types/giftcard";
import { router } from "expo-router";
import { MotiView } from "moti";
import { useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
	[EGiftCardStatus.Available]: { bg: "#D4EDDA", text: "#2D6A3F" },
	[EGiftCardStatus.Used]: { bg: "#E8E8E8", text: "#666666" },
	[EGiftCardStatus.Expired]: { bg: "#FFF3CD", text: "#856404" },
};

type Props = {
	giftCard: IGiftCard;
	index: number;
	type: "sent" | "received";
};

export default function GiftCardItem({ giftCard, index, type }: Props) {
	const statusColor =
		STATUS_COLORS[giftCard.status] ??
		STATUS_COLORS[EGiftCardStatus.Available];

	const onPress = useCallback(() => {
		router.push({
			pathname: "/gift-cards/received",
			params: { giftCardId: giftCard.id },
		});
	}, [giftCard.id]);

	const formatDate = (dateStr: string) => {
		const d = new Date(dateStr);
		return d.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	};

	return (
		<MotiView
			from={{ opacity: 0, translateY: 12 }}
			animate={{ opacity: 1, translateY: 0 }}
			transition={{
				type: "timing",
				duration: 280,
				delay: index * 40,
			}}
		>
			<Pressable
				onPress={onPress}
				style={({ pressed }) => [
					styles.card,
					{
						borderRadius: moderateScale(16),
						marginBottom: verticalScale(14),
						transform: [{ scale: pressed ? 0.985 : 1 }],
					},
				]}
			>
				<View
					style={{
						flexDirection: "row",
						padding: moderateScale(14),
					}}
				>
					{/* Left: Gift icon */}
					<View
						style={[
							styles.iconContainer,
							{
								width: moderateScale(56),
								height: moderateScale(56),
								borderRadius: moderateScale(12),
								marginRight: horizontalScale(12),
							},
						]}
					>
						<Gift
							width={horizontalScale(22)}
							height={verticalScale(22)}
						/>
					</View>

					{/* Center: Info */}
					<View
						style={{ flex: 1, justifyContent: "center" }}
					>
						<TextBold
							numberOfLines={1}
							style={{
								fontSize: moderateScale(15),
								color: "#1A1A1A",
							}}
						>
							{giftCard.restaurantName}
						</TextBold>
						<Text
							style={{
								fontSize: moderateScale(12),
								color: "#888",
								marginTop: verticalScale(4),
							}}
						>
							{type === "sent"
								? `To: ${giftCard.recipientPhone}`
								: `From: ${giftCard.senderName}`}
						</Text>
						<Text
							style={{
								fontSize: moderateScale(11),
								color: "#BBB",
								marginTop: verticalScale(2),
							}}
						>
							{formatDate(giftCard.createdAt)}
						</Text>
					</View>

					{/* Right: Value + Status */}
					<View
						style={{
							alignItems: "flex-end",
							justifyContent: "center",
						}}
					>
						<TextBold
							style={{
								fontSize: moderateScale(18),
								color: "#1A1A1A",
							}}
						>
							${giftCard.value}
						</TextBold>
						<View
							style={[
								styles.statusTag,
								{
									backgroundColor: statusColor.bg,
									paddingHorizontal:
										horizontalScale(8),
									paddingVertical: verticalScale(3),
									borderRadius: moderateScale(8),
									marginTop: verticalScale(4),
								},
							]}
						>
							<Text
								style={{
									fontSize: moderateScale(11),
									color: statusColor.text,
								}}
							>
								{giftCard.status}
							</Text>
						</View>
					</View>
				</View>
			</Pressable>
		</MotiView>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#EDEDED",
		overflow: "hidden",
	},
	iconContainer: {
		backgroundColor: "#FBF6F5",
		alignItems: "center",
		justifyContent: "center",
	},
	statusTag: {},
});
