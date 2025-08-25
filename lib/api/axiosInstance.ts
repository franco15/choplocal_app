import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

import { TOKEN_KEY } from "@/constants/keys";
import { useRouter } from "expo-router";
import { isNullOrWhitespace } from "../utils";

let cachedToken: string | null = null;
let onLogout = () => {};

// const API_URL = "https://localhost:44339/"; ///TODO set up env variables
const API_URL = "http://10.0.2.2:5264/"; ///TODO set up env variables

const loadToken = async () => {
	if (!cachedToken) cachedToken = await SecureStore.getItemAsync(TOKEN_KEY);
	return cachedToken;
};

const saveToken = async (token: string | null) => {
	cachedToken = token;
	if (token) {
		await SecureStore.setItemAsync(TOKEN_KEY, token);
	} else {
		await SecureStore.deleteItemAsync(TOKEN_KEY);
	}
};

export const setOnLogout = (callback: () => void) => {
	onLogout = callback;
};

const useAxios = () => {
	const router = useRouter();

	const axiosInstance = axios.create({
		baseURL: API_URL,
		headers: {
			"Content-Type": "application/json",
		},
		// timeout: 10000,
	});

	axiosInstance.interceptors.request.use(
		async (config: InternalAxiosRequestConfig) => {
			const token = await loadToken();
			if (!isNullOrWhitespace(token)) {
				console.log(token);
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		(error: AxiosError) => {
			console.log("error request", error);
			return Promise.reject(error);
		}
	);

	axiosInstance.interceptors.response.use(
		(response) => {
			return response.data;
		},
		async (error: AxiosError) => {
			if (error.response) {
				switch (error.response.status) {
					case 401:
						await saveToken(null);
						onLogout();
						break;
					case 404:
						console.log(
							"error who",
							error.config?.url,
							"    |    ",
							error.config?.params
						);
					default:
						break;
				}
			}
			console.log("error response", error.message);

			return Promise.reject(error);
		}
	);

	return axiosInstance;
};

export default useAxios;

export const setAuthToken = saveToken;
