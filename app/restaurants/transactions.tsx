import { Text, TextBold } from "@/components";
import { useUserContext } from "@/contexts/UserContext";
import { queryClient, queryKeys } from "@/lib/api/queryClient";
import { useRestaurantApi } from "@/lib/api/useApi";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { Ionicons } from "@expo/vector-icons";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";
import TransactionsSkeleton from "../skeletons/transactions";

export default function Transactions() {
	const { restaurantId } = useLocalSearchParams();
	const { user } = useUserContext();
	const restaurantApi = useRestaurantApi();
	const router = useRouter();
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await queryClient.invalidateQueries({ queryKey: [queryKeys.restaurants.transactions(restaurantId as string)] });
		setRefreshing(false);
	}, [restaurantId]);

	const { data: transactions, isPending } = useSuspenseQuery({
		queryKey: [queryKeys.restaurants.transactions(restaurantId as string)],
		queryFn: async () => {
			const data = await restaurantApi.transactions(
				restaurantId as string,
				user.id,
			);
			return data;
		},
	});

	if (isPending) return <TransactionsSkeleton />;

	const totalCashback = transactions.reduce(
		(sum, t) => sum + t.cashback,
		0,
	);

	return (
		<View style={styles.root}>
			<FlatList
				data={[...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#b42406" progressViewOffset={100} />
				}
				initialNumToRender={10}
				contentContainerStyle={{
					paddingHorizontal: horizontalScale(16),
					paddingBottom: verticalScale(80),
				}}
				keyExtractor={(_, index) => String(index)}
				ListHeaderComponent={
					<View style={{ paddingBottom: verticalScale(8) }}>
						<TextBold style={styles.title}>
							Recent Activity
						</TextBold>
						{transactions.length > 0 && (
							<Text style={styles.subtitle}>
								{transactions.length}{" "}
								{transactions.length === 1 ? "visit" : "visits"}{" "}
								· ${totalCashback.toFixed(2)} earned
							</Text>
						)}
					</View>
				}
				renderItem={({ item, index }) => (
					<View
						style={[
							styles.transactionCard,
							index < transactions.length - 1 && {
								marginBottom: verticalScale(10),
							},
						]}
					>
						<View style={styles.transactionIcon}>
							<Ionicons
								name="receipt-outline"
								size={moderateScale(18)}
								color="#b42406"
							/>
						</View>
						<View style={{ flex: 1 }}>
							<TextBold style={styles.transactionDate}>
								{new Date(item.date).toLocaleDateString(
									"en-US",
									{
										month: "short",
										day: "numeric",
										year: "numeric",
									},
								)}
							</TextBold>
							<Text style={styles.transactionLabel}>
								Visit
							</Text>
						</View>
						<TextBold style={styles.transactionAmount}>
							+${item.cashback.toFixed(2)}
						</TextBold>
					</View>
				)}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<View style={styles.emptyIcon}>
							<Ionicons
								name="receipt-outline"
								size={moderateScale(32)}
								color="#CCC"
							/>
						</View>
						<TextBold style={styles.emptyTitle}>
							No visits yet
						</TextBold>
						<Text style={styles.emptyText}>
							Visit the restaurant to start{"\n"}earning
							cashback!
						</Text>
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => router.back()}
							style={styles.emptyButton}
						>
							<TextBold style={styles.emptyButtonText}>
								Go Back
							</TextBold>
						</TouchableOpacity>
					</View>
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	title: {
		fontSize: moderateScale(30),
		color: "#1A1A1A",
	},
	subtitle: {
		fontSize: moderateScale(14),
		color: "#888",
		marginTop: verticalScale(4),
	},

	/* Transaction Card */
	transactionCard: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(16),
		borderWidth: 1,
		borderColor: "#EDEDED",
		padding: moderateScale(16),
	},
	transactionIcon: {
		width: moderateScale(40),
		height: moderateScale(40),
		borderRadius: moderateScale(20),
		backgroundColor: "#FBF6F5",
		alignItems: "center",
		justifyContent: "center",
		marginRight: horizontalScale(12),
	},
	transactionDate: {
		fontSize: moderateScale(15),
		color: "#1A1A1A",
	},
	transactionLabel: {
		fontSize: moderateScale(12),
		color: "#AAA",
		marginTop: verticalScale(2),
	},
	transactionAmount: {
		fontSize: moderateScale(16),
		color: "#2E7D32",
	},

	/* Empty */
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
	emptyTitle: {
		fontSize: moderateScale(16),
		color: "#1A1A1A",
		marginTop: verticalScale(16),
	},
	emptyText: {
		fontSize: moderateScale(13),
		color: "#999",
		marginTop: verticalScale(4),
		textAlign: "center",
	},
	emptyButton: {
		backgroundColor: "#1A1A1A",
		paddingHorizontal: horizontalScale(32),
		paddingVertical: verticalScale(14),
		borderRadius: moderateScale(30),
		marginTop: verticalScale(24),
	},
	emptyButtonText: {
		fontSize: moderateScale(14),
		color: "#FFFFFF",
	},
});
