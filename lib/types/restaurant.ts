export enum ERestaurantStatus {
	NotVisited,
	Visited,
	Recommended,
}

export interface IRestaurant {
	id: number;
	name: string;
	checkIns: number;
	status: ERestaurantStatus;
	balance: number;
	image: string;
}

export interface IRestaurantTransactions {
	date: Date;
	cashback: number;
}
