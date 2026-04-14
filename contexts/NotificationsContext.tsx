import { useNotifications } from "@/lib/hooks/useNotifications";
import * as Notifications from "expo-notifications";
import { createContext, useContext, useEffect, useMemo } from "react";
import { useUserContext } from "./UserContext";

interface INotificationsContext {}

const NotificationsContext = createContext<INotificationsContext>(
	{} as INotificationsContext,
);

const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
	const { user } = useUserContext();
	const { register } = useNotifications();

	useEffect(() => {
		console.log("useeffect nots");
		const initNots = async () => {
			console.log("registre notd");
			await register(user.id);
		};
		if (user?.id) initNots();
	}, [user]);

	const data = useMemo(() => {
		return {} as INotificationsContext;
	}, []);

	return (
		<NotificationsContext.Provider value={data}>
			{children}
		</NotificationsContext.Provider>
	);
};

const useNotificationsContext = () => {
	const context = useContext(NotificationsContext);

	if (!context) {
		throw new Error("notifications context not defined");
	}
	return context;
};

export { NotificationsProvider, useNotificationsContext };
