export enum ERestaurantStatus {
	NotVisited,
	Visited,
	Recommended,
}

export type RewardType = "FakeMoney" | "Percentage" | "FreeItem" | string;

export interface IRestaurantNextReward {
	id: string;
	title: string;
	descripcion: string | null;
	rewardType: RewardType;
	amount: number;
	percentage: number;
	unblockCount: number;
	isOneTime: boolean;
	visitsRemaining: number;
}

export interface IRestaurant {
	id: string;
	name: string;
	checkIns: number;
	balance: number;
	logo: string;
	image: string;
	status: ERestaurantStatus;
	totalCheckins: number;
	referralCode: string;
	createdAt: string;
	nextReward?: IRestaurantNextReward | null;
}

export interface IRestaurantTransactions {
	date: Date;
	cashback: number;
}
