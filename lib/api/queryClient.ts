import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			staleTime: 60000, // 60s for cache purposes (if longer than time, will fetch again)
		},
	},
});

export const queryKeys = {
	user: "user",
	users: {
		byId: (id: string) => ["users", id] as const,
	},
	restaurants: {
		all: ["restaurants"] as const,
	},
};
