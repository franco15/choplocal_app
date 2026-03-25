import { IGiftCard, IGiftCardCreate, IGiftCardDetail, IRedeemCodeResult } from "../types/giftcard";
import { INotification } from "../types/notification";
import { IRestaurant, IRestaurantTransactions } from "../types/restaurant";
import { ISuggestion } from "../types/suggestions";
import { IUser, IUserPut } from "../types/user";
import useAxios from "./axiosInstance";

export const useAuthApi = () => {
	const api = useAxios();
	return {
		requestCode: async (phoneNumber: string) =>
			await api.post("api/auth/request-verification-code", {
				phoneNumber: phoneNumber,
			}),
		loginWithCode: async (
			phoneNumber: string,
			code: string,
		): Promise<{ jwt: string; refreshToken: string }> =>
			api.post("api/auth/login-with-code", {
				phoneNumber,
				code: code,
			}),
		registerWithCode: async (
			phoneNumber: string,
			code: string,
		): Promise<{ jwt: string; refreshToken: string }> =>
			api.post("api/auth/register-with-code", {
				phoneNumber,
				code: code,
			}),
	};
};

export const useUserApi = () => {
	const api = useAxios();
	return {
		byId: async (id: string): Promise<IUser> => api.get(`api/app/users/${id}`),
		update: async (id: string, params: IUserPut): Promise<IUser> =>
			api.put(`api/app/users/${id}`, params),
		restaurants: async (id: string): Promise<IRestaurant[]> =>
			api.get(`api/app/users/${id}/restaurants`),
		visitedRestaurants: async (id: string): Promise<IRestaurant[]> =>
			api.get(`api/app/users/${id}/restaurants/visited`),
		delete: async (id: string): Promise<void> =>
			api.delete(`api/app/users/${id}`),
		requestPhoneChangeCode: async (userId: string, newPhoneNumber: string): Promise<void> =>
			api.post(`api/app/users/${userId}/phone/request-code`, { newPhoneNumber }),
		updatePhoneNumber: async (userId: string, newPhoneNumber: string, code: string): Promise<IUser> =>
			api.put(`api/app/users/${userId}/phone`, { newPhoneNumber, code }),
	};
};

export const useRestaurantApi = () => {
	const api = useAxios();
	return {
		byId: async (id: string, userId: string): Promise<IRestaurant> =>
			api.get(`api/app/restaurant/${id}/user/${userId}`),
		transactions: async (
			id: string,
			userId: string,
		): Promise<Array<IRestaurantTransactions>> =>
			api.get(`api/app/restaurant/${id}/user/${userId}/transactions`),
	};
};

export const useGiftCardApi = () => {
	const api = useAxios();
	return {
		byId: async (giftCardId: string): Promise<IGiftCardDetail> =>
			api.get(`api/app/gift-card/${giftCardId}`),
		byUser: async (userId: string): Promise<IGiftCard[]> =>
			api.get(`api/app/gift-card/user/${userId}`),
		create: async (params: IGiftCardCreate): Promise<IGiftCard> =>
			api.post("api/app/gift-card/restaurant", params),
		redeem: async (params: { code: string; userId: string }): Promise<IRedeemCodeResult> =>
			api.post("api/app/gift-card/redeem", params),
	};
};

export const useNotificationsApi = () => {
	const api = useAxios();
	return {
		byUser: async (userId: string): Promise<INotification[]> => {
			const data = await api.get(`api/app/notifications/user/${userId}`);
			return data.map((n: any) => ({
				...n,
				read: n.read ?? n.isRead ?? false,
			}));
		},
		markAsRead: async (notificationId: string): Promise<void> =>
			api.put(`api/app/notifications/${notificationId}/read`, {}),
	};
};

export const useSuggestionsApi = () => {
	const api = useAxios();
	return {
		create: async (params: ISuggestion): Promise<void> =>
			api.post(`api/app/business-recommendations`, params),
	};
};
