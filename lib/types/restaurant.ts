export enum ERestaurantStatus {
	NotVisited,
	Visited,
	Recommended,
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
}

export interface IRestaurantTransactions {
	date: Date;
	cashback: number;
}
