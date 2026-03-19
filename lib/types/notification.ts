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
