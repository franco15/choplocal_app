export enum NotificationType {
	GiftCard = 0,
}

export interface INotification {
	id: string;
	type: NotificationType;
	title: string;
	description: string;
	timestamp: string;
	read: boolean;
	data?: string;
	giftCardId?: string;
	restaurantId?: string;
}

export interface IGiftCardNotificationData {
	GiftCardId: string;
}

export interface IPushNotification {
	type: NotificationType;
	screen: string;
	params: Object;
}

export type NotificationAppRoutes = "/restaurants/[id]";

export type NotificaitonParams = {
	id: string;
	name: string;
};
