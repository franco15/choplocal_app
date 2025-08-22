import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { queryKeys } from "@/lib/api/queryClient";
import { useUserApi } from "@/lib/api/useApi";
import { IUser } from "@/lib/types/user";
import { isNullOrWhitespace } from "@/lib/utils";
import {
	QueryObserverResult,
	RefetchOptions,
	UseMutationResult,
	useQuery,
} from "@tanstack/react-query";
import { useAuthContext } from "./AuthContext";

interface IUserContext {
	user: IUser;
	isUserLoading: boolean;
	isUserFetching: boolean;
	profileComplete: boolean;
	setProfileComplete: (complete: boolean) => void;
	updateUser: UseMutationResult<IUser, Error, IUser, unknown>;
	refetch: (
		options?: RefetchOptions
	) => Promise<QueryObserverResult<IUser, Error>>;
}

const UserContext = createContext<IUserContext>({} as IUserContext);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const userApi = useUserApi();
	const { authenticated, userAuth } = useAuthContext();
	const [profileComplete, setProfileComplete] = useState(true);

	const {
		data: user,
		isPending: isUserLoading,
		isFetching: isUserFetching,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: [queryKeys.users.byId(userAuth.id)],
		queryFn: async () => {
			const data = await userApi.byId(userAuth.phone);
			return data;
		},
		enabled: !!authenticated && !isNullOrWhitespace(userAuth.phone),
	});

	useEffect(() => {
		if (user && isNullOrWhitespace(user.firstName)) setProfileComplete(false);
	}, [user]);

	const data = useMemo(() => {
		return {
			user,
			isUserLoading,
			isUserFetching,
			profileComplete,
			setProfileComplete,
			refetch,
		} as IUserContext;
	}, [user, isUserLoading, isUserFetching, profileComplete]);

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
