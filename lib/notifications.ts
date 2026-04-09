import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
	// if (!Device.isDevice) {
	// 	throw new Error("Debes usar un dispositivo físico");
	// }

	const { status: existingStatus } = await Notifications.getPermissionsAsync();

	let finalStatus = existingStatus;

	if (existingStatus !== "granted") {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}

	if (finalStatus !== "granted") {
		console.log("Permissions not granted");
		return;
	}

	// get token
	// const projectId =
	// 	Constants.expoConfig?.extra?.eas?.projectId ??
	// 	Constants.easConfig?.projectId;

	// const expoPushToken = (
	// 	await Notifications.getExpoPushTokenAsync({
	// 		projectId,
	// 	})
	// ).data;

	const token = (await Notifications.getDevicePushTokenAsync()).data;

	// config Android
	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}
	console.log(token);
	return token;
}
