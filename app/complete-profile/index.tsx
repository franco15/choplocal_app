import { Birthdate, Text, TextBold } from "@/components";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { useUpdateUser } from "@/lib/api/queries/userQueries";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

const schema = z.object({
	firstName: z.string({ error: "Name cannot be empty" }),
	lastName: z.string({ error: "Last name cannot be empty" }),
	email: z.email({ error: "Invalid email address" }),
	birthDate: z.string({ error: "Birthdate cannot be empty" }),
});

export default function CompleteProfile() {
	const router = useRouter();
	const updateUser = useUpdateUser();
	const { user, refetch, setProfileComplete } = useUserContext();
	const { isNewUser, clearNewUser } = useAuthContext();
	const insets = useSafeAreaInsets();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: zodResolver(schema) });

	const onSubmit = async (data: any) => {
		await updateUser.mutateAsync({ id: user.id as string, data });
		setProfileComplete(true);
		await refetch();
		if (isNewUser) {
			clearNewUser();
			router.replace("/welcome-recommendation");
		} else {
			router.replace("/(tabs)");
		}
	};

	return (
		<View style={[styles.root, { paddingTop: insets.top }]}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.scrollContent}
						keyboardShouldPersistTaps="handled"
					>
						{/* ── Header ── */}
						<View style={styles.header}>
							<View style={styles.iconCircle}>
								<Ionicons
									name="person-outline"
									size={moderateScale(28)}
									color="#b42406"
								/>
							</View>
							<TextBold style={styles.title}>Almost there!</TextBold>
							<Text style={styles.subtitle}>
								Tell us a bit about yourself to get started
							</Text>
						</View>

						{/* ── Form Card ── */}
						<View style={styles.formCard}>
							{/* First Name */}
							<View style={styles.fieldGroup}>
								<Text style={styles.label}>First Name</Text>
								<Controller
									control={control}
									rules={{ required: "Name cannot be empty" }}
									name="firstName"
									render={({ field: { onChange, onBlur, value } }) => (
										<TextInput
											placeholder="John"
											placeholderTextColor="#C7C7CC"
											onBlur={onBlur}
											onChangeText={onChange}
											value={value}
											autoCapitalize="words"
											style={[
												styles.input,
												errors.firstName && styles.inputError,
											]}
										/>
									)}
								/>
								{errors.firstName && (
									<Text style={styles.errorText}>
										{errors.firstName.message}
									</Text>
								)}
							</View>

							{/* Last Name */}
							<View style={styles.fieldGroup}>
								<Text style={styles.label}>Last Name</Text>
								<Controller
									control={control}
									rules={{ required: "Last name cannot be empty" }}
									name="lastName"
									render={({ field: { onChange, onBlur, value } }) => (
										<TextInput
											placeholder="Doe"
											placeholderTextColor="#C7C7CC"
											onBlur={onBlur}
											onChangeText={onChange}
											value={value}
											autoCapitalize="words"
											style={[
												styles.input,
												errors.lastName && styles.inputError,
											]}
										/>
									)}
								/>
								{errors.lastName && (
									<Text style={styles.errorText}>
										{errors.lastName.message}
									</Text>
								)}
							</View>

							{/* Email */}
							<View style={styles.fieldGroup}>
								<Text style={styles.label}>Email</Text>
								<Controller
									control={control}
									rules={{ required: "Not a valid email" }}
									name="email"
									render={({ field: { onChange, onBlur, value } }) => (
										<TextInput
											placeholder="john@example.com"
											placeholderTextColor="#C7C7CC"
											onBlur={onBlur}
											onChangeText={onChange}
											value={value}
											keyboardType="email-address"
											autoCapitalize="none"
											style={[styles.input, errors.email && styles.inputError]}
										/>
									)}
								/>
								{errors.email && (
									<Text style={styles.errorText}>{errors.email.message}</Text>
								)}
							</View>

							{/* Birthdate */}
							<View style={styles.fieldGroup}>
								<Text style={styles.label}>Birthdate</Text>
								<Controller
									control={control}
									rules={{ required: "Date cannot be empty" }}
									name="birthDate"
									render={({ field: { onChange, value } }) => (
										<Birthdate onChange={onChange} value={value} />
									)}
								/>
								{errors.birthDate && (
									<Text style={styles.errorText}>
										{errors.birthDate.message}
									</Text>
								)}
							</View>
						</View>
					</ScrollView>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>

			{/* ── Fixed Bottom Button ── */}
			<View
				style={[
					styles.bottomBar,
					{ paddingBottom: insets.bottom + verticalScale(12) },
				]}
			>
				<TouchableOpacity
					activeOpacity={0.85}
					onPress={handleSubmit(onSubmit)}
					style={styles.submitBtn}
				>
					<TextBold style={styles.submitText}>Continue</TextBold>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: "#F2F2F7",
	},
	scrollContent: {
		paddingHorizontal: horizontalScale(20),
		paddingBottom: verticalScale(40),
	},

	/* ── Header ── */
	header: {
		alignItems: "center",
		marginTop: verticalScale(32),
		marginBottom: verticalScale(28),
	},
	iconCircle: {
		width: moderateScale(64),
		height: moderateScale(64),
		borderRadius: moderateScale(32),
		backgroundColor: "rgba(180, 36, 6, 0.08)",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: verticalScale(16),
	},
	title: {
		fontSize: moderateScale(26),
		color: "#1A1A1A",
		marginBottom: verticalScale(8),
	},
	subtitle: {
		fontSize: moderateScale(14),
		color: "#888",
		textAlign: "center",
	},

	/* ── Form Card ── */
	formCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: moderateScale(22),
		paddingVertical: verticalScale(24),
		paddingHorizontal: horizontalScale(20),
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 8,
		elevation: 3,
	},
	fieldGroup: {
		marginBottom: verticalScale(18),
	},
	label: {
		fontSize: moderateScale(12),
		color: "#888",
		marginBottom: verticalScale(6),
		marginLeft: horizontalScale(4),
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	input: {
		height: verticalScale(48),
		backgroundColor: "#F8F8F8",
		borderRadius: moderateScale(14),
		paddingHorizontal: horizontalScale(16),
		fontSize: moderateScale(15),
		color: "#1A1A1A",
		borderWidth: 1,
		borderColor: "#F0F0F0",
	},
	inputError: {
		borderColor: "#FF3B30",
		borderWidth: 1,
	},
	errorText: {
		fontSize: moderateScale(11),
		color: "#FF3B30",
		marginTop: verticalScale(4),
		marginLeft: horizontalScale(4),
	},

	/* ── Bottom Bar ── */
	bottomBar: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		paddingHorizontal: horizontalScale(20),
		paddingTop: verticalScale(12),
		backgroundColor: "#F2F2F7",
	},
	submitBtn: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#b42406",
		height: verticalScale(54),
		borderRadius: moderateScale(30),
	},
	submitText: {
		fontSize: moderateScale(16),
		color: "#FFFFFF",
	},
});
