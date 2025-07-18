import { Text, TextBold } from "@/components";
import { useAuthContext } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";

interface IForm {
	name: string;
	lastName: string;
	email: string;
	birthDate: Date;
}

const schema = z.object({
	name: z.string({ error: "Name cannot be empty" }),
	lastName: z.string({ error: "Last name cannot be empty" }),
	email: z.email({ error: "Invalid email address" }),
});

const INPUT_CLASS =
	"h-16 justify-center items-center text-black rounded-[8px] bg-[#EEEEEE] mt-1 px-3 text-lg";

export default function UserInfoScreen() {
	const { login } = useAuthContext();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: zodResolver(schema) });

	const onSubmit = async (data: any) => {
		console.log(data);
		await login("");
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
				name="name"
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						className={INPUT_CLASS}
						placeholder="Name"
						placeholderTextColor={"rgba(0, 0, 0, 0.3)"}
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						style={[errors.name && style.inputError]}
					/>
				)}
			/>
			{errors.name && (
				<Text className="text-red-600">{errors.name.message}</Text>
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
						style={[errors.name && style.inputError]}
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
						style={[errors.name && style.inputError]}
					/>
				)}
			/>
			{errors.email && (
				<Text className="text-red-600">{errors.email.message}</Text>
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
