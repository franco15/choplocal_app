import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import { useRouter } from "expo-router";
import { useAuthContext } from "../contexts/AuthContext";
import { isNullOrWhitespace } from "./utils";

// const API_URL = "https://localhost:44339/"; ///TODO set up env variables
const API_URL = "http://10.0.2.2:5264/"; ///TODO set up env variables

const useApiService = () => {
	const { authState } = useAuthContext();
	const router = useRouter();

	const axiosInstance = axios.create({
		baseURL: API_URL,
		headers: {
			"Content-Type": "application/json",
		},
		// timeout: 10000,
	});

	axiosInstance.interceptors.request.use(
		(config: InternalAxiosRequestConfig) => {
			if (!isNullOrWhitespace(authState?.token)) {
				console.log(authState.token);
				config.headers.Authorization = `Bearer ${authState.token}`;
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
			// console.log(response);
			return response.data;
		},
		(error: AxiosError) => {
			if (error.response) {
				switch (error.response.status) {
					case 401:
						return router.replace("/login");
					// break;

					default:
						break;
				}
			}
			console.log("error response", error.response);
			return Promise.reject(error);
		}
	);

	return axiosInstance;
};

export default useApiService;
