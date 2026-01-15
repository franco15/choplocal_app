import { Container } from "@/components";
import { horizontalScale, verticalScale } from "@/lib/metrics";
import { MotiView, View } from "moti";
import { Skeleton } from "moti/skeleton";

export default function TransactionsSkeleton() {
	return (
		<Container style={{ paddingTop: 0 }}>
			<MotiView
				transition={{
					type: "timing",
				}}
				style={{
					paddingHorizontal: horizontalScale(15),
					paddingTop: verticalScale(45),
				}}
			>
				<View className="flex items-center">
					<Skeleton
						colorMode="light"
						width={horizontalScale(150)}
						height={verticalScale(40)}
					/>
					<View style={{ height: verticalScale(10) }} />
					<Skeleton
						colorMode="light"
						width={horizontalScale(200)}
						height={verticalScale(40)}
					/>
				</View>
				<View className="flex-row justify-between mt-10">
					<Skeleton
						colorMode="light"
						width={horizontalScale(100)}
						height={verticalScale(30)}
					/>
					<Skeleton
						colorMode="light"
						width={horizontalScale(100)}
						height={verticalScale(30)}
					/>
				</View>
				<View className="flex-row justify-between mt-5">
					<Skeleton
						colorMode="light"
						width={horizontalScale(150)}
						height={verticalScale(30)}
					/>
					<View style={{ height: verticalScale(15) }} />
					<Skeleton
						colorMode="light"
						width={horizontalScale(50)}
						height={verticalScale(30)}
					/>
				</View>
				<View className="flex-row justify-between mt-5">
					<Skeleton
						colorMode="light"
						width={horizontalScale(150)}
						height={verticalScale(30)}
					/>
					<View style={{ height: verticalScale(15) }} />
					<Skeleton
						colorMode="light"
						width={horizontalScale(50)}
						height={verticalScale(30)}
					/>
				</View>
				<View className="flex-row justify-between mt-5">
					<Skeleton
						colorMode="light"
						width={horizontalScale(150)}
						height={verticalScale(30)}
					/>
					<View style={{ height: verticalScale(15) }} />
					<Skeleton
						colorMode="light"
						width={horizontalScale(50)}
						height={verticalScale(30)}
					/>
				</View>
			</MotiView>
		</Container>
	);
}
