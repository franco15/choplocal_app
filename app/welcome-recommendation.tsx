import { Text, TextBold } from "@/components";
import { useAuthContext } from "@/contexts/AuthContext";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WelcomeRecommendationScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { clearNewUser } = useAuthContext();

	const handleRedeem = () => {
		clearNewUser();
		router.replace("/redeem-code");
	};

	const handleSkip = () => {
		clearNewUser();
		router.replace("/(tabs)");
	};

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: "#FFFFFF",
				paddingTop: insets.top,
				paddingBottom: insets.bottom + verticalScale(24),
				paddingHorizontal: horizontalScale(28),
			}}
		>
			{/* Main content */}
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<MotiView
					from={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ type: "spring", damping: 14, stiffness: 120 }}
				>
					<View
						style={{
							width: moderateScale(100),
							height: moderateScale(100),
							borderRadius: moderateScale(50),
							backgroundColor: "#FDF0EF",
							alignItems: "center",
							justifyContent: "center",
							marginBottom: verticalScale(32),
						}}
					>
						<Ionicons
							name="ticket-outline"
							size={moderateScale(48)}
							color="#b42406"
						/>
					</View>
				</MotiView>

				<MotiView
					from={{ opacity: 0, translateY: 10 }}
					animate={{ opacity: 1, translateY: 0 }}
					transition={{ type: "timing", duration: 350, delay: 150 }}
				>
					<TextBold
						style={{
							fontSize: moderateScale(28),
							color: "#1A1A1A",
							textAlign: "center",
							lineHeight: moderateScale(36),
							marginBottom: verticalScale(16),
						}}
					>
						Do you have a recommendation code?
					</TextBold>
				</MotiView>

				<MotiView
					from={{ opacity: 0, translateY: 8 }}
					animate={{ opacity: 1, translateY: 0 }}
					transition={{ type: "timing", duration: 300, delay: 250 }}
				>
					<Text
						style={{
							fontSize: moderateScale(15),
							color: "#888",
							textAlign: "center",
							lineHeight: moderateScale(22),
						}}
					>
						If someone recommended Chop Local to you, enter their code and get a
						reward on your first visit.
					</Text>
				</MotiView>
			</View>

			{/* Buttons */}
			<MotiView
				from={{ opacity: 0, translateY: 20 }}
				animate={{ opacity: 1, translateY: 0 }}
				transition={{ type: "timing", duration: 350, delay: 400 }}
				style={{ gap: verticalScale(12) }}
			>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={handleRedeem}
					style={{
						backgroundColor: "#b42406",
						height: verticalScale(54),
						borderRadius: moderateScale(30),
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<TextBold
						style={{ color: "#FFFFFF", fontSize: moderateScale(15) }}
					>
						I have a code
					</TextBold>
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={0.8}
					onPress={handleSkip}
					style={{
						height: verticalScale(54),
						borderRadius: moderateScale(30),
						alignItems: "center",
						justifyContent: "center",
						borderWidth: 1.5,
						borderColor: "#1A1A1A",
					}}
				>
					<Text
						style={{ color: "#1A1A1A", fontSize: moderateScale(15) }}
					>
						No, thanks
					</Text>
				</TouchableOpacity>
			</MotiView>
		</View>
	);
}
