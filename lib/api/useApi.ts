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

export const useSuggestionsApi = () => {
	const api = useAxios();
	return {
		create: async (params: ISuggestion): Promise<void> =>
			api.post(`api/app/business-recommendations`, params),
	};
};
