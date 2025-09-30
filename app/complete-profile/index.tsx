import { Container, Text, TextBold } from "@/components";
import { useUserContext } from "@/contexts/UserContext";
import { useUpdateUser } from "@/lib/api/queries/userQueries";
import { isNullOrWhitespace } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
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

interface IForm {
	firstName: string;
	lastName: string;
	email: string;
	birthDate: Date;
}

const schema = z.object({
	firstName: z.string({ error: "Name cannot be empty" }),
	lastName: z.string({ error: "Last name cannot be empty" }),
	email: z.email({ error: "Invalid email address" }),
	birthDate: z.date({ error: "Birthdate cannot be empty" }),
});

const INPUT_CLASS =
	"h-12 justify-center items-center text-black rounded-[27.5px] border-[0.5px] border-[#1A1C20] mt-1 px-5 text-[13px]";

export default function CompleteProfile() {
	const router = useRouter();
	const updateUser = useUpdateUser();
	const { user, refetch, setProfileComplete } = useUserContext();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: zodResolver(schema) });
	const [showDateSelector, setShowDateSelector] = useState(false);

	const onSubmit = async (data: any) => {
		await updateUser.mutateAsync({ id: user.id as string, data });
		setProfileComplete(true);
		await refetch();
		router.replace("/");
	};

	return (
		<Container useGradient={false}>
			<KeyboardAvoidingView
				behavior={Platform.OS == "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<ScrollView style={{ paddingTop: 20 }}>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View className="flex h-full px-6 bg-background">
							<TextBold
								className="text-[35px] mb-3 mx-1"
								style={{ color: "#1A1C20" }}
							>
								WELCOME TO{"\n"}CHOP LOCAL
							</TextBold>
							<Text className="text-[13px] mb-24" style={{ color: "#000000" }}>
								Just a few last steps before everything is set up
							</Text>
							<Text className="text-black text-[13px] ml-5">Name</Text>
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
										style={[errors.firstName && style.inputError]}
									/>
								)}
							/>
							{errors.firstName && (
								<Text className="text-red-600">{errors.firstName.message}</Text>
							)}
							<Text className="text-black text-[13px] mt-5 ml-5">
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
										style={[errors.lastName && style.inputError]}
									/>
								)}
							/>
							{errors.lastName && (
								<Text className="text-red-600">{errors.lastName.message}</Text>
							)}
							<Text className="text-black text-[13px] ml-5 mt-5">Email</Text>
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
										style={[errors.email && style.inputError]}
									/>
								)}
							/>
							{errors.email && (
								<Text className="text-red-600">{errors.email.message}</Text>
							)}
							<Text className="text-black text-[13px] ml-5 mt-5">
								Birthdate
							</Text>
							<TouchableOpacity
								className="h-12 justify-center rounded-[27.5px] border-[0.5px] border-[#1A1C20] mt-1 px-5 text-[13px]"
								activeOpacity={0.8}
								onPress={() => setShowDateSelector(true)}
								style={[errors.birthDate && style.inputError]}
							>
								<Text
									className="text-[13px]"
									style={{
										color: isNullOrWhitespace(
											control._formValues.birthDate?.toLocaleDateString()
										)
											? "text-[rgba(0, 0, 0, 0.3)]"
											: "",
									}}
								>
									{isNullOrWhitespace(
										control._formValues.birthDate?.toLocaleDateString()
									)
										? "MM/DD/YYYY"
										: control._formValues.birthDate.toLocaleDateString()}
								</Text>
							</TouchableOpacity>
							{errors.birthDate && (
								<Text className="text-red-600">{errors.birthDate.message}</Text>
							)}
							{showDateSelector && (
								<Controller
									control={control}
									rules={{ required: "Date cannot be empty" }}
									name="birthDate"
									render={({ field: { onChange, onBlur, value } }) => (
										<DateTimePicker
											testID="dateTimePicker"
											value={value ?? new Date()}
											mode={"date"}
											onChange={(event, date) => {
												onChange(date);
												setShowDateSelector(false);
											}}
											style={[errors.birthDate && style.inputError]}
											maximumDate={new Date()}
											minimumDate={new Date(1940, 0, 1)}
										/>
									)}
								/>
							)}
							<TouchableOpacity
								className="bg-[#E3C6FB] mt-20 w-1/2 h-[54px] self-center items-center justify-center rounded-[30px]"
								activeOpacity={0.8}
								onPress={handleSubmit(onSubmit)}
							>
								<Text className="text-[14px]" style={{ color: "#000000" }}>
									Done
								</Text>
							</TouchableOpacity>
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
});
