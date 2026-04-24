import {
	CustomText as Text,
	CustomTextBold as TextBold,
} from "@/components/Texts";
import RsvpBottomSheet from "@/components/events/RsvpBottomSheet";
import { useAuthContext } from "@/contexts/AuthContext";
import {
	useCancelRsvpMutation,
	useDropById,
	useRsvpMutation,
} from "@/lib/api/queries/dropQueries";
import { verticalScale } from "@/lib/metrics";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Image,
	Linking,
	Platform,
	ScrollView,
	Share,
	StyleSheet,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const formatFullDate = (startStr: string, endStr: string): string => {
	const start = new Date(startStr);
	const end = new Date(endStr);
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	const dayName = days[start.getDay()];
	const month = months[start.getMonth()];
	const num = start.getDate();

	const fmtTime = (d: Date) => {
		const h = d.getHours() % 12 || 12;
		const m = d.getMinutes().toString().padStart(2, "0");
		const ampm = d.getHours() >= 12 ? "PM" : "AM";
		return `${h}:${m} ${ampm}`;
	};

	return `${dayName}, ${month} ${num} at ${fmtTime(start)} - ${fmtTime(end)}`;
};

const formatPrice = (price: number | null): string => {
	if (price === null || price === 0) return "Free";
	return `$${price.toFixed(2)}`;
};

const stripHtml = (html: string): string =>
	html
		.replace(/<[^>]*>/g, "")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\s+/g, " ")
		.trim();

const HTML_TAG_STYLES = {
	p: { marginTop: 0, marginBottom: 12 },
	a: { color: "#1A1A1A", textDecorationLine: "underline" as const },
};

const HTML_BASE_STYLE = {
	fontSize: 15,
	color: "#555",
	lineHeight: 23,
	fontFamily: "Inter_400Regular",
};

export default function EventDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const insets = useSafeAreaInsets();
	const { userAuth } = useAuthContext();
	const userId = userAuth?.id;

	const { data: event, isLoading } = useDropById(id, userId);
	const rsvpMutation = useRsvpMutation();
	const cancelMutation = useCancelRsvpMutation();
	const { width: windowWidth } = useWindowDimensions();
	const contentWidth = windowWidth - 40; // matches content paddingHorizontal: 20

	const [rsvpSheetOpen, setRsvpSheetOpen] = useState(false);
	const [showFullDescription, setShowFullDescription] = useState(false);

	const descriptionPlain = useMemo(
		() => (event?.description ? stripHtml(event.description) : ""),
		[event?.description],
	);

	const handleConfirmRsvp = useCallback(
		async (eventId: string, password?: string) => {
			if (!userId) return;
			await rsvpMutation.mutateAsync({
				dropId: eventId,
				body: { userId, password },
			});
			setRsvpSheetOpen(false);
		},
		[rsvpMutation, userId],
	);

	const handleCancelRsvp = useCallback(async () => {
		if (!event?.userRsvpId) return;
		await cancelMutation.mutateAsync({
			dropId: event.id,
			rsvpId: event.userRsvpId,
		});
	}, [event, cancelMutation]);

	const handleShare = useCallback(async () => {
		if (!event) return;
		try {
			const url =
				Platform.OS === "ios"
					? "https://apps.apple.com/co/app/chop-local/id6754047000"
					: "https://play.google.com/store/apps/details?id=com.choplocal";
			await Share.share({
				message: `Check out "${event.title}" at ${event.venueName}! ${formatFullDate(event.startDate, event.endDate)}\nDownload the app now at ${url}`,
			});
		} catch {}
	}, [event]);

	const openMaps = useCallback(() => {
		if (!event) return;
		const address = encodeURIComponent(event.address);
		const url = Platform.select({
			ios: `maps:0,0?q=${address}`,
			android: `geo:0,0?q=${address}`,
		});
		if (url) Linking.openURL(url);
	}, [event]);

	if (isLoading || !event) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color="#1A1A1A" />
			</View>
		);
	}

	const isSoldOut =
		event.capacity !== null && event.rsvpCount >= event.capacity;
	const showRsvpBtn = event.userRsvp === null && !isSoldOut;

	return (
		<View style={styles.container}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: verticalScale(120) }}
			>
				{/* ── Glass cover area ── */}
				<View style={styles.coverArea}>
					{/* Blurred background image */}
					{event.coverImage ? (
						<Image
							source={{ uri: event.coverImage }}
							style={styles.blurredBg}
							blurRadius={15}
							resizeMode="cover"
						/>
					) : null}

					{/* Dark overlay on blurred bg */}
					<View style={styles.darkOverlay} />

					{/* Gradient fade to white at the bottom */}
					<LinearGradient
						colors={[
							"transparent",
							"rgba(255,255,255,0.05)",
							"rgba(255,255,255,0.15)",
							"rgba(255,255,255,0.35)",
							"rgba(255,255,255,0.6)",
							"rgba(255,255,255,0.85)",
							"#FFFFFF",
						]}
						locations={[0, 0.3, 0.45, 0.6, 0.75, 0.88, 1]}
						style={styles.bottomFade}
					/>

					{/* Back button */}
					<TouchableOpacity
						onPress={() => router.back()}
						activeOpacity={0.7}
						style={[styles.navBtn, styles.navBtnLeft, { top: insets.top + 8 }]}
					>
						<Ionicons name="chevron-back" size={22} color="#FFFFFF" />
					</TouchableOpacity>

					{/* Share button */}
					<TouchableOpacity
						onPress={handleShare}
						activeOpacity={0.7}
						style={[styles.navBtn, styles.navBtnRight, { top: insets.top + 8 }]}
					>
						<Ionicons name="share-outline" size={20} color="#FFFFFF" />
					</TouchableOpacity>

					{/* Centered event image */}
					<View style={styles.centeredImageWrap}>
						{event.coverImage ? (
							<Image
								source={{ uri: event.coverImage }}
								style={styles.centeredImage}
								resizeMode="cover"
							/>
						) : (
							<View
								style={[
									styles.centeredImage,
									{ backgroundColor: event.accentColor },
								]}
							/>
						)}
					</View>
				</View>

				{/* ── Content ── */}
				<View style={styles.content}>
					{/* Organizer row */}
					<View style={styles.organizerRow}>
						<View style={styles.organizerLeft}>
							<View style={styles.organizerDot} />
							<Text style={styles.organizer}>{event.organizer}</Text>
						</View>
						<TouchableOpacity activeOpacity={0.7} hitSlop={10}>
							<Ionicons name="bookmark-outline" size={22} color="#CCCCCC" />
						</TouchableOpacity>
					</View>

					{/* Title */}
					<TextBold style={styles.title}>{event.title}</TextBold>

					{/* Venue */}
					<Text style={styles.venue}>{event.venueName}</Text>

					{/* Date & time */}
					<Text style={styles.datetime}>
						{formatFullDate(event.startDate, event.endDate)}
					</Text>

					{/* Description */}
					{showFullDescription ? (
						<RenderHtml
							contentWidth={contentWidth}
							source={{ html: event.description }}
							baseStyle={HTML_BASE_STYLE}
							tagsStyles={HTML_TAG_STYLES}
						/>
					) : (
						<Text style={styles.summary} numberOfLines={3}>
							{descriptionPlain}
						</Text>
					)}
					{descriptionPlain.length > 120 && !showFullDescription && (
						<TouchableOpacity
							onPress={() => setShowFullDescription(true)}
							activeOpacity={0.7}
						>
							<Text style={styles.showMore}>Show More</Text>
						</TouchableOpacity>
					)}

					{/* TODO: re-enable when backend returns attendees */}
					{/* {event.attendees.length > 0 && (
						<View style={styles.attendeesCard}>
							<View style={styles.avatarStack}>
								{event.attendees.slice(0, 4).map((att, i) => (
									<Image
										key={att.id}
										source={{ uri: att.avatar }}
										style={[
											styles.avatar,
											{ marginLeft: i > 0 ? -10 : 0 },
										]}
									/>
								))}
							</View>
							<Text style={styles.attendeeText}>
								{event.attendees[0]?.name} and{" "}
								{event.attendeeCount - 1} others going
							</Text>
							<TouchableOpacity activeOpacity={0.7}>
								<Text style={styles.viewGuestlist}>
									View guestlist
								</Text>
							</TouchableOpacity>
						</View>
					)} */}

					{/* Details section */}
					<View style={styles.detailsSection}>
						<TextBold style={styles.detailsTitle}>Details</TextBold>

						<View style={styles.detailRow}>
							<Ionicons name="pricetag-outline" size={18} color="#888" />
							<Text style={styles.detailText}>{formatPrice(event.price)}</Text>
						</View>

						<TouchableOpacity
							onPress={openMaps}
							activeOpacity={0.7}
							style={styles.detailRow}
						>
							<Ionicons name="location-outline" size={18} color="#888" />
							<View style={{ flex: 1 }}>
								<Text style={styles.detailText}>{event.venueName}</Text>
								<Text style={styles.detailSubtext}>{event.address}</Text>
							</View>
							<Ionicons name="open-outline" size={14} color="#CCC" />
						</TouchableOpacity>

						{event.capacity !== null && (
							<View style={styles.detailRow}>
								<Ionicons name="people-outline" size={18} color="#888" />
								<Text style={styles.detailText}>
									{isSoldOut
										? "Sold out"
										: `${event.rsvpCount} of ${event.capacity} spots taken`}
								</Text>
							</View>
						)}

						{event.requiresApproval && (
							<View style={styles.detailRow}>
								<Ionicons
									name="checkmark-circle-outline"
									size={18}
									color="#888"
								/>
								<Text style={styles.detailText}>
									Requires approval from organizer
								</Text>
							</View>
						)}
					</View>
				</View>
			</ScrollView>

			{/* Sticky footer — RSVP */}
			<View
				style={[
					styles.footer,
					{ paddingBottom: insets.bottom + verticalScale(12) },
				]}
			>
				{showRsvpBtn && (
					<TouchableOpacity
						activeOpacity={0.85}
						onPress={() => setRsvpSheetOpen(true)}
						style={styles.rsvpBtn}
					>
						<TextBold style={styles.rsvpBtnText}>RSVP</TextBold>
					</TouchableOpacity>
				)}

				{event.userRsvp === null && isSoldOut && (
					<View style={[styles.rsvpBtn, styles.rsvpBtnDisabled]}>
						<TextBold style={styles.rsvpBtnTextDisabled}>Sold out</TextBold>
					</View>
				)}

				{event.userRsvp === "pending" && (
					<View style={[styles.rsvpBtn, styles.rsvpBtnPending]}>
						<TextBold style={styles.rsvpBtnTextPending}>
							{"Request sent ⏳"}
						</TextBold>
					</View>
				)}

				{event.userRsvp === "confirmed" && (
					<View>
						<View style={[styles.rsvpBtn, styles.rsvpBtnConfirmed]}>
							<TextBold style={styles.rsvpBtnTextConfirmed}>
								{"✓ You're going!"}
							</TextBold>
						</View>
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={handleCancelRsvp}
							disabled={cancelMutation.isPending}
							style={styles.cancelLink}
						>
							{cancelMutation.isPending ? (
								<ActivityIndicator size="small" color="#EF4444" />
							) : (
								<Text style={styles.cancelLinkText}>Cancel RSVP</Text>
							)}
						</TouchableOpacity>
					</View>
				)}
			</View>

			{/* RSVP sheet */}
			<RsvpBottomSheet
				event={event}
				isVisible={rsvpSheetOpen}
				onClose={() => setRsvpSheetOpen(false)}
				onConfirm={handleConfirmRsvp}
			/>
		</View>
	);
}

const COVER_HEIGHT = 460;
const IMAGE_MARGIN = 20;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	centered: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FFFFFF",
	},

	/* ── Glass cover area ── */
	coverArea: {
		height: COVER_HEIGHT,
		position: "relative",
		overflow: "hidden",
	},
	blurredBg: {
		...StyleSheet.absoluteFillObject,
		width: "100%",
		height: "100%",
	},
	darkOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.03)",
	},
	bottomFade: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		height: 180,
	},
	centeredImageWrap: {
		position: "absolute",
		top: 70,
		left: IMAGE_MARGIN,
		right: IMAGE_MARGIN,
		bottom: 30,
		borderRadius: 16,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.3,
		shadowRadius: 16,
		elevation: 10,
	},
	centeredImage: {
		width: "100%",
		height: "100%",
		backgroundColor: "#F0F0F0",
	},
	navBtn: {
		position: "absolute",
		zIndex: 3,
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: "rgba(255,255,255,0.2)",
		alignItems: "center",
		justifyContent: "center",
	},
	navBtnLeft: {
		left: 16,
	},
	navBtnRight: {
		right: 16,
	},

	/* ── Content ── */
	content: {
		paddingHorizontal: 20,
		paddingTop: 16,
	},
	organizerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	organizerLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	organizerDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#b42406",
	},
	organizer: {
		fontSize: 13,
		color: "#888",
	},
	title: {
		fontSize: 26,
		color: "#1A1A1A",
		lineHeight: 32,
		marginBottom: 8,
	},
	venue: {
		fontSize: 15,
		color: "#666",
		marginBottom: 4,
	},
	datetime: {
		fontSize: 14,
		color: "#888",
		marginBottom: 16,
	},
	summary: {
		fontSize: 15,
		color: "#555",
		lineHeight: 23,
	},
	showMore: {
		fontSize: 13,
		color: "#1A1A1A",
		fontWeight: "600",
		marginTop: 4,
		paddingVertical: 4,
	},

	/* Attendees */
	attendeesCard: {
		marginTop: 24,
		paddingVertical: 16,
		alignItems: "center",
		borderRadius: 16,
		backgroundColor: "#FAFAFA",
	},
	avatarStack: {
		flexDirection: "row",
		marginBottom: 10,
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		borderWidth: 2,
		borderColor: "#FFFFFF",
	},
	attendeeText: {
		fontSize: 14,
		color: "#1A1A1A",
	},
	viewGuestlist: {
		fontSize: 13,
		color: "#888",
		marginTop: 4,
	},

	/* Details */
	detailsSection: {
		marginTop: 28,
	},
	detailsTitle: {
		fontSize: 20,
		color: "#1A1A1A",
		marginBottom: 14,
	},
	detailRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#F5F5F5",
	},
	detailText: {
		fontSize: 14,
		color: "#555",
		flex: 1,
	},
	detailSubtext: {
		fontSize: 12,
		color: "#999",
		marginTop: 2,
	},

	/* Footer */
	footer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		paddingHorizontal: 20,
		paddingTop: 12,
		backgroundColor: "#FFFFFF",
		borderTopWidth: 1,
		borderTopColor: "#F5F5F5",
	},
	rsvpBtn: {
		height: 52,
		borderRadius: 14,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#1A1A1A",
	},
	rsvpBtnText: {
		color: "#FFFFFF",
		fontSize: 16,
		letterSpacing: 1,
	},
	rsvpBtnDisabled: {
		backgroundColor: "#E0E0E0",
	},
	rsvpBtnTextDisabled: {
		color: "#999",
		fontSize: 16,
	},
	rsvpBtnPending: {
		backgroundColor: "#FEF3C7",
	},
	rsvpBtnTextPending: {
		color: "#92400E",
		fontSize: 16,
	},
	rsvpBtnConfirmed: {
		backgroundColor: "#D1FAE5",
	},
	rsvpBtnTextConfirmed: {
		color: "#065F46",
		fontSize: 16,
	},
	cancelLink: {
		alignItems: "center",
		paddingVertical: 10,
	},
	cancelLinkText: {
		fontSize: 13,
		color: "#EF4444",
	},
});
