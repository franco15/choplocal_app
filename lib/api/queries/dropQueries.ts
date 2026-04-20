import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AppCreateRsvpDto } from "@/lib/types/drop";
import { mapDropToEvent } from "../mappers/dropMapper";
import { queryKeys } from "../queryClient";
import { useDropsApi } from "../useApi";

export const useDropsList = (userId?: string) => {
	const api = useDropsApi();
	return useQuery({
		queryKey: queryKeys.drops.list(userId),
		queryFn: async () => {
			const drops = await api.list(userId);
			return drops.map(mapDropToEvent);
		},
	});
};

export const useDropById = (id: string | undefined, userId?: string) => {
	const api = useDropsApi();
	return useQuery({
		queryKey: queryKeys.drops.byId(id ?? "", userId),
		queryFn: async () => mapDropToEvent(await api.byId(id!, userId)),
		enabled: !!id,
	});
};

export const useDropsByRestaurant = (
	restaurantId: string | undefined,
	userId?: string,
) => {
	const api = useDropsApi();
	return useQuery({
		queryKey: queryKeys.drops.byRestaurant(restaurantId ?? "", userId),
		queryFn: async () => {
			const drops = await api.byRestaurant(restaurantId!, userId);
			return drops.map(mapDropToEvent);
		},
		enabled: !!restaurantId,
	});
};

export const useRsvpMutation = () => {
	const api = useDropsApi();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (vars: { dropId: string; body: AppCreateRsvpDto }) =>
			api.rsvp(vars.dropId, vars.body),
		onSuccess: (_, vars) => {
			qc.invalidateQueries({ queryKey: queryKeys.drops.all });
			qc.invalidateQueries({ queryKey: ["drop", vars.dropId] });
		},
	});
};

export const useCancelRsvpMutation = () => {
	const api = useDropsApi();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (vars: { dropId: string; rsvpId: string }) =>
			api.cancelRsvp(vars.dropId, vars.rsvpId),
		onSuccess: (_, vars) => {
			qc.invalidateQueries({ queryKey: queryKeys.drops.all });
			qc.invalidateQueries({ queryKey: ["drop", vars.dropId] });
		},
	});
};
