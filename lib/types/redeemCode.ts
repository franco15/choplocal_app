export type CodeType = "recommendation" | "giftcard";

/**
 * Stored locally for every recommendation code redemption.
 * Used for backend traceability: identifies who recommended, when, and
 * whether the recommender's reward has been triggered by the first check-in.
 * TODO: Sync to backend on next session / network availability.
 */
export interface IReferralRecord {
	id: string;                     // Client-generated UUID for dedup on backend
	code: string;                   // The recommendation code that was redeemed
	restaurantId: string;
	restaurantName: string;
	redeemedAt: string;             // ISO timestamp — when the redeemer used the code
	firstCheckInAt: string | null;  // TODO: set by backend when redeemer visits for first time
	recommenderRewardAmount: number; // Amount owed to the code owner once check-in happens
	recommenderRewardPaid: boolean;  // TODO: set by backend when reward is disbursed
	// recommenderUserId is intentionally omitted here — backend resolves it from the code
}

export interface IRedeemCode {
	code: string;
	type: CodeType;
	restaurantId: string;
	restaurantName: string;
	giftCardValue?: number;
	rewardValue?: number;
}

export type RedeemResult =
	| {
			success: true;
			type: "recommendation";
			restaurantId: string;
			restaurantName: string;
			rewardAmount: number;
	  }
	| {
			success: true;
			type: "giftcard";
			restaurantId: string;
			restaurantName: string;
			value: number;
			senderName: string;
			senderMessage: string;
	  }
	| { success: false; error: "already_visited"; restaurantName: string }
	| { success: false; error: "already_recommended"; restaurantName: string }
	| { success: false; error: "invalid_code" }
	| { success: false; error: "already_redeemed" };
