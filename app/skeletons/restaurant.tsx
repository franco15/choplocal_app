import { Container } from "@/components";
import { horizontalScale, verticalScale } from "@/lib/metrics";
import { MotiView, View } from "moti";
import { Skeleton } from "moti/skeleton";

export default function RestaurantSkeleton() {
	return (
		<Container style={{ paddingTop: 0 }}>
			<MotiView
				transition={{
					type: "timing",
				}}
				style={{
					paddingHorizontal: horizontalScale(8),
					paddingTop: verticalScale(10),
					height: "90%",
				}}
			>
				<Skeleton
					colorMode="light"
					width={horizontalScale(200)}
					height={verticalScale(40)}
				/>
				<View style={{ height: verticalScale(20) }} />
				<Skeleton
					colorMode="light"
					width={"100%"}
					height={verticalScale(200)}
				/>
				<View
					className="flex-row justify-between"
					style={{
						marginTop: verticalScale(30),
						paddingHorizontal: horizontalScale(20),
					}}
				>
					<View className="flex items-center">
						<Skeleton
							colorMode="light"
							width={horizontalScale(60)}
							height={verticalScale(60)}
							radius={"round"}
						/>
						<View style={{ height: verticalScale(10) }} />
						<Skeleton
							colorMode="light"
							width={horizontalScale(35)}
							height={verticalScale(20)}
						/>
					</View>
					<View className="flex items-center">
						<Skeleton
							colorMode="light"
							width={horizontalScale(60)}
							height={verticalScale(60)}
							radius={"round"}
						/>
						<View style={{ height: verticalScale(10) }} />
						<Skeleton
							colorMode="light"
							width={horizontalScale(35)}
							height={verticalScale(20)}
						/>
					</View>
					<View className="flex items-center">
						<Skeleton
							colorMode="light"
							width={horizontalScale(60)}
							height={verticalScale(60)}
							radius={"round"}
						/>
						<View style={{ height: verticalScale(10) }} />
						<Skeleton
							colorMode="light"
							width={horizontalScale(35)}
							height={verticalScale(20)}
						/>
					</View>
				</View>
			</MotiView>
		</Container>
	);
}
