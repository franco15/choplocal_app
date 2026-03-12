import { IRedeemCode } from "@/lib/types/redeemCode";

// TODO: Replace with API endpoint when backend supports code redemption
// Restaurant IDs should match the IDs returned by the restaurants API
export const MOCK_REDEEM_CODES: IRedeemCode[] = [
	// Recommendation codes (rewardValue set per restaurant)
	{
		code: "REC-001",
		type: "recommendation",
		restaurantId: "1",
		restaurantName: "Tacos El Güero",
		rewardValue: 5,
	},
	{
		code: "REC-002",
		type: "recommendation",
		restaurantId: "2",
		restaurantName: "Pasillo Londres",
		rewardValue: 10,
	},
	{
		code: "REC-003",
		type: "recommendation",
		restaurantId: "3",
		restaurantName: "Sushi Heaven",
		rewardValue: 7,
	},
	{
		code: "REC-004",
		type: "recommendation",
		restaurantId: "4",
		restaurantName: "La Catarina",
		rewardValue: 15,
	},
	{
		code: "REC-005",
		type: "recommendation",
		restaurantId: "5",
		restaurantName: "Café Iguana",
		rewardValue: 5,
	},
	// Gift card codes
	{
		code: "GIFT-001",
		type: "giftcard",
		restaurantId: "1",
		restaurantName: "Tacos El Güero",
		giftCardValue: 25,
	},
	{
		code: "GIFT-002",
		type: "giftcard",
		restaurantId: "4",
		restaurantName: "La Catarina",
		giftCardValue: 50,
	},
	{
		code: "GIFT-003",
		type: "giftcard",
		restaurantId: "3",
		restaurantName: "Sushi Heaven",
		giftCardValue: 15,
	},
];
