import { moderateScale, verticalScale } from "@/lib/metrics";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ICON_SIZE = moderateScale(24);

type TabIconName = "home" | "restaurant" | "bookmark" | "qr-code" | "person";

function TabIcon({
	focused,
	name,
}: {
	focused: boolean;
	name: TabIconName;
}) {
	const outlineName = `${name}-outline` as keyof typeof Ionicons.glyphMap;
	const filledName = name as keyof typeof Ionicons.glyphMap;

	return (
		<View style={{ alignItems: "center", justifyContent: "center" }}>
			<Ionicons
				name={focused ? filledName : outlineName}
				size={ICON_SIZE}
				color="#1A1A1A"
				style={{ opacity: focused ? 1 : 0.35 }}
			/>
			{focused && (
				<View
					style={{
						width: 6,
						height: 6,
						borderRadius: 3,
						backgroundColor: "#1A1A1A",
						marginTop: 6,
					}}
				/>
			)}
		</View>
	);
}

const TabsLayout = () => {
	const insets = useSafeAreaInsets();
	return (
		<Tabs
			screenOptions={{
				lazy: false,
				tabBarShowLabel: false,
				tabBarHideOnKeyboard: true,
				headerShown: false,
				sceneStyle: { paddingBottom: 0 },
				tabBarStyle: {
					backgroundColor: "white",
					position: "absolute",
					elevation: 0,
					borderTopWidth: 0,
					borderTopLeftRadius: moderateScale(27),
					borderTopRightRadius: moderateScale(27),
					height: 60 + insets.bottom,
					paddingBottom: insets.bottom,
				},
				tabBarIconStyle: {
					marginTop: verticalScale(8),
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ focused }) => (
						<TabIcon focused={focused} name="home" />
					),
				}}
			/>
			<Tabs.Screen
				name="restaurants"
				options={{
					title: "Restaurants",
					tabBarIcon: ({ focused }) => (
						<TabIcon focused={focused} name="restaurant" />
					),
				}}
			/>
			<Tabs.Screen
				name="favorites"
				options={{
					title: "Bookmarks",
					tabBarIcon: ({ focused }) => (
						<TabIcon focused={focused} name="bookmark" />
					),
				}}
			/>
			<Tabs.Screen
				name="qr"
				options={{
					title: "QR",
					tabBarIcon: ({ focused }) => (
						<TabIcon focused={focused} name="qr-code" />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ focused }) => (
						<TabIcon focused={focused} name="person" />
					),
				}}
			/>
		</Tabs>
	);
};

export default TabsLayout;
