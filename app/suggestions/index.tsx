import { Container, Text, TextBold } from "@/components";
import { ChefTwo } from "@/constants/svgs";
import { useSuggestionContext } from "@/contexts/SuggestionsContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { z } from "zod";

const INPUT_CLASS =
	"text-black rounded-[27.5px] bg-transparent border-[0.5px] border-[#1A1C20] mt-1 px-5 text-[13px]";

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
		// craeteSuggestion(data.name);
		router.push("/suggestions/thanks");
	};

	return (
		<Container style={{ backgroundColor: "#E3C6FB" }}>
			<KeyboardAvoidingView
				behavior={Platform.OS == "ios" ? "padding" : "height"}
				style={{}}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View className="flex justify-between h-full">
						<View className="flex px-10 mt-20">
							<View className="flex mb-5">
								<TextBold className="text-[35px] text-center">
									{"We’re growing\ntogether"}
								</TextBold>
								<TextBold className="text-[13px] text-center mt-5">
									{
										"Tell us—which restaurants \nshould be part of our community?"
									}
								</TextBold>
							</View>
							<View className="flex mt-5 w-full self-center mb-10">
								<Text className="text-black text-[13px] mx-1 ml-5">
									Restaurant name
								</Text>
								<Controller
									control={control}
									rules={{ required: "Restaurant name cannot be empty" }}
									name="name"
									render={({ field: { onChange, onBlur, value } }) => (
										<TextInput
											className={INPUT_CLASS + " h-12"}
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
								<TouchableOpacity
									className="bg-white mt-12 w-1/2 h-[54px] self-center items-center justify-center rounded-[30px]"
									activeOpacity={0.8}
									onPress={handleSubmit(onSubmit)}
								>
									<Text className="text-[14px]" style={{ color: "#000000" }}>
										Send
									</Text>
								</TouchableOpacity>
							</View>
						</View>
						<View className="flex items-center top-12">
							<ChefTwo width={300} height={400} />
						</View>
					</View>
				</TouchableWithoutFeedback>
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
