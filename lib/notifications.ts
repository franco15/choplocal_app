import {
	getAPNSToken,
	getMessaging,
	getToken,
	Messaging,
} from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";

async function waitForAPNSToken(msg: Messaging, maxRetries = 10) {
	for (let i = 0; i < maxRetries; i++) {
		const apnsToken = await getAPNSToken(msg);
		if (apnsToken) return apnsToken;
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
	return null;
}

export async function registerForPushNotificationsAsync() {
	// if (!Device.isDevice) {
	// 	throw new Error("Debes usar un dispositivo físico");
	// }
	const messaging = getMessaging();
	const { status: existingStatus } = await Notifications.getPermissionsAsync();

	let finalStatus = existingStatus;

	if (existingStatus !== "granted") {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}

	if (finalStatus !== "granted") {
		// console.log("Permissions not granted");
		return;
	}

	const apnsToken = await waitForAPNSToken(messaging);

	// const token = (await Notifications.getDevicePushTokenAsync()).data;
	const token = await getToken(messaging);
	// console.log("FCM Token:", token);

	// config Android
	await Notifications.setNotificationChannelAsync("default", {
		name: "default",
		importance: Notifications.AndroidImportance.MAX,
		vibrationPattern: [0, 250, 250, 250],
		lightColor: "#FF231F7C",
	});
	return token;
}
