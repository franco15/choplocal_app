import { Container } from "@/components";
import { horizontalScale, verticalScale } from "@/lib/metrics";
import { MotiView, View } from "moti";
import { Skeleton } from "moti/skeleton";

export default function RestaurantsSkeleton() {
	return (
		<Container style={{ backgroundColor: "#E3C6FB" }}>
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
					width={horizontalScale(100)}
					height={verticalScale(20)}
				/>
				<View style={{ height: verticalScale(20) }} />
				<Skeleton
					colorMode="light"
					width={horizontalScale(250)}
					height={verticalScale(30)}
				/>
				<View style={{ height: verticalScale(20) }} />
				<Skeleton colorMode="light" width={"100%"} height={verticalScale(30)} />
				<View style={{ height: verticalScale(20) }} />
				<Skeleton
					colorMode="light"
					width={"100%"}
					height={verticalScale(75)}
					radius={25}
				/>
				<View style={{ height: verticalScale(20) }} />
				<Skeleton
					colorMode="light"
					width={"100%"}
					height={verticalScale(75)}
					radius={25}
				/>
				<View style={{ height: verticalScale(20) }} />
				<Skeleton
					colorMode="light"
					width={"100%"}
					height={verticalScale(75)}
					radius={25}
				/>
				<View style={{ height: verticalScale(20) }} />
				<Skeleton
					colorMode="light"
					width={"100%"}
					height={verticalScale(75)}
					radius={25}
				/>
			</MotiView>
		</Container>
	);
}
