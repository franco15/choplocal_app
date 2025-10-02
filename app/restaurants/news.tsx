import { Container, Text, TextBold } from "@/components";
import { images } from "@/constants/images";
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
			<ScrollView className="px-3 mt-16 flex-1">
				<View className="flex items-center">
					<TextBold className="text-[35px]">What is happening</TextBold>
				</View>
				{todayNews.length > 0 && (
					<View className="mt-5">
						<Text className="text-[13px] mb-2">Today</Text>
						{todayNews.map((item, index) => {
							return (
								<View
									className="flex flex-row h-[100px] py-5 px-2 w-full bg-[#EFEECD] rounded-[16px] mb-3"
									key={`${item.id}_${index}`}
								>
									<View className="w-[20%] items-center justify-center">
										<Image
											source={images.restaurantDefault}
											className="w-[54px] h-[54px] rounded-[9px]"
										/>
									</View>
									<View className="w-[80%] justify-center px-1">
										<Text className="text-[20px]" numberOfLines={2}>
											{item.title}
										</Text>
										<Text className="text-[11px]">{item.date}</Text>
										<Text className="text-[11px]">{item.description}</Text>
									</View>
								</View>
							);
						})}
					</View>
				)}
				{pastNews.length > 0 && (
					<View className="mt-5">
						<Text className="text-[13px] mb-2">Past news</Text>
						{pastNews.map((item, index) => {
							return (
								<View
									className="flex flex-row h-[100px] py-5 px-2 w-full bg-white rounded-[16px] mb-3 border-[#ADADAD] border-[0.5px]"
									key={`${item.id}_${index}`}
								>
									<View className="w-[20%] items-center justify-center">
										<Image
											source={images.restaurantDefault}
											className="w-[54px] h-[54px] rounded-[9px]"
										/>
									</View>
									<View className="w-[80%] justify-center px-1">
										<Text className="text-[20px]" numberOfLines={2}>
											{item.title}
										</Text>
										<Text className="text-[11px]">{item.date}</Text>
										<Text className="text-[11px]">{item.description}</Text>
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
