import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { useRegisterPushToken } from "../api/queries/notificationQueries";
import { registerForPushNotificationsAsync } from "../notifications";

export function useNotifications() {
	const notificationListener = useRef<Notifications.EventSubscription | null>(
		null,
	);
	const responseListener = useRef<Notifications.EventSubscription | null>(null);
	const platform = Platform.OS;

	const sendToken = useRegisterPushToken();

	async function register(userId: string) {
		const token = await registerForPushNotificationsAsync();
		if (token) await sendToken.mutateAsync({ token, userId, platform });
	}

	useEffect(() => {
		// 📩 Recibir notificación (foreground)
		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				console.log("Notificación recibida:", notification);
			});

		// 👉 Usuario toca notificación
		responseListener.current =
			Notifications.addNotificationResponseReceivedListener((response) => {
				console.log("Usuario interactuó:", response);
			});

		return () => {
			notificationListener.current?.remove();
			responseListener.current?.remove();
		};
	}, []);

	return { register };
}
