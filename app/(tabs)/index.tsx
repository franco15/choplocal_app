import { Container, Text, TextBold } from "@/components";
import { ArrowFortyFive } from "@/constants/svgs";
import { useUserContext } from "@/contexts/UserContext";
import { Link, router } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Share, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function HomeScreen() {
	const { profileComplete, user, isUserLoading } = useUserContext();

	useEffect(() => {
		if (!profileComplete) router.replace("/complete-profile");
	}, [profileComplete]);

	const onShare = async () => {
		const result = await Share.share({
			message: "Share Chop Local app with your friends!",
		});
		if (result.action === Share.sharedAction) {
			if (result.activityType) {
				//action type
			} else {
				// shared
			}
		} else {
			// dismissed
		}
	};

	if (!user) return null;

	return (
		<Container>
			<ScrollView showsVerticalScrollIndicator={false} className="px-3 pt-5">
				<View className="flex justify-center">
					<View className="self-center absolute bottom-[90px] z-20">
						<TextBold className="text-[45px] self-center">Chop Local</TextBold>
						<Text className="text-3xl self-center">{user.code}</Text>
					</View>
					<View className="h-[130px] rounded-[26px] bg-[#9EA3BB] z-10" />
					<View className="h-[130px] rounded-[26px] bg-[#D02B2B] bottom-20" />
				</View>
				<View
					className="flex justify-center self-center items-center rounded-[26px] h-[200px] w-[220px] bottom-12"
					style={{
						borderColor: "#FFFFFF",
						backgroundColor: "#FFFFFF",
						elevation: 3,
						shadowColor: "#000000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.18,
						shadowRadius: 3.5,
					}}
				>
					<QRCode value={user.code} size={135} />
				</View>
				<View className="bottom-5">
					<Link
						href="/restaurants"
						className="rounded-[41px] px-10 py-5 items-center"
						style={{
							borderColor: "#FFFFFF",
							backgroundColor: "#FFFFFF",
							elevation: 3,
							shadowColor: "#000000",
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.18,
							shadowRadius: 3.5,
						}}
					>
						<View className="flex flex-row">
							<View className="flex-[3]">
								<TextBold className="text-[13px]">
									Restaurants i have visted
								</TextBold>
								<Text className="text-[11px]">
									Upload the ticket and validate your check in
								</Text>
							</View>
							<View className="flex-[1] rounded-full bg-black max-w-[40px] h-[40px] justify-center items-center">
								<ArrowFortyFive width={19} height={19} />
							</View>
						</View>
					</Link>
					<TouchableOpacity
						activeOpacity={0.9}
						onPress={onShare}
						className="mt-5 rounded-[41px] flex flex-row px-10 py-5 items-center"
						style={{
							borderColor: "#FFFFFF",
							backgroundColor: "#FFFFFF",
							elevation: 3,
							shadowColor: "#000000",
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.18,
							shadowRadius: 3.5,
						}}
					>
						<View className="flex-[3]">
							<TextBold className="text-[13px]">Recomend this app</TextBold>
							<Text className="text-[11px]">
								Tell your friends why you love this restaurant and get benefits
							</Text>
						</View>
						<View className="rounded-full bg-black max-w-[40px] h-[40px] justify-center items-center flex-[1]">
							<ArrowFortyFive width={19} height={19} />
						</View>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</Container>
	);
}
