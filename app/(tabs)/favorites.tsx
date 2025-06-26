import { Bell, Stamp, TriangleLeft, TriangleRight } from "@/constants/svgs";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Favorites = () => {
	return (
		<View className="flex-1 justify-center items-center">
			<Text className="text-5xl">Favorites</Text>
			<Bell width={50} height={50} fill="#000000" />
			<TriangleLeft width={50} height={50} />
			<TriangleRight width={50} height={50} />
			<Stamp width={50} height={50} />
		</View>
	);
};

export default Favorites;

const styles = StyleSheet.create({});
