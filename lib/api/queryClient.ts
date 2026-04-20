import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			staleTime: 30000, // 60s for cache purposes (if longer than time, will fetch again)
		},
	},
});

export const queryKeys = {
	users: {
		byId: (id: string) => ["users", id] as const,
		restaurants: ["restaurants"] as const,
	},
	restaurants: {
		all: ["restaurants"] as const,
		byId: (id: string) => ["restaurant", id] as const,
		transactions: (id: string) => ["transactions", id] as const,
	},
	giftCards: {
		byId: (giftCardId: string) => ["giftCard", giftCardId] as const,
		byUser: (userId: string) => ["giftCards", userId] as const,
	},
	notifications: {
		byUser: (userId: string) => ["notifications", userId] as const,
	},
	suggestions: {
		create: ["new suggestion"] as const,
	},
	drops: {
		all: ["drops"] as const,
		list: (userId?: string) => ["drops", "list", userId ?? null] as const,
		byId: (id: string, userId?: string) =>
			["drop", id, userId ?? null] as const,
		byRestaurant: (restaurantId: string, userId?: string) =>
			["drops", "restaurant", restaurantId, userId ?? null] as const,
	},
};
