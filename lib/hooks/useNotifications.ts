import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { useRegisterPushToken } from "../api/queries/notificationQueries";
import { registerForPushNotificationsAsync } from "../notifications";
import { NotificationAppRoutes } from "../types/notification";
import messaging, { getMessaging, onMessage, onTokenRefresh } from '@react-native-firebase/messaging';

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

	useEffect(() => {
		const unsubscribe = onTokenRefresh(getMessaging(), async (newToken: string) => {
    		console.log('FCM Token refreshed:', newToken);
			// if (newToken) await sendToken.mutateAsync({ newToken, userId, platform });

  		});

		const msg = getMessaging();
		const unsubMessage = onMessage(msg, async (remoteMessage) => {
			await Notifications.scheduleNotificationAsync({
				content: {
					title: remoteMessage.notification?.title || "Notificación",
					body: remoteMessage.notification?.body || "",
					data: remoteMessage.data,
				},
				trigger: {
					type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
					seconds: 1,
					repeats: false,
				},
			});
			console.log("Mensaje recibido en foreground:", remoteMessage);
		});

	  return () => {unsubscribe(); unsubMessage();};
	}, []);

	return { register };
}
