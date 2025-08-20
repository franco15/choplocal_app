import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { TOKEN_KEY } from "@/constants/keys";
import useApiService, { setAuthToken } from "@/lib/api/axiosInstance";
import { isNullOrWhitespace } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface IAuthContext {
	authenticated: boolean;
	userAuth: {
		phone: string;
		id: string;
	} | null;
	phoneNumber: string;
	setPhoneNumber: (phone: string) => void;
	login: (userReference: string) => Promise<void>;
	requestVerificationCode: (phone: string) => Promise<void>;
	verifyCode: (code: string) => Promise<boolean>;
	registerWithCode: (code: string) => Promise<boolean>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const api = useApiService();
	const queryClient = useQueryClient();
	const [authenticated, setAuthenticated] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState<string>("");
	const [userAuth, setUserAuth] = useState<{
		phone: string;
		id: string;
	} | null>(null);

	useEffect(() => {
		const getToken = async () => {
			const jwt = await SecureStore.getItemAsync(TOKEN_KEY);
			if (!isNullOrWhitespace(jwt)) {
				setAuthenticated(true);
				const decoded = jwtDecode(jwt!);
				let phone = "";
				let id = "";
				if (!isNullOrWhitespace(decoded.sub)) phone = decoded.sub!;
				if (!isNullOrWhitespace(decoded.jti)) id = decoded.jti!;
				setUserAuth({ phone, id });
			}
		};
		getToken();
	}, [authenticated]);

	const login = async (userReference: string) => {
		try {
			await requestVerificationCode(userReference);
		} catch (error) {
			console.log("login", error);
		}
	};

	const logout = async () => {
		queryClient.clear();
		setAuthenticated(false);
		setUserAuth(null);
		await setAuthToken(null);
	};

	const requestVerificationCode = async (phoneNumber: string) => {
		try {
			await api.post("api/auth/request-verification-code", {
				phoneNumber: phoneNumber,
			});
			setPhoneNumber(phoneNumber);
		} catch (error) {
			console.log("error", error);
		}
	};

	const verifyCode = async (code: string) => {
		try {
			const res: { jwt: string } = await api.post("api/auth/login-with-code", {
				phoneNumber,
				code: code,
			});
			const jwt = res.jwt;
			if (jwt) {
				setAuthenticated(true);
				await setAuthToken(jwt);
			}
			return true;
		} catch (error) {
			console.log("verify", error);
			return false;
		}
	};

	const registerWithCode = async (code: string) => {
		try {
			const response: { jwt: string } = await api.post(
				"api/auth/register-with-code",
				{
					phoneNumber,
					code: code,
				}
			);
			const jwt = response.jwt;
			if (jwt) {
				setAuthenticated(true);
				await setAuthToken(jwt);
			}
			return true;
		} catch (error) {
			console.log("error", error);
			return false;
		}
	};

	const data = useMemo(() => {
		return {
			authenticated,
			login,
			logout,
			requestVerificationCode,
			verifyCode,
			registerWithCode,
			phoneNumber,
			setPhoneNumber,
			userAuth,
		} as IAuthContext;
	}, [authenticated, phoneNumber, userAuth]);

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
