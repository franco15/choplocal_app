import { Text, TextBold } from "@/components";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	Alert,
	Linking,
	Platform,
	ScrollView,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { logout, setShowDeletedUserAlert } = useAuthContext();
	const { deleteUser } = useUserContext();
	const [isDeleting, setIsDeleting] = useState(false);

	const onDeleteAccount = () => {
		Alert.alert(
			"Delete your account?",
			"This action is permanent and cannot be undone. All your data, balances, and gift cards will be lost.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete Account",
					style: "destructive",
					onPress: async () => {
						setIsDeleting(true);
						await deleteUser();
						await logout();
						setShowDeletedUserAlert(true);
						setIsDeleting(false);
					},
				},
			],
		);
	};

	const onLogout = () => {
		Alert.alert("Log out", "Are you sure you want to log out?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Log out",
				onPress: async () => {
					await logout();
				},
			},
		]);
	};

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: "#FEFCFB",
				paddingTop:
					Platform.OS === "ios" ? 0 : insets.top + verticalScale(16),
			}}
		>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingHorizontal: horizontalScale(20),
					paddingBottom: verticalScale(60),
				}}
			>
				{/* Header (Android only) */}
				{Platform.OS !== "ios" && (
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							marginBottom: verticalScale(16),
						}}
					>
						<TouchableOpacity
							onPress={() => router.back()}
							hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
						>
							<Ionicons
								name="arrow-back"
								size={moderateScale(24)}
								color="#1A1A1A"
							/>
						</TouchableOpacity>
						<TextBold
							style={{
								fontSize: moderateScale(18),
								color: "#1A1A1A",
							}}
						>
							Settings
						</TextBold>
						<View style={{ width: moderateScale(24) }} />
					</View>
				)}

				<TextBold
					style={{
						fontSize: moderateScale(28),
						color: "#1A1A1A",
						marginBottom: verticalScale(28),
					}}
				>
					Settings
				</TextBold>

				{/* Legal Section */}
				<Text
					style={{
						fontSize: moderateScale(14),
						color: "#999",
						marginBottom: verticalScale(10),
						marginLeft: horizontalScale(4),
					}}
				>
					Legal
				</Text>

				<TouchableOpacity
					activeOpacity={0.6}
					onPress={() => Linking.openURL("https://choplocally.com/terms")}
					style={{
						backgroundColor: "#FFFFFF",
						borderRadius: 16,
						borderWidth: 1,
						borderColor: "#E0E0E0",
						paddingHorizontal: 20,
						paddingVertical: 18,
						marginBottom: 14,
					}}
				>
					<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
						<Text style={{ fontSize: moderateScale(17), color: "#1A1A1A" }}>
							Terms and Conditions
						</Text>
						<Ionicons name="chevron-forward" size={moderateScale(18)} color="#CCC" />
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={0.6}
					onPress={() => Linking.openURL("https://choplocally.com/privacy")}
					style={{
						backgroundColor: "#FFFFFF",
						borderRadius: 16,
						borderWidth: 1,
						borderColor: "#E0E0E0",
						paddingHorizontal: 20,
						paddingVertical: 18,
						marginBottom: 32,
					}}
				>
					<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
						<Text style={{ fontSize: moderateScale(17), color: "#1A1A1A" }}>
							Privacy Policy
						</Text>
						<Ionicons name="chevron-forward" size={moderateScale(18)} color="#CCC" />
					</View>
				</TouchableOpacity>

				{/* Account Section */}
				<Text
					style={{
						fontSize: moderateScale(14),
						color: "#999",
						marginBottom: verticalScale(10),
						marginLeft: horizontalScale(4),
					}}
				>
					Account
				</Text>

				<TouchableOpacity
					activeOpacity={0.6}
					onPress={onDeleteAccount}
					disabled={isDeleting}
					style={{
						backgroundColor: "#FFFFFF",
						borderRadius: 16,
						borderWidth: 1,
						borderColor: "#E0E0E0",
						paddingHorizontal: 20,
						paddingVertical: 18,
						marginBottom: 14,
						opacity: isDeleting ? 0.4 : 1,
					}}
				>
					<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
						<Text style={{ fontSize: moderateScale(17), color: "#DC3545" }}>
							Delete Account
						</Text>
						<Ionicons name="chevron-forward" size={moderateScale(18)} color="#CCC" />
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={0.6}
					onPress={onLogout}
					disabled={isDeleting}
					style={{
						backgroundColor: "#FFFFFF",
						borderRadius: 16,
						borderWidth: 1,
						borderColor: "#E0E0E0",
						paddingHorizontal: 20,
						paddingVertical: 18,
						marginBottom: 32,
						opacity: isDeleting ? 0.4 : 1,
					}}
				>
					<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
						<Text style={{ fontSize: moderateScale(17), color: "#1A1A1A" }}>
							Log Out
						</Text>
						<Ionicons name="chevron-forward" size={moderateScale(18)} color="#CCC" />
					</View>
				</TouchableOpacity>

				<Text
					style={{
						fontSize: moderateScale(12),
						color: "#CCC",
						textAlign: "center",
						marginTop: verticalScale(16),
					}}
				>
					Chop Local v1.0
				</Text>
			</ScrollView>
		</View>
	);
}
