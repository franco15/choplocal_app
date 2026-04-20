import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { IEvent } from "@/lib/types/event";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
	ActivityIndicator,
	Image,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Modal from "react-native-modal";
import { CustomText as Text, CustomTextBold as TextBold } from "../Texts";

type Props = {
	event: IEvent | null;
	isVisible: boolean;
	onClose: () => void;
	onConfirm: (eventId: string, password?: string) => Promise<void>;
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
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleConfirm = useCallback(async () => {
		if (!event) return;
		setLoading(true);
		setError(null);
		try {
			await onConfirm(
				event.id,
				event.passwordProtected ? password : undefined,
			);
			setPassword("");
		} catch (e) {
			setError(
				event.passwordProtected
					? "Contraseña incorrecta o error al confirmar"
					: "No se pudo confirmar la reserva",
			);
		} finally {
			setLoading(false);
		}
	}, [event, onConfirm, password]);

	const handleClose = useCallback(() => {
		setPassword("");
		setError(null);
		onClose();
	}, [onClose]);

	if (!event) return null;

	const spotsLeft =
		event.capacity !== null ? event.capacity - event.rsvpCount : null;
	const confirmDisabled =
		loading || (event.passwordProtected && password.trim().length === 0);

	return (
		<Modal
			isVisible={isVisible}
			onBackdropPress={handleClose}
			onSwipeComplete={handleClose}
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

					{/* Password input */}
					{event.passwordProtected && (
						<View style={styles.passwordSection}>
							<Text style={styles.passwordLabel}>
								Este drop requiere contraseña
							</Text>
							<TextInput
								value={password}
								onChangeText={(t) => {
									setPassword(t);
									if (error) setError(null);
								}}
								placeholder="Ingresa la contraseña"
								placeholderTextColor="#BBB"
								style={styles.passwordInput}
								secureTextEntry
								autoCapitalize="none"
								autoCorrect={false}
							/>
						</View>
					)}

					{error && <Text style={styles.errorText}>{error}</Text>}
				</View>

				{/* Actions */}
				<View style={styles.actions}>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={handleConfirm}
						disabled={confirmDisabled}
						style={[
							styles.confirmBtn,
							{
								backgroundColor: event.accentColor,
								opacity: confirmDisabled ? 0.5 : 1,
							},
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
						onPress={handleClose}
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
	passwordSection: {
		marginTop: verticalScale(16),
		gap: verticalScale(6),
	},
	passwordLabel: {
		fontSize: moderateScale(13),
		color: "#666",
	},
	passwordInput: {
		height: verticalScale(44),
		paddingHorizontal: horizontalScale(12),
		borderRadius: moderateScale(10),
		borderWidth: 1,
		borderColor: "#E0E0E0",
		backgroundColor: "#FAFAFA",
		fontSize: moderateScale(15),
		color: "#1A1A1A",
		fontFamily: "Inter_400Regular",
	},
	errorText: {
		fontSize: moderateScale(13),
		color: "#EF4444",
		marginTop: verticalScale(8),
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
