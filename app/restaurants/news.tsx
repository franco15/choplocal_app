import { Container, Text, TextBold } from "@/components";
import { images } from "@/constants/images";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { default as rawNews } from "@/lib/mock/news.json";
import { INews } from "@/lib/types/news";
import { useEffect, useState } from "react";
import { Image, ScrollView, View } from "react-native";

export default function NewsScreen() {
	const news: INews[] = rawNews as INews[];
	const [todayNews, setTodayNews] = useState<INews[]>([]);
	const [pastNews, setPastNews] = useState<INews[]>([]);
	useEffect(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const todays = news.filter((n) => {
			const date = parseDate(n.date);
			date.setHours(0, 0, 0, 0);
			return date.getTime() === today.getTime();
		});
		const past = news.filter((n) => {
			const date = parseDate(n.date);
			date.setHours(0, 0, 0, 0);
			return date.getTime() < today.getTime();
		});
		setTodayNews(todays);
		setPastNews(past);
	}, [news]);
	return (
		<Container useGradient={false}>
			<ScrollView
				className="flex-1"
				style={{
					paddingHorizontal: horizontalScale(12),
					marginTop: verticalScale(50),
				}}
			>
				<View className="flex items-center">
					<TextBold className="" style={{ fontSize: moderateScale(35) }}>
						What is happening
					</TextBold>
				</View>
				{todayNews.length > 0 && (
					<View className="" style={{ marginTop: verticalScale(20) }}>
						<Text
							className=""
							style={{
								fontSize: moderateScale(13),
								marginBottom: verticalScale(8),
							}}
						>
							Today
						</Text>
						{todayNews.map((item, index) => {
							return (
								<View
									className="flex flex-row w-full bg-[#EFEECD]"
									style={{
										height: verticalScale(85),
										paddingHorizontal: horizontalScale(8),
										borderRadius: moderateScale(16),
										marginBottom: verticalScale(12),
									}}
									key={`${item.id}_${index}`}
								>
									<View className="w-[20%] items-center justify-center">
										<Image
											source={images.restaurantDefault}
											className=""
											style={{
												width: horizontalScale(45),
												height: verticalScale(45),
												borderRadius: moderateScale(9),
											}}
										/>
									</View>
									<View
										className="w-[80%] justify-center"
										style={{ paddingHorizontal: horizontalScale(4) }}
									>
										<Text
											className=""
											style={{ fontSize: moderateScale(15) }}
											numberOfLines={2}
										>
											{item.title}
										</Text>
										<Text className="" style={{ fontSize: moderateScale(11) }}>
											{item.date}
										</Text>
										<Text className="" style={{ fontSize: moderateScale(11) }}>
											{item.description}
										</Text>
									</View>
								</View>
							);
						})}
					</View>
				)}
				{pastNews.length > 0 && (
					<View className="" style={{ marginTop: verticalScale(20) }}>
						<Text
							className=""
							style={{
								fontSize: moderateScale(13),
								marginBottom: verticalScale(8),
							}}
						>
							Past news
						</Text>
						{pastNews.map((item, index) => {
							return (
								<View
									className="flex flex-row  w-full bg-white border-[#ADADAD]"
									style={{
										height: verticalScale(85),
										paddingHorizontal: horizontalScale(8),
										borderRadius: moderateScale(16),
										marginBottom: verticalScale(12),
										borderWidth: moderateScale(0.5),
									}}
									key={`${item.id}_${index}`}
								>
									<View className="w-[20%] items-center justify-center">
										<Image
											source={images.restaurantDefault}
											className=""
											style={{
												width: horizontalScale(45),
												height: verticalScale(45),
												borderRadius: moderateScale(9),
											}}
										/>
									</View>
									<View
										className="w-[80%] justify-center"
										style={{ paddingHorizontal: horizontalScale(4) }}
									>
										<Text
											className=""
											style={{ fontSize: moderateScale(15) }}
											numberOfLines={2}
										>
											{item.title}
										</Text>
										<Text className="" style={{ fontSize: moderateScale(11) }}>
											{item.date}
										</Text>
										<Text className="" style={{ fontSize: moderateScale(11) }}>
											{item.description}
										</Text>
									</View>
								</View>
							);
						})}
					</View>
				)}
			</ScrollView>
		</Container>
	);
}

function parseDate(dateStr: string) {
	const [day, month, year] = dateStr.split("-");
	return new Date(
		parseInt(`20${year}`),
		parseInt(month, 10) - 1,
		parseInt(day, 10)
	);
}
