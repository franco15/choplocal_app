import {
	Home,
	HomeSolid,
	SearchIcon,
	Star,
	User,
	UserSolid,
} from "@/constants/svgs";
import { Tabs } from "expo-router";
import React from "react";

const ICONSIZE = 30;

const TabsLayout = () => {
	return (
		<Tabs
			screenOptions={{
				tabBarShowLabel: false,
				tabBarHideOnKeyboard: true,
				tabBarLabelStyle: {
					color: "black",
				},
				headerShown: false,
				// headerTransparent: true,
				tabBarStyle: {
					backgroundColor: "transparent",
					position: "absolute",
					elevation: 0,
					borderTopWidth: 0,
				},
				tabBarIconStyle: {
					marginVertical: 5,
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
								<HomeSolid width={ICONSIZE} height={ICONSIZE} fill="#000000" />
							);
						return <Home width={ICONSIZE} height={ICONSIZE} fill="#000000" />;
					},
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					href: null,
					title: "Search",
					tabBarIcon: ({ focused }) => {
						if (focused)
							return (
								<SearchIcon width={ICONSIZE} height={ICONSIZE} fill="#000000" />
							);
						return (
							<SearchIcon width={ICONSIZE} height={ICONSIZE} fill="#000000" />
						);
					},
				}}
			/>
			<Tabs.Screen
				name="favorites"
				options={{
					href: null,
					title: "Favorites",
					tabBarIcon: ({ focused }) => {
						if (focused)
							return <Star width={ICONSIZE} height={ICONSIZE} fill="#000000" />;
						return <Star width={ICONSIZE} height={ICONSIZE} fill="#000000" />;
					},
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ focused }) => {
						if (focused)
							return <UserSolid width={ICONSIZE} height={ICONSIZE} />;
						return <User width={ICONSIZE} height={ICONSIZE} />;
					},
				}}
			/>
		</Tabs>
	);
};

export default TabsLayout;
