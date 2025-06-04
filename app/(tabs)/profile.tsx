import { User } from "@/constants/svgs";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const profile = () => {
	return (
		<View className="flex-1 justify-center items-center">
			<Text className="text-5xl">Profile</Text>
			<User width={50} height={50} fill="#000000" />
		</View>
	);
};

export default profile;

const styles = StyleSheet.create({});
