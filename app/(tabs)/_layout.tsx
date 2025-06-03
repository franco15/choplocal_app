import { Home, HomeSolid, User, UserSolid } from "@/constants/svgs";
import { Tabs } from "expo-router";
import React from "react";

const ICONSIZE = 30;

const TabsLayout = () => {
	return (
		<Tabs
			screenOptions={{
				// tabBarShowLabel: false,
				tabBarHideOnKeyboard: true,
				tabBarLabelStyle: {
					color: "black",
				},
				headerShown: false,
				tabBarStyle: {
					// position: "absolute",
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
