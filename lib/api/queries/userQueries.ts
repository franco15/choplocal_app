import { IUserPutVM } from "@/lib/types/user";
import { convertStringToDate } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryClient";
import { useUserApi } from "../useApi";

export const useUpdateUser = () => {
	const userApi = useUserApi();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: IUserPutVM }) => {
			const bd = convertStringToDate(data.birthDate);
			const res = await userApi.update(id, {
				firstName: data.firstName,
				lastName: data.lastName,
				birthDate: bd,
				email: data.email,
			});
			return res;
		},
		onSuccess: async (_, { id }) => {
			await queryClient.refetchQueries({
				queryKey: [queryKeys.users.byId(id)],
			});
		},
	});
};
