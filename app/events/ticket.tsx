import {
	CustomText as Text,
	CustomTextBold as TextBold,
} from "@/components/Texts";
import { useUserContext } from "@/contexts/UserContext";
import { useDropById } from "@/lib/api/queries/dropQueries";
import { moderateScale } from "@/lib/metrics";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import {
	ActivityIndicator,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BRAND_RED = "#b42406";
const SCREEN_BG = "#FFFFFF";
const NOTCH_SIZE = 32;
const TOP_PADDING = 8;
const IMAGE_HEIGHT = 220;
const VENUE_PADDING_BOTTOM = 22;
// Total height of the white top stub: image + venue name area
const TOP_STUB_APPROX_HEIGHT = IMAGE_HEIGHT + 16 + 30 + VENUE_PADDING_BOTTOM;

const formatTimeOnly = (str: string): string => {
	const d = new Date(str);
	const h = d.getHours() % 12 || 12;
	const m = d.getMinutes().toString().padStart(2, "0");
	const ampm = d.getHours() >= 12 ? "PM" : "AM";
	return `${h}:${m} ${ampm}`;
};

const formatDateOnly = (str: string): string => {
	const d = new Date(str);
	const months = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
	];
	return `${d.getDate()} ${months[d.getMonth()]}`;
};

export default function TicketScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const insets = useSafeAreaInsets();
	const { user } = useUserContext();

	const { data: event, isLoading } = useDropById(id, user?.id);

	const goBack = useCallback(() => {
		router.back();
	}, []);

	if (isLoading || !event) {
		return (
			<View style={styles.loadingRoot}>
				<ActivityIndicator size="large" color={BRAND_RED} />
			</View>
		);
	}

	const qrValue = event.userRsvpId || event.id;
	const isPending = event.userRsvp === "pending";
	const ticketId = qrValue.replace(/-/g, "").slice(0, 6).toUpperCase();
	const venueName = event.restaurant?.name || event.venueName;

	return (
		<View style={styles.root}>
			{/* Top bar */}
			<View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
				<TouchableOpacity
					onPress={goBack}
					activeOpacity={0.7}
					hitSlop={10}
					style={styles.backRow}
				>
					<Ionicons name="chevron-back" size={22} color="#1A1A1A" />
					<Text style={styles.backText}>Drops</Text>
				</TouchableOpacity>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: insets.bottom + 32,
					paddingHorizontal: 20,
					paddingTop: TOP_PADDING,
				}}
			>
				{/* ── Ticket ── */}
				<View style={styles.ticket}>
					{/* Top stub — image + venue name */}
					<View style={styles.topStub}>
						<View style={styles.imageWrap}>
							{event.coverImage ? (
								<Image
									source={{ uri: event.coverImage }}
									style={styles.image}
									resizeMode="cover"
								/>
							) : (
								<View
									style={[
										styles.image,
										{
											backgroundColor:
												event.accentColor || BRAND_RED,
										},
									]}
								/>
							)}
						</View>
						<TextBold style={styles.venueName} numberOfLines={2}>
							{venueName}
						</TextBold>
					</View>

					{/* Notches eating into the seam */}
					<View style={styles.notchLeft} />
					<View style={styles.notchRight} />

					{/* Dashed perforation line */}
					<View style={styles.dashRow}>
						{Array.from({ length: 24 }).map((_, i) => (
							<View key={i} style={styles.dash} />
						))}
					</View>

					{/* Bottom red section */}
					<View style={styles.bottom}>
						{/* Grid */}
						<View style={styles.gridRow}>
							<View style={styles.gridItem}>
								<Text style={styles.gridLabel}>status</Text>
								<TextBold style={styles.gridValue}>
									{isPending ? "Pending" : "Confirmed"}
								</TextBold>
							</View>
							<View style={styles.gridItem}>
								<Text style={styles.gridLabel}>ticket</Text>
								<TextBold style={styles.gridValue}>
									#{ticketId}
								</TextBold>
							</View>
						</View>

						<View style={[styles.gridRow, { marginBottom: 22 }]}>
							<View style={styles.gridItem}>
								<Text style={styles.gridLabel}>date</Text>
								<TextBold style={styles.gridValue}>
									{formatDateOnly(event.startDate)}
								</TextBold>
							</View>
							<View style={styles.gridItem}>
								<Text style={styles.gridLabel}>time</Text>
								<TextBold style={styles.gridValue}>
									{formatTimeOnly(event.startDate)}
								</TextBold>
							</View>
						</View>

						{/* QR */}
						<View style={styles.qrWrap}>
							<View style={styles.qrCard}>
								<QRCode
									value={qrValue}
									size={moderateScale(150)}
									color="#1A1A1A"
									backgroundColor="#FFFFFF"
								/>
							</View>
						</View>
					</View>
				</View>

				{/* Footer */}
				<Text style={styles.footerNote}>
					Save or screenshot this ticket. You'll need it at the door.
				</Text>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: SCREEN_BG,
	},
	loadingRoot: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: SCREEN_BG,
	},

	/* Top bar */
	topBar: {
		paddingHorizontal: 16,
		paddingBottom: 12,
	},
	backRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	backText: {
		fontSize: 16,
		color: "#1A1A1A",
		marginLeft: 2,
	},

	/* ── Ticket ── */
	ticket: {
		position: "relative",
	},
	topStub: {
		backgroundColor: "#FFFFFF",
		borderTopLeftRadius: 18,
		borderTopRightRadius: 18,
		paddingBottom: VENUE_PADDING_BOTTOM,
		overflow: "hidden",
	},
	imageWrap: {
		width: "100%",
		height: IMAGE_HEIGHT,
		backgroundColor: "#F0F0F0",
	},
	image: {
		width: "100%",
		height: "100%",
	},
	venueName: {
		fontSize: 24,
		color: "#1A1A1A",
		marginTop: 16,
		marginHorizontal: 22,
		lineHeight: 28,
	},

	/* Notches: SCREEN_BG-colored circles overlapping the seam */
	notchLeft: {
		position: "absolute",
		top: TOP_STUB_APPROX_HEIGHT - NOTCH_SIZE / 2,
		left: -NOTCH_SIZE / 2,
		width: NOTCH_SIZE,
		height: NOTCH_SIZE,
		borderRadius: NOTCH_SIZE / 2,
		backgroundColor: SCREEN_BG,
		zIndex: 10,
		elevation: 0,
		shadowOpacity: 0,
	},
	notchRight: {
		position: "absolute",
		top: TOP_STUB_APPROX_HEIGHT - NOTCH_SIZE / 2,
		right: -NOTCH_SIZE / 2,
		width: NOTCH_SIZE,
		height: NOTCH_SIZE,
		borderRadius: NOTCH_SIZE / 2,
		backgroundColor: SCREEN_BG,
		zIndex: 10,
		elevation: 0,
		shadowOpacity: 0,
	},

	/* Dashed perforation line at the seam */
	dashRow: {
		position: "absolute",
		top: TOP_STUB_APPROX_HEIGHT - 1,
		left: NOTCH_SIZE / 2 + 6,
		right: NOTCH_SIZE / 2 + 6,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		zIndex: 1,
	},
	dash: {
		width: 6,
		height: 2,
		backgroundColor: "#D0D0D0",
		borderRadius: 1,
	},

	/* Bottom red */
	bottom: {
		backgroundColor: BRAND_RED,
		borderBottomLeftRadius: 18,
		borderBottomRightRadius: 18,
		paddingHorizontal: 22,
		paddingTop: 24,
		paddingBottom: 24,
	},
	gridRow: {
		flexDirection: "row",
		marginBottom: 16,
	},
	gridItem: {
		flex: 1,
		paddingRight: 8,
	},
	gridLabel: {
		fontSize: 11,
		color: "rgba(255,255,255,0.65)",
		marginBottom: 4,
		letterSpacing: 0.3,
	},
	gridValue: {
		fontSize: 17,
		color: "#FFFFFF",
	},

	/* QR */
	qrWrap: {
		alignItems: "center",
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: "rgba(255,255,255,0.2)",
	},
	qrCard: {
		padding: 14,
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
	},

	/* Footer */
	footerNote: {
		fontSize: 12,
		color: "#888",
		textAlign: "center",
		marginTop: 22,
		paddingHorizontal: 16,
		lineHeight: 18,
	},
});
