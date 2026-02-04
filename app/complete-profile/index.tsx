import { Birthdate, Container, Text, TextBold } from "@/components";
import { useUserContext } from "@/contexts/UserContext";
import { useUpdateUser } from "@/lib/api/queries/userQueries";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
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
import { z } from "zod";

const schema = z.object({
	firstName: z.string({ error: "Name cannot be empty" }),
	lastName: z.string({ error: "Last name cannot be empty" }),
	email: z.email({ error: "Invalid email address" }),
	// birthDate: z.date({ error: "Birthdate cannot be empty" }),
	birthDate: z.string({ error: "Birthdate cannot be empty" }),
});

const INPUT_CLASS = "justify-center items-center text-black border-[#1A1C20]";

export default function CompleteProfile() {
	const router = useRouter();
	const updateUser = useUpdateUser();
	const { user, refetch, setProfileComplete } = useUserContext();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: zodResolver(schema) });

	const onSubmit = async (data: any) => {
		await updateUser.mutateAsync({ id: user.id as string, data });
		setProfileComplete(true);
		await refetch();
		router.replace("/(tabs)");
	};

	return (
		<Container useGradient={false}>
			<KeyboardAvoidingView
				behavior={Platform.OS == "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<ScrollView style={{ paddingTop: verticalScale(40) }}>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View
							className="flex h-full bg-background"
							style={{ paddingHorizontal: horizontalScale(15) }}
						>
							<TextBold
								className=""
								style={{
									color: "#1A1C20",
									fontSize: moderateScale(35),
									marginBottom: verticalScale(12),
									marginHorizontal: horizontalScale(5),
								}}
							>
								WELCOME TO{"\n"}CHOP LOCAL
							</TextBold>
							<Text
								className=""
								style={{
									color: "#000000",
									fontSize: moderateScale(13),
									marginBottom: verticalScale(120),
								}}
							>
								Just a few last steps before everything is set up
							</Text>
							<View style={{ marginHorizontal: horizontalScale(10) }}>
								<Text
									className="text-black"
									style={{
										fontSize: moderateScale(13),
										marginLeft: horizontalScale(20),
									}}
								>
									Name
								</Text>
								<Controller
									control={control}
									rules={{ required: "Name cannot be empty" }}
									name="firstName"
									render={({ field: { onChange, onBlur, value } }) => (
										<TextInput
											className={INPUT_CLASS}
											placeholderTextColor={"rgba(0, 0, 0, 0.3)"}
											onBlur={onBlur}
											onChangeText={onChange}
											value={value}
											style={[
												style.inputStyle,
												errors.firstName && style.inputError,
											]}
										/>
									)}
								/>
								{errors.firstName && (
									<Text
										className="text-red-600"
										style={{
											fontSize: moderateScale(11),
											marginLeft: horizontalScale(20),
											marginTop: verticalScale(2),
										}}
									>
										{errors.firstName.message}
									</Text>
								)}
								<Text
									className="text-black"
									style={{
										fontSize: moderateScale(13),
										marginLeft: horizontalScale(20),
										marginTop: verticalScale(15),
									}}
								>
									Last name
								</Text>
								<Controller
									control={control}
									rules={{ required: "Last name cannot be empty" }}
									name="lastName"
									render={({ field: { onChange, onBlur, value } }) => (
										<TextInput
											className={INPUT_CLASS}
											placeholderTextColor={"rgba(0, 0, 0, 0.3)"}
											onBlur={onBlur}
											onChangeText={onChange}
											value={value}
											style={[
												style.inputStyle,
												errors.lastName && style.inputError,
											]}
										/>
									)}
								/>
								{errors.lastName && (
									<Text
										className="text-red-600"
										style={{
											fontSize: moderateScale(11),
											marginLeft: horizontalScale(20),
											marginTop: verticalScale(2),
										}}
									>
										{errors.lastName.message}
									</Text>
								)}
								<Text
									className="text-black"
									style={{
										fontSize: moderateScale(13),
										marginLeft: horizontalScale(20),
										marginTop: verticalScale(15),
									}}
								>
									Email
								</Text>
								<Controller
									control={control}
									rules={{ required: "Not a valid email" }}
									name="email"
									render={({ field: { onChange, onBlur, value } }) => (
										<TextInput
											className={INPUT_CLASS}
											placeholderTextColor={"rgba(0, 0, 0, 0.3)"}
											onBlur={onBlur}
											onChangeText={onChange}
											value={value}
											style={[
												style.inputStyle,
												errors.email && style.inputError,
											]}
										/>
									)}
								/>
								{errors.email && (
									<Text
										className="text-red-600"
										style={{
											fontSize: moderateScale(11),
											marginLeft: horizontalScale(20),
											marginTop: verticalScale(2),
										}}
									>
										{errors.email.message}
									</Text>
								)}
								<Text
									className="text-black"
									style={{
										fontSize: moderateScale(13),
										marginLeft: horizontalScale(20),
										marginTop: verticalScale(15),
									}}
								>
									Birthdate
								</Text>
								<Controller
									control={control}
									rules={{ required: "Date cannot be empty" }}
									name="birthDate"
									render={({ field: { onChange, onBlur, value } }) => (
										<Birthdate onChange={onChange} value={value} />
									)}
								/>
								{errors.birthDate && (
									<Text
										className="text-red-600"
										style={{
											fontSize: moderateScale(11),
											marginLeft: horizontalScale(20),
											marginTop: verticalScale(2),
										}}
									>
										{errors.birthDate.message}
									</Text>
								)}
								<TouchableOpacity
									className="bg-[#E3C6FB] w-1/2 self-center items-center justify-center"
									activeOpacity={0.8}
									onPress={handleSubmit(onSubmit)}
									style={{
										marginTop: verticalScale(80),
										height: verticalScale(54),
										borderRadius: moderateScale(30),
									}}
								>
									<Text
										className=""
										style={{ color: "#000000", fontSize: moderateScale(14) }}
									>
										Done
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</ScrollView>
			</KeyboardAvoidingView>
		</Container>
	);
}

const style = StyleSheet.create({
	inputError: {
		borderWidth: 1,
		borderColor: "red",
	},
	inputStyle: {
		height: verticalScale(40),
		borderRadius: moderateScale(27),
		borderWidth: moderateScale(0.5),
		paddingHorizontal: horizontalScale(20),
		fontSize: moderateScale(13),
	},
});
