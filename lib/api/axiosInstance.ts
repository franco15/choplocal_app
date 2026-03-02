import * as Sentry from "@sentry/react-native";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

import { API_URL, REFRESH_TOKEN_KEY, TOKEN_KEY } from "@/constants/keys";
import { isNullOrWhitespace } from "../utils";

let cachedToken: string | null = null;
let onLogout = () => {};

const loadToken = async () => {
	if (!cachedToken) cachedToken = await SecureStore.getItemAsync(TOKEN_KEY);
	return cachedToken;
};

const saveToken = async (token: string | null, refreshToken: string | null) => {
	cachedToken = token;
	if (!isNullOrWhitespace(token)) {
		await SecureStore.setItemAsync(TOKEN_KEY, token as string);
	} else {
		await SecureStore.deleteItemAsync(TOKEN_KEY);
	}
	if (!isNullOrWhitespace(refreshToken)) {
		await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken as string);
	} else {
		await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
	}
};

export const setOnLogout = (callback: () => void) => {
	onLogout = callback;
};

const useAxios = () => {
	const axiosInstance = axios.create({
		baseURL: API_URL,
		headers: {
			"Content-Type": "application/json",
		},
	});

	const refreshInstance = axios.create({
		baseURL: API_URL,
		headers: {
			"Content-Type": "application/json",
		},
		timeout: 20000,
	});

	axiosInstance.interceptors.request.use(
		async (config: InternalAxiosRequestConfig) => {
			const token = await loadToken();
			if (!isNullOrWhitespace(token)) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		(error: AxiosError) => {
			Sentry.captureMessage("Error in request");
			Sentry.captureException(error.message);
			return Promise.reject(error);
		},
	);

	axiosInstance.interceptors.response.use(
		(response) => {
			return response.data;
		},
		async (error: AxiosError) => {
			const originalRequest = error.config;
			// console.log(
			// 	"status: ",
			// 	error.response?.status,
			// 	"retry: ",
			// 	originalRequest?._retry,
			// );
			if (
				error.response?.status === 401 &&
				originalRequest &&
				!originalRequest?._retry
			) {
				// console.log("error response", error.message);
				originalRequest._retry = true;
				const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
				if (isNullOrWhitespace(refreshToken)) {
					// console.log("no refresh token");
					onLogout();
					return Promise.reject(error);
				}
				try {
					const refreshTokenResponse: {
						data: { jwt: string; refreshToken: string };
					} = await refreshInstance.post("api/auth/refresh", {
						refreshToken,
					});
					const data = refreshTokenResponse.data;
					// console.log("refresh kewl");
					await saveToken(data.jwt, data.refreshToken);
					axiosInstance.defaults.headers.common["Authorization"] =
						`Bearer ${data.jwt}`;
					return axiosInstance(originalRequest);
				} catch (refreshError) {
					// console.log("refresh catch error", refreshError);
					Sentry.captureMessage("Error in refreshing token");
					Sentry.captureException(refreshError);
					await saveToken(null, null);
					onLogout();
					return Promise.reject(refreshError);
				}
			}
			Sentry.captureException(error.message);
			if (error.response?.status === 404) {
				// console.log(
				// 	"error who",
				// 	error.config?.url,
				// 	"    |    ",
				// 	error.config?.params,
				// );
			}
			if (error.response?.status === 500) {
				// console.log(
				// 	"error who",
				// 	error.config?.url,
				// 	"    |    ",
				// 	error.config?.params,
				// );
				// console.log("500", error.message);
			}

			return Promise.reject(error);
		},
	);

	return axiosInstance;
};

export default useAxios;

export const setAuthToken = saveToken;
