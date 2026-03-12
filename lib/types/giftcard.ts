export enum EGiftCardStatus {
	Available = "Available",
	Used = "Used",
	Expired = "Expired",
}

export interface IGiftCard {
	id: string;
	code: string;
	restaurantId: string;
	restaurantName: string;
	value: number;
	status: EGiftCardStatus;
	senderPhone: string;
	senderName: string;
	recipientPhone: string;
	message: string;
	createdAt: string;
	expiresAt: string;
	usedAt: string | null;
}

export interface IGiftCardSend {
	restaurantId: string;
	restaurantName: string;
	value: number;
	recipientPhone: string;
	message: string;
}

export interface IPaymentInfo {
	cardNumber: string;
	expiryDate: string;
	cvv: string;
	cardholderName: string;
}
