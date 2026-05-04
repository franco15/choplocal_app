export enum NotificationType {
	GiftCard = 0,
	DropReminderDayBefore = 1,
	DropReminderDayOf = 2,
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

export interface IDropReminderNotificationData {
	dropId: string;
}

export interface IPushNotification {
	type: NotificationType;
	screen: string;
	params: Object;
}

export type NotificationAppRoutes = "/restaurants/[id]" | "/events/[id]";

export function isNotificationRead(n: INotification): boolean {
	return Boolean(
		n.read || (n as any).isRead || (n as any).IsRead,
	);
}

export type NotificaitonParams = {
	id: string;
	name: string;
};
