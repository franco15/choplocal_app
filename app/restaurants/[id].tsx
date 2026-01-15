import { Container, Text, TextBold } from "@/components";
import { Bell, ChopLocalBlack, Share as ShareIcon } from "@/constants/svgs";
import { useUserContext } from "@/contexts/UserContext";
import { queryKeys } from "@/lib/api/queryClient";
import { useRestaurantApi } from "@/lib/api/useApi";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { shadowStyle } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams } from "expo-router";
import { Share, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import RestaurantSkeleton from "../skeletons/restaurant";

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

	if (isPending) return <RestaurantSkeleton />;

	return (
		<Container style={{ paddingTop: 0 }}>
			<View
				className=""
				style={{
					flex: 3,
					paddingHorizontal: horizontalScale(8),
					// marginTop: verticalScale(45),
				}}
			>
				<View className="flex">
					<TextBold className="" style={{ fontSize: moderateScale(35) }}>
						{restaurant?.name}
					</TextBold>
					{/* <View className="flex-row mt-3 items-center">
						<MapPin width={20} height={20} />
						<Text className="text-[13px] ml-2">
							Felicitas Zermeño 41, Centro, 83010 Hermosillo, Son.
						</Text>
					</View> */}
				</View>
				<View
					className="flex w-full bg-[#E5E382] justify-between"
					style={{
						height: verticalScale(225),
						borderRadius: moderateScale(24),
						padding: moderateScale(20),
						marginTop: verticalScale(20),
					}}
				>
					<View className="flex flex-row justify-between items-center">
						<Text className="text-[20px]">{restaurant?.checkIns} visits</Text>
						<TextBold className="text-[30px]">
							${restaurant?.balance.toFixed(2)}
						</TextBold>
					</View>
					<View className="flex items-start justify-end">
						<Text className="" style={{ fontSize: moderateScale(15) }}>
							Card ID: {user.code}
						</Text>
						<Text
							className=""
							style={{
								fontSize: moderateScale(15),
								marginBottom: verticalScale(15),
							}}
						>
							{user.firstName + " " + user.lastName}
						</Text>
						<ChopLocalBlack width={"80%"} height={verticalScale(50)} />
					</View>
				</View>
				<View
					className="flex-row justify-between"
					style={{
						marginTop: verticalScale(30),
						paddingHorizontal: horizontalScale(20),
					}}
				>
					<Link href="/qr">
						<View className="flex items-center">
							<View
								className="rounded-full flex justify-center items-center"
								style={[
									shadowStyle,
									{ height: verticalScale(60), width: horizontalScale(60) },
								]}
							>
								<QRCode value={user.code} size={moderateScale(30)} />
							</View>
							<Text
								className="text-center"
								style={{
									fontSize: moderateScale(13),
									marginTop: verticalScale(8),
								}}
							>
								{"QR\ncode"}
							</Text>
						</View>
					</Link>
					<Link
						href={{
							pathname: "/restaurants/transactions",
							params: { restaurantId: id },
						}}
					>
						<View className="flex items-center">
							<View
								className="rounded-full flex justify-center items-center"
								style={[
									shadowStyle,
									{ height: verticalScale(60), width: horizontalScale(60) },
								]}
							>
								<Bell width={horizontalScale(30)} height={verticalScale(30)} />
							</View>
							<Text
								className="text-center"
								style={{
									fontSize: moderateScale(13),
									marginTop: verticalScale(8),
								}}
							>
								{"My chop local\nactivity"}
							</Text>
						</View>
					</Link>
					<TouchableOpacity
						activeOpacity={0.8}
						className="flex items-center"
						onPress={onShare}
					>
						<View
							className="rounded-full flex justify-center items-center"
							style={[
								shadowStyle,
								{ height: verticalScale(60), width: horizontalScale(60) },
							]}
						>
							<ShareIcon
								width={horizontalScale(30)}
								height={verticalScale(30)}
							/>
						</View>
						<Text
							className="text-center"
							style={{
								fontSize: moderateScale(13),
								marginTop: verticalScale(8),
							}}
						>
							{"Share with\nfriends"}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			{/* <View
				className=""
				style={{
					flex: 2,
					marginTop: verticalScale(20),
					paddingHorizontal: horizontalScale(12),
				}}
			>
				<Text className="" style={{ fontSize: moderateScale(13) }}>
					Latest
				</Text>
				<TextBold
					className=""
					style={{
						fontSize: moderateScale(35),
						marginBottom: verticalScale(10),
					}}
				>
					News
				</TextBold>
				<FlatList
					data={news}
					initialNumToRender={4}
					// showsVerticalScrollIndicator={false}
					contentContainerStyle={{}}
					key={"_"}
					keyExtractor={(item, index) => `${index}_${item.id}`}
					renderItem={({ item, index }) => {
						return (
							<View
								key={`${index}_${item.id}`}
								className="flex w-full bg-white"
								style={{
									height: verticalScale(75),
									paddingVertical: verticalScale(12),
									paddingHorizontal: horizontalScale(20),
									borderRadius: moderateScale(16),
									marginBottom: verticalScale(10),
								}}
							>
								<View
									className="flex-row justify-between"
									style={{ marginBottom: verticalScale(3) }}
								>
									<Text style={{ fontSize: moderateScale(13) }}>
										{item.title}
									</Text>
									<Text style={{ fontSize: moderateScale(11) }}>
										{item.date}
									</Text>
								</View>
								<View>
									<Text
										style={{ fontSize: moderateScale(11) }}
										numberOfLines={2}
									>
										{item.description}
									</Text>
								</View>
							</View>
						);
					}}
				/>
			</View> */}
		</Container>
	);
}

const news = [
	{
		id: 1,
		title: "Evento hoy !!",
		description:
			"Hoy hay banda en vivo a partir de las 7 de la tarde, acompañanos ",
		date: "25-03-25",
	},
	{
		id: 2,
		title: "Evento hoy !!",
		description:
			"Hoy hay banda en vivo a partir de las 7 de la tarde, acompañanos ",
		date: "25-03-25",
	},
	{
		id: 3,
		title: "Evento hoy !!",
		description:
			"Hoy hay banda en vivo a partir de las 7 de la tarde, acompañanos ",
		date: "25-03-25",
	},
	{
		id: 4,
		title: "Evento hoy !!",
		description:
			"Hoy hay banda en vivo a partir de las 7 de la tarde, acompañanos ",
		date: "25-03-25",
	},
	{
		id: 5,
		title: "Evento hoy !!",
		description:
			"Hoy hay banda en vivo a partir de las 7 de la tarde, acompañanos ",
		date: "25-03-25",
	},
];
