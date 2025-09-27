import { Container, Text, TextBold } from "@/components";
import { useSuggestionContext } from "@/contexts/SuggestionsContext";
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

const INPUT_CLASS =
	"text-black rounded-[8px] bg-transparent border border-[#1A1C20] mt-1 px-5 text-lg rounded-[27px]";

const schema = z.object({
	name: z.string({ error: "Name cannot be empty" }),
	description: z.string({ error: "Last name cannot be empty" }).optional(),
});

export default function SuggestionsScreen() {
	const router = useRouter();
	const { craeteSuggestion } = useSuggestionContext();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: zodResolver(schema) });

	const onSubmit = async (data: any) => {
		craeteSuggestion(data.name, data.description);
		router.push("/suggestions/thanks");
	};

	return (
		<Container>
			<KeyboardAvoidingView
				behavior={Platform.OS == "ios" ? "padding" : "height"}
				style={{}}
			>
				<ScrollView>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View className="flex px-3 mt-20">
							<View className="flex mb-10">
								<TextBold className="text-[35px] text-center">
									{"Help Chop Local\ngrow"}
								</TextBold>
								<Text className="text-[13px] text-center mt-5">
									{
										"Tell us which restaurants you\nwould like to be part of our community"
									}
								</Text>
							</View>
							<View className="flex mt-20 w-full self-center mb-10">
								<Text className="text-black text-lg mx-1 ml-5">
									Restaurant name
								</Text>
								<Controller
									control={control}
									rules={{ required: "Restaurant name cannot be empty" }}
									name="name"
									render={({ field: { onChange, onBlur, value } }) => (
										<TextInput
											className={INPUT_CLASS + " h-16"}
											// placeholder="Restaurant name"
											placeholderTextColor={"rgba(0, 0, 0, 0.3)"}
											onBlur={onBlur}
											onChangeText={onChange}
											value={value}
											style={[errors.name && style.inputError]}
										/>
									)}
								/>
								{errors.name && (
									<Text className="text-red-600 ml-5">
										{errors.name.message}
									</Text>
								)}
								<Text className="text-black text-lg mx-1 mt-5 ml-5">
									{"Tell us why (optional)"}
								</Text>
								<Controller
									control={control}
									name="description"
									render={({ field: { onChange, onBlur, value } }) => (
										<TextInput
											className={INPUT_CLASS + " h-[150px] py-3"}
											placeholder=""
											placeholderTextColor={"rgba(0, 0, 0, 0.3)"}
											onBlur={onBlur}
											onChangeText={onChange}
											value={value}
											style={[
												errors.description && style.inputError,
												{ textAlignVertical: "top" },
											]}
										/>
									)}
								/>
								<TouchableOpacity
									className="bg-[#E3C6FB] mt-12 w-1/2 h-[54px] self-center items-center justify-center rounded-[30px]"
									activeOpacity={0.8}
									onPress={handleSubmit(onSubmit)}
								>
									<Text className="text-[14px]" style={{ color: "#000000" }}>
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
});
