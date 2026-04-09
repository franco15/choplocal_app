import { useMutation } from "@tanstack/react-query";
import { useNotificationsApi } from "../useApi";

export const useRegisterPushToken = () => {
	const notificationsApi = useNotificationsApi();
	return useMutation({
		mutationFn: async ({
			token,
			userId,
			platform,
		}: {
			token: string;
			userId: string;
			platform: string;
		}) => {
			await notificationsApi.registerPushToken({
				token,
				userId,
				platform,
			});
		},
	});
};
