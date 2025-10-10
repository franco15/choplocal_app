import { Container, Text, TextBold } from "@/components";
import { FlatList, View } from "react-native";
const transactions = [
	{
		id: 1,
		date: "02-10-25",
		cashback: 2.5,
	},
	{
		id: 2,
		date: "02-10-25",
		cashback: 2.5,
	},
	{
		id: 3,
		date: "02-10-25",
		cashback: 2.5,
	},
	{
		id: 4,
		date: "02-10-25",
		cashback: 2.5,
	},
	{
		id: 5,
		date: "02-10-25",
		cashback: 2.5,
	},
	{
		id: 6,
		date: "02-10-25",
		cashback: 2.5,
	},
	{
		id: 7,
		date: "02-10-25",
		cashback: 2.5,
	},
	{
		id: 8,
		date: "02-10-25",
		cashback: 2.5,
	},
	{
		id: 9,
		date: "02-10-25",
		cashback: 2.5,
	},
	{
		id: 10,
		date: "02-10-25",
		cashback: 2.5,
	},
];

export default function Transactions() {
	return (
		<Container useGradient={false}>
			<View className="px-4 mt-20">
				<TextBold className="text-[25px] mb-5">
					{"My latest\ntransactions"}
				</TextBold>
				<FlatList
					data={transactions}
					initialNumToRender={10}
					contentContainerStyle={{ marginBottom: 50 }}
					renderItem={({ item, index }) => (
						<View
							key={index}
							className="  bg-[#DDDDDD] mb-5 p-7 rounded-[11px]"
						>
							<View className="flex flex-row items-center justify-between">
								<Text className="text-[10px]">{item.date}</Text>
								<Text className="text-[15px]">{item.cashback} VISITS</Text>
							</View>
						</View>
					)}
				/>
			</View>
		</Container>
	);
	// return (
	// );
}
