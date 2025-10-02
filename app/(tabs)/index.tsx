import { Container, Text, TextBold } from "@/components";
import { ArrowFortyFive, Bell, ChopLocal, Forknife } from "@/constants/svgs";
import { useUserContext } from "@/contexts/UserContext";
import { Link, router } from "expo-router";
import { useEffect } from "react";
import { Share, StyleSheet, View } from "react-native";
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
			<View className="px-3 pt-5 h-[90%]">
				<View className="flex">
					<View className="flex-row justify-between">
						<TextBold className="text-[25px] ml-5">
							Hi {user.firstName}!
						</TextBold>
					</View>
					<Text className="text-[13px] mt-3 ml-5">
						Here you will find everything about chop local
					</Text>
				</View>
				<View className="flex w-full h-64 bg-[#96190F] rounded-[24px] p-5 justify-between mt-10">
					<View className="flex items-end"></View>
					<View className="flex items-start justify-end">
						<Text className="text-[15px] text-white">Card ID: {user.code}</Text>
						<Text className="text-[15px] text-white mb-5">
							{user.firstName + " " + user.lastName}
						</Text>
						<ChopLocal width={"80%"} height={50} />
					</View>
				</View>
				<View className="mt-10 flex-row justify-between px-5">
					<Link href="/qr">
						<View className="flex items-center">
							<View
								className="h-[64px] w-[64px] rounded-full flex justify-center items-center"
								style={[styles.shadow]}
							>
								<QRCode value={user.code} size={30} />
							</View>
							<Text className="text-[13px] text-center mt-2">{"QR\ncode"}</Text>
						</View>
					</Link>
					<Link href="/restaurants">
						<View className="flex items-center">
							<View
								className="h-[64px] w-[64px] rounded-full flex justify-center items-center"
								style={[styles.shadow]}
							>
								<Forknife width={30} height={30} />
							</View>
							<Text className="text-[13px] text-center mt-2">
								{"Restaurants\nbalances"}
							</Text>
						</View>
					</Link>
					<Link href="/restaurants/news">
						<View className="flex items-center">
							<View
								className="h-[64px] w-[64px] rounded-full flex justify-center items-center"
								style={[styles.shadow]}
							>
								<Bell width={30} height={30} />
							</View>
							<Text className="text-[13px] text-center mt-2">
								{"Restaurants\nnews"}
							</Text>
						</View>
					</Link>
				</View>

				<View className="absolute bottom-0 w-full flex self-center">
					<Link
						href="/suggestions"
						className="rounded-[41px]"
						style={[{ backgroundColor: "rgba(255,255,255, 0.5)" }]}
					>
						<View className="flex flex-row px-10 py-5 items-center">
							<View className="flex-[3]">
								<TextBold className="text-[13px]">
									Help chop local grow
								</TextBold>
								<Text className="text-[11px]">
									{
										"Tell us which restaurants you would\nlike to be part of chop local"
									}
								</Text>
							</View>
							<View className="rounded-full bg-black max-w-[40px] h-[40px] justify-center items-center flex-[1]">
								<ArrowFortyFive width={19} height={19} />
							</View>
						</View>
					</Link>
				</View>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	shadow: {
		borderColor: "#FFFFFF",
		backgroundColor: "#FFFFFF",
		elevation: 3,
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.18,
		shadowRadius: 3.5,
	},
});
