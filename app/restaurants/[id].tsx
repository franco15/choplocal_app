import { Container, Text, TextBold } from "@/components";
import { ArrowFortyFive, Export } from "@/constants/svgs";
import { useUserContext } from "@/contexts/UserContext";
import { queryKeys } from "@/lib/api/queryClient";
import { useRestaurantApi } from "@/lib/api/useApi";
import { shadowStyle } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams } from "expo-router";
import { Share, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function Restaurant() {
	const { id } = useLocalSearchParams();
	const { user } = useUserContext();
	const restaurantApi = useRestaurantApi();

	const { data: restaurant, isPending } = useQuery({
		queryKey: [queryKeys.restaurants.byId(id as string)],
		queryFn: async () => {
			const data = await restaurantApi.byId(id as string, user.id);
			return data;
		},
		enabled: !!id && !!user,
	});

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

	if (isPending) return null;

	return (
		<Container>
			<View className="px-2 mt-20 h-[88%]">
				<View className="justify-center">
					<TextBold className="text-[45px] text-center">
						{restaurant?.name}
					</TextBold>
				</View>
				<View className="flex w-full h-64 bg-[#96190F] rounded-[24px] p-5 justify-between mt-10">
					<View className="flex flex-row justify-between items-center">
						<Text className="text-white text-[13px]">
							{restaurant?.checkIns} visits
						</Text>
						<TextBold className="text-white text-[30px]">$400</TextBold>
					</View>
					<View className="flex items-start justify-end">
						<Text className="text-[13px] text-white">Card ID: {user.code}</Text>
						<Text className="text-[13px] text-white">
							{user.firstName + " " + user.lastName}
						</Text>
						<TextBold className="text-[45px] text-white">Chop Local</TextBold>
					</View>
				</View>
				<View className="mt-10 flex-row justify-between px-20">
					<Link href="/qr">
						<View className="flex items-center">
							<View
								className="h-[64px] w-[64px] rounded-full flex justify-center items-center"
								style={[shadowStyle]}
							>
								<QRCode value={user.code} size={30} />
							</View>
							<Text className="text-[13px] text-center mt-2">{"QR\ncode"}</Text>
						</View>
					</Link>
					<TouchableOpacity
						activeOpacity={0.8}
						className="flex items-center"
						onPress={onShare}
					>
						<View
							className="h-[64px] w-[64px] rounded-full flex justify-center items-center"
							style={[shadowStyle]}
						>
							<Export width={30} height={30} />
						</View>
						<Text className="text-[13px] text-center mt-2">
							{"Share with\nfriends"}
						</Text>
					</TouchableOpacity>
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
