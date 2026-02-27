import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { queryKeys } from "@/lib/api/queryClient";
import { useUserApi } from "@/lib/api/useApi";
import { IUser } from "@/lib/types/user";
import { isNullOrWhitespace } from "@/lib/utils";
import * as Sentry from "@sentry/react-native";
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
		options?: RefetchOptions,
	) => Promise<QueryObserverResult<IUser, Error>>;
	deleteUser: () => Promise<void>;
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
			// console.log("get user query");
			const data = await userApi.byId(userAuth.phone);
			return data;
		},
		enabled: authenticated === true && !isNullOrWhitespace(userAuth.phone),
	});

	useEffect(() => {
		if (user) {
			Sentry.setUser({ id: user.id, phone: user.phoneNumber });
			if (isNullOrWhitespace(user.firstName)) setProfileComplete(false);
		}
	}, [user]);

	const deleteUser = async () => {
		await userApi.delete(user!.id);
	};

	const data = useMemo(() => {
		return {
			user,
			isUserLoading,
			isUserFetching,
			profileComplete,
			setProfileComplete,
			refetch,
			deleteUser,
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
