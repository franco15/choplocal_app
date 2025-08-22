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
			code: string
		): Promise<{ jwt: string }> =>
			api.post("api/auth/login-with-code", {
				phoneNumber,
				code: code,
			}),
		registerWithCode: async (
			phoneNumber: string,
			code: string
		): Promise<{ jwt: string }> =>
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
		visitedRestaurants: async (id: string) =>
			api.get(`api/app/users/${id}/restaurants/visited`),
	};
};
