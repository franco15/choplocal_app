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
	},
	suggestions: {
		create: ["new suggestion"] as const,
	},
};
