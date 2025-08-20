import { createContext, useContext, useMemo } from "react";

// import useApiService from "@/lib/axiosInstance";
import useApiService from "@/lib/api/axiosInstance";
import { UserEndpoints } from "@/lib/api/endpoints";
import { queryKeys } from "@/lib/api/queryClient";
import { IUser } from "@/lib/types/user";
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
	updateUser: UseMutationResult<IUser, Error, IUser, unknown>;
	refetch: (
		options?: RefetchOptions
	) => Promise<QueryObserverResult<IUser, Error>>;
}

const UserContext = createContext<IUserContext>({} as IUserContext);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const api = useApiService();
	const { userAuth } = useAuthContext();

	const {
		data: user,
		isPending: isUserLoading,
		isFetching: isUserFetching,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: [queryKeys.user],
		queryFn: async () => {
			const data: IUser = await api.get(UserEndpoints.byId(userAuth!.phone));
			return data;
		},
		enabled: !!userAuth,
	});

	const data = useMemo(() => {
		return {
			user,
			isUserLoading,
			isUserFetching,
			refetch,
		} as IUserContext;
	}, [user, isUserLoading]);

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
