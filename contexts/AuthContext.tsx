import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useMemo, useState } from "react";

interface IAuthContext {
	authState: {
		token: string | null;
		authenticated: boolean;
	};
	register: (userReference: string) => Promise<boolean>;
	login: (userReference: string) => Promise<boolean>;
	sendCode: (userReference: string) => Promise<boolean>;
	logout: () => Promise<void>;
}

const TOKEN_KEY = "choplocal-jwt";

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const AuthProvider = ({ children }: any) => {
	const [authState, setAuthState] = useState<{
		token: string | null;
		authenticated: boolean;
	}>({ token: null, authenticated: false });

	const register = async (userReference: string) => {
		try {
			return true;
		} catch (error) {
			return false;
		}
	};

	const login = async (userReference: string) => {
		try {
			await sendCode(userReference);
			return true;
		} catch (error) {
			return false;
		}
	};

	const logout = async () => {
		setAuthState({ token: null, authenticated: false });
		await SecureStore.deleteItemAsync(TOKEN_KEY);
	};

	const sendCode = async (userReference: string) => {
		try {
			const jwt = "asdfasdfasdfadsfsadfsa"; // pegarle a la api para el login aqui o donde sea que me regrese el token
			setAuthState({ token: jwt, authenticated: true });
			await SecureStore.setItemAsync(TOKEN_KEY, jwt);
			return true;
		} catch (error) {
			return false;
		}
	};

	const data = useMemo(() => {
		return {
			authState,
			register,
			login,
			logout,
			sendCode,
		} as IAuthContext;
	}, [authState]);

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
