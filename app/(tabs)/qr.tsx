import { Text, TextBold } from "@/components";
import { useUserContext } from "@/contexts/UserContext";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { Dimensions, Image, Platform, StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Svg, { Defs, RadialGradient, Stop, Rect, Filter, FeTurbulence, FeDisplacementMap } from "react-native-svg";

const { width: SCREEN_W } = Dimensions.get("window");

export default function QrTabScreen() {
	const { user } = useUserContext();
	const insets = useSafeAreaInsets();

	if (!user) return null;

	return (
		<View style={styles.root}>
			{/* ── Warm gradient background ── */}
			<View style={StyleSheet.absoluteFill}>
				{/* Base warm gradient */}
				<LinearGradient
					colors={["#f0e7d6", "#e8d5b8", "#dcc8a8"]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={StyleSheet.absoluteFill}
				/>

				{/* Irregular color blobs */}
				<Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
					<Defs>
						<RadialGradient id="blob1" cx="10%" cy="12%" rx="45%" ry="40%">
							<Stop offset="0" stopColor="#b42406" stopOpacity="0.75" />
							<Stop offset="0.6" stopColor="#b42406" stopOpacity="0.2" />
							<Stop offset="1" stopColor="#b42406" stopOpacity="0" />
						</RadialGradient>
						<RadialGradient id="blob2" cx="90%" cy="8%" rx="38%" ry="32%">
							<Stop offset="0" stopColor="#9dbdb8" stopOpacity="0.8" />
							<Stop offset="0.5" stopColor="#9dbdb8" stopOpacity="0.25" />
							<Stop offset="1" stopColor="#9dbdb8" stopOpacity="0" />
						</RadialGradient>
						<RadialGradient id="blob3" cx="75%" cy="70%" rx="50%" ry="40%">
							<Stop offset="0" stopColor="#b42406" stopOpacity="0.5" />
							<Stop offset="0.5" stopColor="#b42406" stopOpacity="0.15" />
							<Stop offset="1" stopColor="#b42406" stopOpacity="0" />
						</RadialGradient>
						<RadialGradient id="blob4" cx="15%" cy="85%" rx="40%" ry="35%">
							<Stop offset="0" stopColor="#9dbdb8" stopOpacity="0.65" />
							<Stop offset="0.5" stopColor="#9dbdb8" stopOpacity="0.2" />
							<Stop offset="1" stopColor="#9dbdb8" stopOpacity="0" />
						</RadialGradient>
						<RadialGradient id="blob5" cx="50%" cy="40%" rx="55%" ry="30%">
							<Stop offset="0" stopColor="#f0e7d6" stopOpacity="0.5" />
							<Stop offset="1" stopColor="#f0e7d6" stopOpacity="0" />
						</RadialGradient>
						<RadialGradient id="blob6" cx="35%" cy="25%" rx="25%" ry="20%">
							<Stop offset="0" stopColor="#b42406" stopOpacity="0.35" />
							<Stop offset="1" stopColor="#b42406" stopOpacity="0" />
						</RadialGradient>
					</Defs>
					<Rect x="0" y="0" width="100%" height="100%" fill="url(#blob1)" />
					<Rect x="0" y="0" width="100%" height="100%" fill="url(#blob2)" />
					<Rect x="0" y="0" width="100%" height="100%" fill="url(#blob3)" />
					<Rect x="0" y="0" width="100%" height="100%" fill="url(#blob4)" />
					<Rect x="0" y="0" width="100%" height="100%" fill="url(#blob5)" />
					<Rect x="0" y="0" width="100%" height="100%" fill="url(#blob6)" />
				</Svg>

				{/* Grainy noise overlay */}
				<Image
					source={require("@/assets/images/noise.png")}
					style={styles.noiseOverlay}
					resizeMode="repeat"
				/>
			</View>

			{/* ── Content ── */}
			<View
				style={[
					styles.content,
					{
						paddingTop: insets.top + verticalScale(20),
						paddingBottom: 60 + insets.bottom + verticalScale(10),
					},
				]}
			>
				{/* Title */}
				<View style={styles.headerSection}>
					<TextBold style={styles.title}>
						{"Show this code\nbefore paying"}
					</TextBold>
					<Text style={styles.subtitle}>
						{"This is your identifier as a member\nof Chop Local"}
					</Text>
				</View>

				{/* ── Glass QR Card ── */}
				<View style={styles.qrSection}>
					<View style={styles.glassCard}>
						{Platform.OS === "ios" ? (
							<BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} />
						) : null}
						<View style={styles.glassInner}>
							{/* QR */}
							<View style={styles.qrContainer}>
								<QRCode
									value={user.code}
									size={SCREEN_W * 0.58}
									backgroundColor="#FFFFFF"
									color="#1A1A1A"
								/>
							</View>

							{/* User info */}
							<TextBold style={styles.userName}>
								{user.firstName} {user.lastName}
							</TextBold>
							{user.email ? (
								<Text style={styles.userEmail}>{user.email}</Text>
							) : null}
						</View>
					</View>
				</View>

				{/* ── Code pill ── */}
				<View style={styles.codeSection}>
					<View style={styles.codePill}>
						{Platform.OS === "ios" ? (
							<BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
						) : null}
						<View style={styles.codePillInner}>
							<Text style={styles.codeLabel}>YOUR CODE</Text>
							<TextBold style={styles.codeValue}>{user.code}</TextBold>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: "#f0e7d6",
	},

	noiseOverlay: {
		...StyleSheet.absoluteFillObject,
		width: "100%",
		height: "100%",
		opacity: 0.12,
	},

	content: {
		flex: 1,
		paddingHorizontal: horizontalScale(20),
	},

	/* ── Header ── */
	headerSection: {
		alignItems: "center",
		marginBottom: verticalScale(20),
	},
	title: {
		fontSize: moderateScale(28),
		color: "#1A1A1A",
		textAlign: "center",
		lineHeight: moderateScale(34),
	},
	subtitle: {
		fontSize: moderateScale(14),
		color: "rgba(0,0,0,0.4)",
		textAlign: "center",
		marginTop: verticalScale(10),
		lineHeight: moderateScale(20),
	},

	/* ── Glass QR Card ── */
	qrSection: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	glassCard: {
		borderRadius: moderateScale(30),
		overflow: "hidden",
		backgroundColor: Platform.OS === "ios" ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.5)",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.6)",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.08,
		shadowRadius: 24,
		elevation: 8,
	},
	glassInner: {
		alignItems: "center",
		paddingTop: verticalScale(24),
		paddingBottom: verticalScale(24),
		paddingHorizontal: horizontalScale(24),
	},
	qrContainer: {
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(22),
		padding: moderateScale(18),
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 3,
	},
	userName: {
		fontSize: moderateScale(18),
		color: "#1A1A1A",
		marginTop: verticalScale(18),
	},
	userEmail: {
		fontSize: moderateScale(13),
		color: "rgba(0,0,0,0.4)",
		marginTop: verticalScale(4),
	},

	/* ── Code Pill ── */
	codeSection: {
		alignItems: "center",
		marginTop: verticalScale(20),
	},
	codePill: {
		borderRadius: moderateScale(50),
		overflow: "hidden",
		backgroundColor: Platform.OS === "ios" ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.5)",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.6)",
	},
	codePillInner: {
		alignItems: "center",
		paddingVertical: verticalScale(14),
		paddingHorizontal: horizontalScale(40),
	},
	codeLabel: {
		fontSize: moderateScale(10),
		color: "rgba(0,0,0,0.35)",
		letterSpacing: 1.5,
	},
	codeValue: {
		fontSize: moderateScale(22),
		color: "#1A1A1A",
		marginTop: verticalScale(2),
	},
});
