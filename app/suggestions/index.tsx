import { Container, Text, TextBold } from "@/components";
import { useSuggestionContext } from "@/contexts/SuggestionsContext";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
	Keyboard,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { z } from "zod";

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
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View
					className="flex-1 justify-center"
					style={{
						paddingHorizontal: horizontalScale(40),
						marginBottom: verticalScale(60),
					}}
				>
					<View className="flex" style={{ marginBottom: verticalScale(15) }}>
						<TextBold
							className="text-center"
							style={{ fontSize: moderateScale(35) }}
						>
							{"We’re growing\ntogether"}
						</TextBold>
						<TextBold
							className="text-center"
							style={{
								fontSize: moderateScale(13),
								marginTop: verticalScale(15),
							}}
						>
							{"Tell us—which restaurants \nshould be part of our community?"}
						</TextBold>
					</View>
					<View
						className="flex w-full self-center"
						style={{
							marginTop: verticalScale(20),
							marginBottom: verticalScale(10),
						}}
					>
						<Text
							className="text-black"
							style={{
								fontSize: moderateScale(13),
								marginHorizontal: horizontalScale(4),
								marginLeft: horizontalScale(15),
							}}
						>
							Restaurant name
						</Text>
						<Controller
							control={control}
							rules={{ required: "Restaurant name cannot be empty" }}
							name="name"
							render={({ field: { onChange, onBlur, value } }) => (
								<TextInput
									className={"text-black bg-transparent border-[#1A1C20]"}
									onBlur={onBlur}
									onChangeText={onChange}
									value={value}
									style={[
										{
											height: verticalScale(40),
											borderRadius: moderateScale(27.5),
											borderWidth: moderateScale(0.5),
											marginTop: verticalScale(4),
											paddingHorizontal: horizontalScale(20),
											fontSize: moderateScale(13),
										},
										errors.name && style.inputError,
									]}
								/>
							)}
						/>
						{errors.name && (
							<Text
								className="text-red-600"
								style={{
									fontSize: moderateScale(13),
									marginLeft: horizontalScale(15),
								}}
							>
								{errors.name.message}
							</Text>
						)}
						<TouchableOpacity
							className="bg-white w-1/2 self-center items-center justify-center"
							activeOpacity={0.8}
							style={{
								marginTop: verticalScale(40),
								height: verticalScale(54),
								borderRadius: moderateScale(30),
							}}
							onPress={handleSubmit(onSubmit)}
						>
							<Text
								className=""
								style={{ color: "#000000", fontSize: moderateScale(14) }}
							>
								Send
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</Container>
	);
}

const style = StyleSheet.create({
	inputError: {
		borderWidth: 1,
		borderColor: "red",
	},
});
