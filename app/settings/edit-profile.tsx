import { Text, TextBold } from "@/components";
import { useUserContext } from "@/contexts/UserContext";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Keyboard,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditProfileScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { user, updateUser } = useUserContext();

	const [firstName, setFirstName] = useState(user?.firstName ?? "");
	const [lastName, setLastName] = useState(user?.lastName ?? "");
	const [email, setEmail] = useState(user?.email ?? "");
	const [birthDate, setBirthDate] = useState(() => {
		if (!user?.birthDate) return "";
		const d = new Date(user.birthDate);
		const mm = String(d.getMonth() + 1).padStart(2, "0");
		const dd = String(d.getDate()).padStart(2, "0");
		const yyyy = d.getFullYear();
		return `${mm}/${dd}/${yyyy}`;
	});
	const [saving, setSaving] = useState(false);

	const formatBirthDate = (text: string) => {
		const digits = text.replace(/\D/g, "");
		let formatted = "";
		if (digits.length <= 2) formatted = digits;
		else if (digits.length <= 4)
			formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
		else
			formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
		setBirthDate(formatted);
	};

	const onSave = useCallback(async () => {
		if (!firstName.trim() || !lastName.trim()) {
			Alert.alert("Missing info", "Name and last name are required.");
			return;
		}

		setSaving(true);
		try {
			const parts = birthDate.split("/");
			const dateObj =
				parts.length === 3
					? new Date(`${parts[2]}-${parts[0]}-${parts[1]}T00:00:00Z`)
					: new Date();

			await updateUser({
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: email.trim(),
				birthDate: dateObj,
			});
			router.back();
		} catch {
			Alert.alert("Error", "Could not update profile. Try again.");
		} finally {
			setSaving(false);
		}
	}, [firstName, lastName, email, birthDate]);

	if (!user) return null;

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={[styles.root, {}]}>
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
				>
					<TextBold style={styles.title}>Edit Profile</TextBold>

					{/* Name */}
					<Text style={styles.label}>First name</Text>
					<TextInput
						style={styles.input}
						value={firstName}
						onChangeText={setFirstName}
						placeholder="First name"
						autoCapitalize="words"
					/>

					<Text style={styles.label}>Last name</Text>
					<TextInput
						style={styles.input}
						value={lastName}
						onChangeText={setLastName}
						placeholder="Last name"
						autoCapitalize="words"
					/>

					<Text style={styles.label}>Email</Text>
					<TextInput
						style={styles.input}
						value={email}
						onChangeText={setEmail}
						placeholder="Email"
						keyboardType="email-address"
						autoCapitalize="none"
					/>

					<Text style={styles.label}>Birthdate</Text>
					<TextInput
						style={styles.input}
						value={birthDate}
						onChangeText={formatBirthDate}
						placeholder="MM/DD/YYYY"
						keyboardType="number-pad"
						maxLength={10}
					/>

					{/* Phone — read-only, tap to change */}
					<Text style={styles.label}>Phone number</Text>
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={() => router.push("/settings/change-phone")}
						style={styles.phoneRow}
					>
						<Text style={styles.phoneText}>{user.phoneNumber}</Text>
						<View style={styles.changeBtn}>
							<Text style={styles.changeBtnText}>Change</Text>
							<Ionicons
								name="chevron-forward"
								size={moderateScale(14)}
								color="#b42406"
							/>
						</View>
					</TouchableOpacity>
				</ScrollView>

				{/* Save button — sticky at bottom */}
				<View
					style={[
						styles.footer,
						{ paddingBottom: insets.bottom + verticalScale(12) },
					]}
				>
					<TouchableOpacity
						activeOpacity={0.85}
						onPress={onSave}
						disabled={saving}
						style={[styles.saveBtn, saving && { opacity: 0.6 }]}
					>
						{saving ? (
							<ActivityIndicator color="#FFF" />
						) : (
							<TextBold style={styles.saveBtnText}>Save Changes</TextBold>
						)}
					</TouchableOpacity>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	scrollContent: {
		paddingHorizontal: horizontalScale(20),
		paddingBottom: verticalScale(120),
	},
	title: {
		fontSize: moderateScale(28),
		color: "#1A1A1A",
		marginBottom: verticalScale(28),
	},
	label: {
		fontSize: moderateScale(13),
		color: "#999",
		marginBottom: verticalScale(6),
		marginLeft: horizontalScale(4),
	},
	input: {
		backgroundColor: "#F5F5F5",
		borderRadius: moderateScale(14),
		paddingHorizontal: horizontalScale(16),
		paddingVertical: verticalScale(14),
		fontSize: moderateScale(16),
		color: "#1A1A1A",
		marginBottom: verticalScale(18),
		fontFamily: "Inter",
	},
	phoneRow: {
		backgroundColor: "#F5F5F5",
		borderRadius: moderateScale(14),
		paddingHorizontal: horizontalScale(16),
		paddingVertical: verticalScale(14),
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: verticalScale(18),
	},
	phoneText: {
		fontSize: moderateScale(16),
		color: "#1A1A1A",
	},
	changeBtn: {
		flexDirection: "row",
		alignItems: "center",
		gap: horizontalScale(4),
	},
	changeBtnText: {
		fontSize: moderateScale(14),
		color: "#b42406",
	},
	footer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "#FFFFFF",
		borderTopWidth: 1,
		borderTopColor: "#F0F0F0",
		paddingHorizontal: horizontalScale(20),
		paddingTop: verticalScale(12),
	},
	saveBtn: {
		backgroundColor: "#b42406",
		borderRadius: moderateScale(30),
		paddingVertical: verticalScale(16),
		alignItems: "center",
	},
	saveBtnText: {
		color: "#FFFFFF",
		fontSize: moderateScale(16),
	},
});
