import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { IEvent } from "@/lib/types/event";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
	ActivityIndicator,
	Image,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import Modal from "react-native-modal";
import { CustomText as Text, CustomTextBold as TextBold } from "../Texts";

type Props = {
	event: IEvent | null;
	isVisible: boolean;
	onClose: () => void;
	onConfirm: (eventId: string) => Promise<void>;
};

const formatFullDate = (dateStr: string): string => {
	const date = new Date(dateStr);
	const days = [
		"Domingo",
		"Lunes",
		"Martes",
		"Miercoles",
		"Jueves",
		"Viernes",
		"Sabado",
	];
	const months = [
		"Enero",
		"Febrero",
		"Marzo",
		"Abril",
		"Mayo",
		"Junio",
		"Julio",
		"Agosto",
		"Septiembre",
		"Octubre",
		"Noviembre",
		"Diciembre",
	];
	const dayName = days[date.getDay()];
	const num = date.getDate();
	const month = months[date.getMonth()];
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? "PM" : "AM";
	const h = hours % 12 || 12;
	const m = minutes > 0 ? `:${minutes.toString().padStart(2, "0")}` : ":00";
	return `${dayName} ${num} de ${month}, ${year} · ${h}${m} ${ampm}`;
};

export default function RsvpBottomSheet({
	event,
	isVisible,
	onClose,
	onConfirm,
}: Props) {
	const [loading, setLoading] = useState(false);

	const handleConfirm = useCallback(async () => {
		if (!event) return;
		setLoading(true);
		try {
			await onConfirm(event.id);
		} finally {
			setLoading(false);
		}
	}, [event, onConfirm]);

	if (!event) return null;

	const spotsLeft =
		event.capacity !== null ? event.capacity - event.rsvpCount : null;

	return (
		<Modal
			isVisible={isVisible}
			onBackdropPress={onClose}
			onSwipeComplete={onClose}
			swipeDirection="down"
			backdropOpacity={0.4}
			style={styles.modal}
			propagateSwipe
		>
			<View style={styles.sheet}>
				{/* Handle */}
				<View style={styles.handle} />

				{/* Event banner */}
				{event.coverImage ? (
					<Image
						source={{ uri: event.coverImage }}
						style={styles.banner}
						resizeMode="cover"
					/>
				) : (
					<View
						style={[
							styles.banner,
							{ backgroundColor: event.accentColor },
						]}
					/>
				)}

				{/* Event info */}
				<View style={styles.infoSection}>
					<TextBold style={styles.title}>{event.title}</TextBold>

					<View style={styles.infoRow}>
						<Ionicons
							name="restaurant-outline"
							size={moderateScale(16)}
							color="#888"
						/>
						<Text style={styles.infoText}>
							{event.restaurant.name}
						</Text>
					</View>

					<View style={styles.infoRow}>
						<Ionicons
							name="calendar-outline"
							size={moderateScale(16)}
							color="#888"
						/>
						<Text style={styles.infoText}>
							{formatFullDate(event.startDate)}
						</Text>
					</View>

					<View style={styles.infoRow}>
						<Ionicons
							name="location-outline"
							size={moderateScale(16)}
							color="#888"
						/>
						<Text style={styles.infoText}>{event.address}</Text>
					</View>

					{/* Approval warning */}
					{event.requiresApproval && (
						<View style={styles.warningBox}>
							<Text style={styles.warningText}>
								{
									"⚠️ Este evento requiere aprobacion del organizador. Te notificaremos cuando tu lugar sea confirmado."
								}
							</Text>
						</View>
					)}

					{/* Capacity */}
					{spotsLeft !== null && (
						<View style={styles.capacityRow}>
							<Ionicons
								name="people-outline"
								size={moderateScale(16)}
								color="#888"
							/>
							<Text style={styles.infoText}>
								{spotsLeft > 0
									? `${spotsLeft} ${spotsLeft === 1 ? "lugar disponible" : "lugares disponibles"}`
									: "Sin lugares disponibles"}
							</Text>
						</View>
					)}
				</View>

				{/* Actions */}
				<View style={styles.actions}>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={handleConfirm}
						disabled={loading}
						style={[
							styles.confirmBtn,
							{ backgroundColor: event.accentColor },
						]}
					>
						{loading ? (
							<ActivityIndicator color="#FFFFFF" size="small" />
						) : (
							<TextBold style={styles.confirmText}>
								Confirmar reserva
							</TextBold>
						)}
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={0.7}
						onPress={onClose}
						style={styles.cancelLink}
					>
						<Text style={styles.cancelText}>Cancelar</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modal: {
		justifyContent: "flex-end",
		margin: 0,
	},
	sheet: {
		backgroundColor: "#FFFFFF",
		borderTopLeftRadius: moderateScale(24),
		borderTopRightRadius: moderateScale(24),
		paddingBottom: verticalScale(40),
	},
	handle: {
		width: horizontalScale(36),
		height: verticalScale(4),
		borderRadius: 2,
		backgroundColor: "#E0E0E0",
		alignSelf: "center",
		marginTop: verticalScale(12),
		marginBottom: verticalScale(12),
	},
	banner: {
		width: "100%",
		height: verticalScale(160),
	},
	infoSection: {
		paddingHorizontal: horizontalScale(20),
		paddingTop: verticalScale(16),
	},
	title: {
		fontSize: moderateScale(22),
		color: "#1A1A1A",
		marginBottom: verticalScale(12),
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: horizontalScale(8),
		marginBottom: verticalScale(8),
	},
	infoText: {
		fontSize: moderateScale(14),
		color: "#666",
		flex: 1,
	},
	warningBox: {
		backgroundColor: "#FEF3C7",
		borderRadius: moderateScale(12),
		padding: moderateScale(12),
		marginTop: verticalScale(8),
		marginBottom: verticalScale(4),
	},
	warningText: {
		fontSize: moderateScale(13),
		color: "#92400E",
		lineHeight: moderateScale(18),
	},
	capacityRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: horizontalScale(8),
		marginTop: verticalScale(4),
	},
	actions: {
		paddingHorizontal: horizontalScale(20),
		paddingTop: verticalScale(20),
		gap: verticalScale(10),
	},
	confirmBtn: {
		height: verticalScale(50),
		borderRadius: moderateScale(14),
		alignItems: "center",
		justifyContent: "center",
	},
	confirmText: {
		color: "#FFFFFF",
		fontSize: moderateScale(16),
	},
	cancelLink: {
		alignItems: "center",
		paddingVertical: verticalScale(8),
	},
	cancelText: {
		fontSize: moderateScale(14),
		color: "#999",
	},
});
