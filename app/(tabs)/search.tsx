import { SearchIcon } from "@/constants/svgs";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Search = () => {
	return (
		<View className="flex-1 justify-center items-center">
			<Text className="text-5xl">Search</Text>
			<SearchIcon width={50} height={50} fill="#000000" />
		</View>
	);
};

export default Search;

const styles = StyleSheet.create({});
