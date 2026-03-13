export interface IGiftCard {
	id: string;
	code: string;
	amount: number;
	isActive: boolean;
	giftCardType: number;
	restaurantId: string;
	senderId: string;
	receiverId: string;
	createdAt: string;
	updatedAt: string;
	isDeleted: boolean;
}

export enum RedeemType {
	GiftCard = 0,
	ReferralCode = 1,
}

export interface IRedeemCodeResult {
	type: RedeemType;
	restaurantName: string;
	amount: number | null;
	senderName: string;
	code: string;
}

export interface IGiftCardCreate {
	amount: number;
	restaurantId: string;
	senderId: string;
	receiverPhoneNumber: string;
	message: string;
}
