export interface IRestaurantSuggestion {
	id: string;
	restaurantName: string;
	city: string;
	reason?: string;
	submittedAt: string;
	userId: string;
}
