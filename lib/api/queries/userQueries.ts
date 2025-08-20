import { IUser } from "@/lib/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApiService from "../axiosInstance";
import { UserEndpoints } from "../endpoints";
import { queryKeys } from "../queryClient";

export const useUpdateUser = () => {
	const api = useApiService();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: IUser }) => {
			const res: IUser = await api.put(UserEndpoints.update(id), {
				firstName: data.firstName,
				lastName: data.lastName,
				birthDate: data.birthDate,
				email: data.email,
			});
			return res;
		},
		onSuccess: async (_, { id }) => {
			await queryClient.refetchQueries({ queryKey: [queryKeys.user] });
		},
	});
};
