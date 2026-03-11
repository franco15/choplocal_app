import {
	Bookmark,
	BookmarkSolid,
	Forknife,
	ForknifeOff,
	Home,
	HomeOff,
	Person,
	PersonOff,
} from "@/constants/svgs";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HORIZONTAL_ICONSIZE = horizontalScale(25);
const VERTICAL_ICONSIZE = verticalScale(25);

const TabsLayout = () => {
	const insets = useSafeAreaInsets();
	return (
		<Tabs
			screenOptions={{
				lazy: false,
				tabBarShowLabel: false,
				tabBarHideOnKeyboard: true,
				tabBarLabelStyle: {
					color: "black",
				},
				headerShown: false,
				sceneStyle: { paddingBottom: 0 },
				tabBarStyle: {
					backgroundColor: "white",
					position: "absolute",
					elevation: 0,
					borderTopWidth: 0,
					borderTopLeftRadius: moderateScale(27),
					borderTopRightRadius: moderateScale(27),
					height: verticalScale(56),
					// paddingBottom: 60,
					marginBottom: insets.bottom < 35 ? 0 : insets.bottom,
				},
				tabBarIconStyle: {
					marginVertical: verticalScale(10),
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ focused }) => {
						if (focused)
							return (
								<Home
									width={HORIZONTAL_ICONSIZE}
									height={VERTICAL_ICONSIZE}
									fill="#000000"
								/>
							);
						return (
							<HomeOff
								width={HORIZONTAL_ICONSIZE}
								height={VERTICAL_ICONSIZE}
								fill="#000000"
							/>
						);
					},
				}}
			/>
			<Tabs.Screen
				name="restaurants"
				options={{
					// href: null,
					title: "Restaurants",
					tabBarIcon: ({ focused }) => {
						if (focused)
							return (
								<Forknife
									width={HORIZONTAL_ICONSIZE}
									height={VERTICAL_ICONSIZE}
									fill="#000000"
								/>
							);
						return (
							<ForknifeOff
								width={HORIZONTAL_ICONSIZE}
								height={VERTICAL_ICONSIZE}
								fill="#000000"
							/>
						);
					},
				}}
			/>
			<Tabs.Screen
				name="favorites"
				options={{
					title: "Favorites",
					tabBarIcon: ({ focused }) => {
						if (focused)
							return (
								<BookmarkSolid
									width={HORIZONTAL_ICONSIZE}
									height={VERTICAL_ICONSIZE}
									fill="#000000"
								/>
							);
						return (
							<Bookmark
								width={HORIZONTAL_ICONSIZE}
								height={VERTICAL_ICONSIZE}
								fill="#000000"
							/>
						);
					},
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ focused }) => {
						if (focused)
							return (
								<Person
									width={HORIZONTAL_ICONSIZE}
									height={VERTICAL_ICONSIZE}
								/>
							);
						return (
							<PersonOff
								width={HORIZONTAL_ICONSIZE}
								height={VERTICAL_ICONSIZE}
							/>
						);
					},
				}}
			/>
		</Tabs>
	);
};

export default TabsLayout;
