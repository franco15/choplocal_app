export type NotificationType = "gift" | "recommendation" | "system";

export interface INotification {
	id: string;
	type: NotificationType;
	title: string;
	description: string;
	timestamp: string;
	read: boolean;
	giftCardId?: string;
	restaurantId?: string;
}
