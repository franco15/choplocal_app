import { Text, TextBold } from "@/components";
import { useUserContext } from "@/contexts/UserContext";
import { useUpdateUser } from "@/lib/api/queries/userQueries";
import { isNullOrWhitespace } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
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
	"h-16 justify-center items-center text-black rounded-[8px] bg-[#EEEEEE] mt-1 px-3 text-lg";

export default function CompleteProfile() {
	const router = useRouter();
	const updateUser = useUpdateUser();
	const { user, refetch } = useUserContext();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: zodResolver(schema) });
	const [showDateSelector, setShowDateSelector] = useState(false);

	const onSubmit = async (data: any) => {
		const res = await updateUser.mutateAsync({ id: user.id as string, data });
		await refetch();
		if (!isNullOrWhitespace(res.id)) {
			router.replace("/");
		}
	};

	return (
		<View className="flex h-full px-4 bg-background">
			<TextBold className="text-[35px] mb-3 mx-1" style={{ color: "#1A1C20" }}>
				Almost done !
			</TextBold>
			<Text className="text-[14px] mb-10" style={{ color: "#93969E" }}>
				Fill the information below to finish you registration.
			</Text>
			<TextBold className="text-black text-lg mx-1">Name</TextBold>
			<Controller
				control={control}
				rules={{ required: "Name cannot be empty" }}
				name="firstName"
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						className={INPUT_CLASS}
						placeholder="Name"
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
			<TextBold className="text-black text-lg mx-1 mt-5">Last name</TextBold>
			<Controller
				control={control}
				rules={{ required: "Last name cannot be empty" }}
				name="lastName"
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						className={INPUT_CLASS}
						placeholder="Last name"
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
			<TextBold className="text-black text-lg mx-1 mt-5">Email</TextBold>
			<Controller
				control={control}
				rules={{ required: "Not a valid email" }}
				name="email"
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						className={INPUT_CLASS}
						placeholder="Email"
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
			<TextBold className="text-black text-lg mx-1 mt-5">Birthdate</TextBold>
			<TouchableOpacity
				className="h-16 justify-center rounded-[8px] bg-[#EEEEEE] mt-1 px-3 text-lg"
				activeOpacity={0.8}
				onPress={() => setShowDateSelector(true)}
				style={[errors.birthDate && style.inputError]}
			>
				<Text
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
				className="bg-[#B91E18] mt-40 w-1/2 h-[54px] self-center items-center justify-center rounded-[30px]"
				activeOpacity={0.8}
				onPress={handleSubmit(onSubmit)}
			>
				<Text className="text-[14px]" style={{ color: "#FFFFFF" }}>
					Done
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const style = StyleSheet.create({
	inputError: {
		borderWidth: 1,
		borderColor: "red",
	},
});
