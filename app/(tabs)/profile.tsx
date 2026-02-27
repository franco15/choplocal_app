import { Container, Text, TextBold } from "@/components";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { horizontalScale, moderateScale, verticalScale } from "@/lib/metrics";
import React, { useState } from "react";
import {
	Linking,
	Platform,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import Modal from "react-native-modal";

const Profile = () => {
	const { logout, setShowDeletedUserAlert } = useAuthContext();
	const { user, deleteUser } = useUserContext();
	const [deleteAlert, setDeleteAlert] = useState(false);
	const [disableDelete, setDisableDelete] = useState(false);

	const onLogut = async () => {
		await logout();
	};

	const onDeleteAccount = async () => {
		setDisableDelete(true);
		setDeleteAlert(false);
		await deleteUser();
		await logout();
		setShowDeletedUserAlert(true);
		setDisableDelete(false);
	};

	if (!user) return null;

	return (
		<Container>
			<View className="flex px-3 mt-5">
				<View className="flex">
					<TextBold className="text-[25px] ml-5">Hi {user.firstName}!</TextBold>
				</View>
				<View className="mt-10">
					{/* <TouchableOpacity
						activeOpacity={0.8}
						className="flex flex-row items-center py-5"
						onPress={() => {
							Sentry.captureException(new Error("test error"));
						}}
					>
						<TextBold className="ml-5">Try sentry</TextBold>
					</TouchableOpacity> */}
					<TouchableOpacity
						activeOpacity={0.8}
						className="flex flex-row items-center border-b-[0.75px]"
						onPress={() => Linking.openURL("https://choplocally.com/terms")}
					>
						<Text className="" style={styles.text}>
							Terms and conditions
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.8}
						className="flex flex-row items-center border-b-[0.75px]"
						onPress={() => Linking.openURL("https://choplocally.com/privacy")}
					>
						<Text className="" style={styles.text}>
							Privacy policy
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.8}
						className="flex flex-row items-center border-b-[0.75px]"
						onPress={() => setDeleteAlert(true)}
					>
						<Text className="" style={styles.text}>
							Delete account
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.8}
						className="flex flex-row items-center"
						onPress={onLogut}
					>
						<Text className="" style={styles.text}>
							Logout
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			{/* delete user modal */}
			<Modal
				isVisible={deleteAlert}
				onBackdropPress={() => setDeleteAlert(false)}
				animationIn="slideInUp"
				animationOut="slideOutDown"
				useNativeDriver
				hideModalContentWhileAnimating
				backdropOpacity={0}
				style={{
					margin: 0,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<View
					className={`flex bg-white h-[300px] w-[90%] rounded-[30px] justify-center`}
					style={{
						elevation: 5,
						borderWidth: 1,
						borderColor: "rgba(0, 0, 0, 0.2)",
					}}
				>
					<TextBold className="text-[30px] mb-7 text-center mx-5">
						Are you sure you want to delete your account?
					</TextBold>
					<Text className="text-[20px] mb-10 text-center mx-7">
						All information will be lost.
					</Text>
					<View className="flex-row justify-between mx-5">
						<TouchableOpacity
							className="bg-[#E3C6FB] w-auto h-auto flex items-center justify-center p-5 rounded-[30px]"
							activeOpacity={0.8}
							onPress={onDeleteAccount}
							disabled={disableDelete}
						>
							<TextBold
								className={`text-[20px] pt-[${Platform.OS === "ios" ? 10 : 0}]`}
							>
								Yes, I am sure
							</TextBold>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.8}
							className="w-auto h-auto flex items-center justify-center p-5"
							onPress={() => setDeleteAlert(false)}
						>
							<Text
								className={`text-[20px] pt-[${
									Platform.OS === "ios" ? 10 : 0
								}] underline`}
							>
								No, I am not
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</Container>
	);
};

export default Profile;

const styles = StyleSheet.create({
	text: {
		fontSize: moderateScale(20),
		marginHorizontal: horizontalScale(20),
		marginTop: verticalScale(25),
		paddingBottom: verticalScale(25),
	},
});
