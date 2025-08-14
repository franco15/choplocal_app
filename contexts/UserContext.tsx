import { createContext, useContext, useEffect, useMemo, useState } from "react";

import useApiService from "@/lib/axiosInstance";
import { IUser } from "@/lib/types/user";
import { isNullOrWhitespace } from "@/lib/utils";
import { useAuthContext } from "./AuthContext";

interface IUserContext {
	user: IUser;
	setUser: (user: IUser) => void;
	updateUser: (user: IUser) => Promise<boolean>;
	profileCompleted: boolean;
}

const UserContext = createContext<IUserContext>({} as IUserContext);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const api = useApiService();
	const { authenticated, phone } = useAuthContext();
	const [user, setUser] = useState<IUser>();
	const [profileCompleted, setProfileCompleted] = useState(true);

	useEffect(() => {
		const retrieveUser = async () => {
			const res: IUser = await api.get(`api/app/user/${phone}`);
			setUser(res);
			if (isNullOrWhitespace(res?.firstName)) {
				setProfileCompleted(false);
			}
		};
		if (authenticated && !isNullOrWhitespace(phone)) retrieveUser();
	}, [authenticated, phone]);

	const updateUser = async (model: IUser) => {
		try {
			const res: IUser = await api.put(`api/app/user/${user?.id}`, {
				firstName: model.firstName,
				lastName: model.lastName,
				birthDate: model.birthDate,
				email: model.email,
			});
			setUser(res);
			setProfileCompleted(true);
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	};

	const data = useMemo(() => {
		return { user, setUser, updateUser, profileCompleted } as IUserContext;
	}, [user]);

	return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

const useUserContext = () => {
	const context = useContext(UserContext);

	if (!context) {
		throw "auth context not defined";
	}
	return context;
};

export { UserProvider, useUserContext };
