import {
	Forknife,
	ForknifeOff,
	Home,
	HomeOff,
	Person,
	PersonOff,
	Star,
} from "@/constants/svgs";
import { Tabs } from "expo-router";
import React from "react";

const ICONSIZE = 25;

const TabsLayout = () => {
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
					borderTopLeftRadius: 27,
					borderTopRightRadius: 27,
					height: 80,
				},
				tabBarIconStyle: {
					marginVertical: 10,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ focused }) => {
						if (focused)
							return <Home width={ICONSIZE} height={ICONSIZE} fill="#000000" />;
						return (
							<HomeOff width={ICONSIZE} height={ICONSIZE} fill="#000000" />
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
								<Forknife width={ICONSIZE} height={ICONSIZE} fill="#000000" />
							);
						return (
							<ForknifeOff width={ICONSIZE} height={ICONSIZE} fill="#000000" />
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
						if (focused) return <Person width={ICONSIZE} height={ICONSIZE} />;
						return <PersonOff width={ICONSIZE} height={ICONSIZE} />;
					},
				}}
			/>
		</Tabs>
	);
};

export default TabsLayout;
