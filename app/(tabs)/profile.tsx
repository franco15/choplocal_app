//import { User } from "@/constants/svgs";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Profile = () => {
	const { logout } = useAuthContext();
	const { user } = useUserContext();

	const onLogut = async () => {
		await logout();
	};

	if (!user) return null;

	return (
		<View className="flex-1 justify-center items-center">
			<Text className="text-5xl">Profile</Text>
			<Text className="text-xl">{user.id}</Text>
			<Text className="text-xl">{user.firstName + " " + user.lastName}</Text>
			<Text className="text-xl">{user.phoneNumber}</Text>
			<Text className="text-xl">{user.email}</Text>
			<TouchableOpacity
				className="bg-[#B91E18] mt-10 w-1/2 h-[54px] items-center justify-center rounded-[30px]"
				activeOpacity={0.8}
				onPress={onLogut}
			>
				<Text className="text-[14px]" style={{ color: "#FFFFFF" }}>
					logout
				</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Profile;

const styles = StyleSheet.create({});
