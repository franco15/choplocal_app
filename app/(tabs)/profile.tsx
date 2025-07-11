//import { User } from "@/constants/svgs";
import { useAuthContext } from "@/contexts/AuthContext";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Profile = () => {
	const { logout } = useAuthContext();

	const onLogut = async () => {
		await logout();
	};

	return (
		<View className="flex-1 justify-center items-center">
			<Text className="text-5xl">Profile</Text>
			<TouchableOpacity
				className="bg-[#B91E18] mt-10 w-1/2 h-[54px] items-center justify-center rounded-[30px]"
				activeOpacity={0.8}
				onPress={onLogut}
			>
				<Text className="text-[14px]" style={{ color: "#FFFFFF" }}>
					logout
				</Text>
			</TouchableOpacity>
			{/* <User width={50} height={50} fill="#000000" /> */}
		</View>
	);
};

export default Profile;

const styles = StyleSheet.create({});
