import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import useApiService from "@/lib/axiosInstance";
import { isNullOrWhitespace } from "@/lib/utils";

interface IAuthContext {
	authState: {
		token: string | null;
		authenticated: boolean;
	};
	phone: string;
	setPhone: (phone: string) => void;
	login: (userReference: string) => Promise<void>;
	requestVerificationCode: (phone: string) => Promise<void>;
	verifyCode: (code: string) => Promise<boolean>;
	registerWithCode: (code: string) => Promise<boolean>;
	logout: () => Promise<void>;
}

const TOKEN_KEY = "choplocal-jwt";

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const api = useApiService();
	const [authState, setAuthState] = useState<{
		token: string | null;
		authenticated: boolean;
	}>({ token: null, authenticated: false });
	const [phone, setPhone] = useState<string>("");

	useEffect(() => {
		const getToken = async () => {
			const jwt = await SecureStore.getItemAsync(TOKEN_KEY);
			if (!isNullOrWhitespace(jwt)) {
				setAuthState({ token: jwt, authenticated: true });
				const decoded = jwtDecode(jwt!);
				if (!isNullOrWhitespace(decoded.sub)) setPhone(decoded.sub!);
			}
		};
		getToken();
	}, []);

	const login = async (userReference: string) => {
		try {
			await requestVerificationCode(userReference);
		} catch (error) {}
	};

	const logout = async () => {
		setAuthState({ token: null, authenticated: false });
		await SecureStore.deleteItemAsync(TOKEN_KEY);
	};

	const requestVerificationCode = async (phone: string) => {
		try {
			await api.post("api/auth/request-verification-code", {
				phoneNumber: phone,
			});
		} catch (error) {
			console.log("error", error);
		}
	};

	const verifyCode = async (code: string) => {
		try {
			const res: { jwt: string } = await api.post("api/auth/login-with-code", {
				phoneNumber: phone,
				code: code,
			});
			const jwt = res.jwt;
			if (jwt) {
				setAuthState({ token: jwt, authenticated: true });
				await SecureStore.setItemAsync(TOKEN_KEY, jwt);
			}
			return true;
		} catch (error) {
			return false;
		}
	};

	const registerWithCode = async (code: string) => {
		try {
			const response: { jwt: string } = await api.post(
				"api/auth/register-with-code",
				{
					phoneNumber: phone,
					code: code,
				}
			);
			const jwt = response.jwt;
			if (jwt) {
				setAuthState({ token: jwt, authenticated: true });
				await SecureStore.setItemAsync(TOKEN_KEY, jwt);
			}
			return true;
		} catch (error) {
			console.log("error", error);
			return false;
		}
	};

	const data = useMemo(() => {
		return {
			authState,
			login,
			logout,
			requestVerificationCode,
			verifyCode,
			registerWithCode,
			phone,
			setPhone,
		} as IAuthContext;
	}, [authState, phone]);

	return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

const useAuthContext = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw "auth context not defined";
	}
	return context;
};

export { AuthProvider, useAuthContext };
