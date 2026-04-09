import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { useRegisterPushToken } from "../api/queries/notificationQueries";
import { registerForPushNotificationsAsync } from "../notifications";
import { NotificationAppRoutes } from "../types/notification";

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
				const data = response.notification.request.content.data;
				const parsedParams = JSON.parse(data.params as string);
				router.push({
					pathname: data.screen as NotificationAppRoutes,
					params: parsedParams,
				});
				console.log("Usuario interactuó:", response);
			});

		const handleInitialNotification = async () => {
			const response = await Notifications.getLastNotificationResponseAsync();
			if (!response) return;
			const data = response.notification.request.content.data;
			const parsedParams = JSON.parse(data.params as string);
			setTimeout(() => {
				router.push({
					pathname: data.screen as NotificationAppRoutes,
					params: parsedParams,
				});
			}, 500);
			Notifications.clearLastNotificationResponseAsync();
		};

		handleInitialNotification();

		return () => {
			notificationListener.current?.remove();
			responseListener.current?.remove();
		};
	}, []);

	return { register };
}
