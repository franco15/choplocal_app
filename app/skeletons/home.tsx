import { Container } from "@/components";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { MotiView, View } from "moti";
import { Skeleton } from "moti/skeleton";

function CardSkeleton() {
	return (
		<View style={{ marginBottom: verticalScale(14) }}>
			<Skeleton
				colorMode="light"
				width={"100%"}
				height={verticalScale(130)}
				radius={moderateScale(16)}
			/>
		</View>
	);
}

export default function HomeSkeleton() {
	return (
		<Container>
			<MotiView
				transition={{ type: "timing" }}
				style={{
					paddingHorizontal: horizontalScale(20),
					paddingTop: verticalScale(10),
					flex: 1,
				}}
			>
				{/* Icons */}
				<View
					style={{
						flexDirection: "row",
						justifyContent: "flex-end",
						marginBottom: verticalScale(20),
					}}
				>
					<Skeleton
						colorMode="light"
						width={moderateScale(44)}
						height={moderateScale(44)}
						radius={"round"}
					/>
					<View style={{ width: horizontalScale(10) }} />
					<Skeleton
						colorMode="light"
						width={moderateScale(44)}
						height={moderateScale(44)}
						radius={"round"}
					/>
				</View>

				{/* Greeting */}
				<Skeleton
					colorMode="light"
					width={horizontalScale(200)}
					height={verticalScale(30)}
				/>
				<View style={{ height: verticalScale(6) }} />
				<Skeleton
					colorMode="light"
					width={horizontalScale(220)}
					height={verticalScale(18)}
				/>

				{/* Stats */}
				<View style={{ height: verticalScale(26) }} />
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Skeleton
						colorMode="light"
						width={horizontalScale(50)}
						height={verticalScale(44)}
					/>
					<View style={{ width: horizontalScale(16) }} />
					<Skeleton
						colorMode="light"
						width={horizontalScale(50)}
						height={verticalScale(44)}
					/>
					<View style={{ width: horizontalScale(14) }} />
					<Skeleton
						colorMode="light"
						width={horizontalScale(100)}
						height={verticalScale(30)}
					/>
				</View>

				{/* Filter tabs */}
				<View
					style={{
						flexDirection: "row",
						marginTop: verticalScale(26),
						marginBottom: verticalScale(16),
					}}
				>
					{[50, 65, 95, 45].map((w, i) => (
						<View
							key={i}
							style={{ marginRight: horizontalScale(8) }}
						>
							<Skeleton
								colorMode="light"
								width={horizontalScale(w)}
								height={verticalScale(34)}
								radius={moderateScale(20)}
							/>
						</View>
					))}
				</View>

				{/* Search */}
				<View
					style={{
						alignItems: "flex-end",
						marginBottom: verticalScale(12),
					}}
				>
					<Skeleton
						colorMode="light"
						width={moderateScale(22)}
						height={moderateScale(22)}
					/>
				</View>

				{/* Cards */}
				<CardSkeleton />
				<CardSkeleton />
				<CardSkeleton />
			</MotiView>
		</Container>
	);
}
