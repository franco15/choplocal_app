import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { TOKEN_KEY } from "@/constants/keys";
import { setAuthToken, setOnLogout } from "@/lib/api/axiosInstance";
import { useAuthApi } from "@/lib/api/useApi";
import { isNullOrWhitespace } from "@/lib/utils";
import * as Sentry from "@sentry/react-native";
import { useQueryClient } from "@tanstack/react-query";

interface IAuthContext {
	authenticated: boolean;
	setAuthenticated: (authenticated: boolean) => void;
	token: string | null;
	setToken: (token: string | null) => void;
	userAuth: {
		phone: string;
		id: string;
	};
	phoneNumber: string;
	setPhoneNumber: (phone: string) => void;
	login: (userReference: string) => Promise<void>;
	requestVerificationCode: (phone: string) => Promise<void>;
	verifyCode: (code: string) => Promise<boolean>;
	registerWithCode: (code: string) => Promise<boolean>;
	logout: () => Promise<void>;
	showDeletedUserAlert: boolean;
	setShowDeletedUserAlert: (showDeletedUserAlert: boolean) => void;
	isNewUser: boolean;
	clearNewUser: () => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const authApi = useAuthApi();
	const queryClient = useQueryClient();
	const [authenticated, setAuthenticated] = useState<boolean | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [phoneNumber, setPhoneNumber] = useState<string>("");
	const [userAuth, setUserAuth] = useState<{
		phone: string;
		id: string;
	}>({ phone: "", id: "" });
	const [showDeletedUserAlert, setShowDeletedUserAlert] = useState(false);
	const [isNewUser, setIsNewUser] = useState(false);

	useEffect(() => {
		const getToken = async () => {
			const jwt = await SecureStore.getItemAsync(TOKEN_KEY);
			if (!isNullOrWhitespace(jwt)) {
				return decodeTokenAndSave(jwt as string);
			}
			setAuthenticated(false);
		};
		getToken();
		setOnLogout(logout);
	}, []);

	const decodeTokenAndSave = (jwt: string) => {
		setToken(jwt);
		setAuthenticated(true);
		const decoded = jwtDecode(jwt!);
		let phone = "";
		let id = "";
		if (!isNullOrWhitespace(decoded.sub)) phone = decoded.sub!;
		if (!isNullOrWhitespace(decoded.jti)) id = decoded.jti!;
		setUserAuth({ phone, id });
	};

	const login = async (userReference: string) => {
		try {
			await requestVerificationCode(userReference);
		} catch (error) {
			// console.log("login", error);
		}
	};

	const logout = async () => {
		queryClient.clear();
		setAuthenticated(false);
		setUserAuth({ phone: "", id: "" });
		await setAuthToken(null, null);
		Sentry.setUser(null);
	};

	const requestVerificationCode = async (phoneNumber: string) => {
		try {
			setPhoneNumber(phoneNumber);
			await authApi.requestCode(phoneNumber);
		} catch (error) {
			// console.log("error", error);
		}
	};

	const verifyCode = async (code: string) => {
		try {
			const res: { jwt: string; refreshToken: string } =
				await authApi.loginWithCode(phoneNumber, code);
			if (
				!isNullOrWhitespace(res.jwt) &&
				!isNullOrWhitespace(res.refreshToken)
			) {
				await setAuthToken(res.jwt, res.refreshToken);
				decodeTokenAndSave(res.jwt);
			}
			return true;
		} catch (error) {
			return false;
		}
	};

	const registerWithCode = async (code: string) => {
		try {
			const res: { jwt: string; refreshToken: string } =
				await authApi.registerWithCode(phoneNumber, code);
			if (
				!isNullOrWhitespace(res.jwt) &&
				!isNullOrWhitespace(res.refreshToken)
			) {
				await setAuthToken(res.jwt, res.refreshToken);
				setIsNewUser(true);
				decodeTokenAndSave(res.jwt);
			}
			return true;
		} catch (error) {
			return false;
		}
	};

	const clearNewUser = () => setIsNewUser(false);

	const data = useMemo(() => {
		return {
			authenticated,
			setAuthenticated,
			token,
			setToken,
			login,
			logout,
			requestVerificationCode,
			verifyCode,
			registerWithCode,
			phoneNumber,
			setPhoneNumber,
			userAuth,
			showDeletedUserAlert,
			setShowDeletedUserAlert,
			isNewUser,
			clearNewUser,
		} as IAuthContext;
	}, [authenticated, phoneNumber, userAuth, token, showDeletedUserAlert, isNewUser]);

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
