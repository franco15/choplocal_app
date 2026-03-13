import { Text, TextBold } from "@/components";
import GiftCardItem from "@/components/GiftCardItem";
import { Gift } from "@/constants/svgs";
import { useGiftCardContext } from "@/contexts/GiftCardContext";
import {
	horizontalScale,
	moderateScale,
	verticalScale,
} from "@/lib/metrics";
import { IGiftCard } from "@/lib/types/giftcard";
import { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, View } from "react-native";

type FilterTab = "all" | "active" | "inactive";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
	{ key: "all", label: "All" },
	{ key: "active", label: "Active" },
	{ key: "inactive", label: "Inactive" },
];

export default function GiftCardsList() {
	const { giftCards, isLoading } = useGiftCardContext();
	const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

	const filteredCards = useMemo(() => {
		switch (activeFilter) {
			case "active":
				return giftCards.filter((gc) => gc.isActive);
			case "inactive":
				return giftCards.filter((gc) => !gc.isActive);
			default:
				return giftCards;
		}
	}, [giftCards, activeFilter]);

	const activeCount = useMemo(
		() => giftCards.filter((gc) => gc.isActive).length,
		[giftCards],
	);

	const renderItem = ({
		item,
		index,
	}: {
		item: IGiftCard;
		index: number;
	}) => <GiftCardItem giftCard={item} index={index} type="received" />;

	return (
		<View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
			<FlatList
				data={filteredCards}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
				contentContainerStyle={{
					paddingHorizontal: horizontalScale(14),
					paddingBottom: verticalScale(80),
				}}
				ListHeaderComponent={
					<View
						style={{
							paddingBottom: verticalScale(8),
						}}
					>
						<TextBold
							style={{
								fontSize: moderateScale(30),
								color: "#1A1A1A",
							}}
						>
							Gift Cards
						</TextBold>
						<Text
							style={{
								fontSize: moderateScale(14),
								color: "#888",
								marginTop: verticalScale(4),
							}}
						>
							{activeCount} active
						</Text>

						{/* Filter tabs */}
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={{
								marginTop: verticalScale(20),
								marginBottom: verticalScale(12),
								gap: horizontalScale(10),
							}}
						>
							{FILTER_TABS.map((tab) => {
								const isActive =
									activeFilter === tab.key;
								return (
									<Pressable
										key={tab.key}
										onPress={() =>
											setActiveFilter(tab.key)
										}
									>
										<View
											style={{
												alignItems: "center",
												justifyContent:
													"center",
												paddingVertical:
													verticalScale(8),
												paddingHorizontal:
													horizontalScale(
														16,
													),
												borderRadius:
													moderateScale(20),
												borderWidth: 1.5,
												borderColor:
													"#000000",
												backgroundColor:
													isActive
														? "#000000"
														: "#FFFFFF",
											}}
										>
											<TextBold
												style={{
													fontSize:
														moderateScale(
															13,
														),
													color: isActive
														? "#FFFFFF"
														: "#000000",
												}}
											>
												{tab.label}
											</TextBold>
										</View>
									</Pressable>
								);
							})}
						</ScrollView>
					</View>
				}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<View style={styles.emptyIcon}>
							<Gift
								width={horizontalScale(28)}
								height={verticalScale(28)}
							/>
						</View>
						<TextBold
							style={{
								fontSize: moderateScale(16),
								color: "#1A1A1A",
								marginTop: verticalScale(16),
							}}
						>
							No gift cards yet
						</TextBold>
						<Text
							style={{
								fontSize: moderateScale(13),
								color: "#999",
								marginTop: verticalScale(4),
								textAlign: "center",
							}}
						>
							Gift cards you send or receive{"\n"}will
							appear here.
						</Text>
					</View>
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	emptyContainer: {
		alignItems: "center",
		paddingTop: verticalScale(60),
	},
	emptyIcon: {
		width: moderateScale(72),
		height: moderateScale(72),
		borderRadius: moderateScale(36),
		backgroundColor: "#F5F5F5",
		alignItems: "center",
		justifyContent: "center",
	},
});
