import { Container, Text, TextBold } from "@/components";
import { ArrowFortyFive, ChopLocal, Forknife } from "@/constants/svgs";
import { useUserContext } from "@/contexts/UserContext";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { Link, router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import HomeSkeleton from "../skeletons/home";

export default function HomeScreen() {
	const { profileComplete, user, isUserLoading } = useUserContext();

	useEffect(() => {
		if (!profileComplete) router.replace("/complete-profile");
	}, [profileComplete]);

	if (!user || isUserLoading) return <HomeSkeleton />;

	return (
		<Container>
			<View
				className={`h-[90%]`}
				style={{
					paddingHorizontal: horizontalScale(8),
					paddingTop: verticalScale(10),
				}}
			>
				<View className="flex">
					<View className="flex-row justify-between">
						<TextBold
							className=""
							style={{
								fontSize: moderateScale(30),
								marginLeft: horizontalScale(15),
							}}
						>
							Hi {user.firstName}!
						</TextBold>
					</View>
					<Text
						className=""
						style={{
							fontSize: moderateScale(18),
							marginTop: verticalScale(12),
							marginLeft: horizontalScale(15),
						}}
					>
						{"Here you will find everything\nabout chop local"}
					</Text>
				</View>
				<View
					className="flex w-full bg-[#96190F] justify-between"
					style={{
						height: verticalScale(200),
						borderRadius: moderateScale(24),
						padding: moderateScale(20),
						marginTop: verticalScale(20),
					}}
				>
					<View className="flex items-end"></View>
					<View className="flex items-start justify-end">
						<Text
							className="text-white"
							style={{ fontSize: moderateScale(15) }}
						>
							Card ID: {user.code}
						</Text>
						<Text
							className="text-white"
							style={{
								fontSize: moderateScale(15),
								marginBottom: verticalScale(15),
							}}
						>
							{user.firstName + " " + user.lastName}
						</Text>
						<ChopLocal width={"80%"} height={verticalScale(50)} />
					</View>
				</View>
				<View
					className="flex-row justify-between"
					style={{
						marginTop: verticalScale(30),
						paddingHorizontal: horizontalScale(50), // 20 de padding cuando esten los tres botones
					}}
				>
					<Link href="/qr">
						<View className="flex items-center">
							<View
								className="rounded-full flex justify-center items-center"
								style={[
									styles.shadow,
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
					<Link href="/restaurants">
						<View className="flex items-center">
							<View
								className="rounded-full flex justify-center items-center"
								style={[
									styles.shadow,
									{ height: verticalScale(60), width: horizontalScale(60) },
								]}
							>
								<Forknife
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
								{"Restaurants\nbalances"}
							</Text>
						</View>
					</Link>
					{/* <Link href="/restaurants/news">
						<View className="flex items-center">
							<View
								className="rounded-full flex justify-center items-center"
								style={[
									styles.shadow,
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
								{"Restaurants\nnews"}
							</Text>
						</View>
					</Link> */}
				</View>

				<View className="absolute bottom-0 w-full flex self-center">
					<Link
						href="/suggestions"
						className=""
						style={[
							{
								backgroundColor: "rgba(255,255,255, 0.5)",
								borderRadius: moderateScale(41),
							},
						]}
					>
						<View
							className="flex flex-row items-center"
							style={{
								paddingHorizontal: horizontalScale(25),
								paddingVertical: verticalScale(15),
							}}
						>
							<View className="flex-[3]">
								<TextBold className="" style={{ fontSize: moderateScale(13) }}>
									Help chop local grow
								</TextBold>
								<Text className="" style={{ fontSize: moderateScale(13) }}>
									{
										"Tell us which restaurants you would\nlike to be part of chop local"
									}
								</Text>
							</View>
							<View
								className="rounded-full bg-black justify-center items-center flex-[1]"
								style={{
									maxWidth: horizontalScale(50),
									height: verticalScale(50),
								}}
							>
								<ArrowFortyFive
									width={horizontalScale(20)}
									height={verticalScale(20)}
								/>
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
