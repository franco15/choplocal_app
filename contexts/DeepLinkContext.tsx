import { createContext, useContext, useMemo, useRef, useState } from "react";

interface IDeepLinkContext {
	pendingRoute: string | null;
	setPendingRoute: (route: string | null) => void;
	consumePendingRoute: () => string | null;
}

const DeepLinkContext = createContext<IDeepLinkContext>({} as IDeepLinkContext);

const DeepLinkProvider = ({ children }: { children: React.ReactNode }) => {
	const [pendingRoute, setPendingRouteState] = useState<string | null>(null);
	const pendingRouteRef = useRef<string | null>(null);

	const setPendingRoute = (route: string | null) => {
		pendingRouteRef.current = route;
		setPendingRouteState(route);
	};

	const consumePendingRoute = () => {
		const current = pendingRouteRef.current;
		pendingRouteRef.current = null;
		setPendingRouteState(null);
		return current;
	};

	const data = useMemo(
		() => ({ pendingRoute, setPendingRoute, consumePendingRoute }),
		[pendingRoute],
	);

	return (
		<DeepLinkContext.Provider value={data}>{children}</DeepLinkContext.Provider>
	);
};

const useDeepLinkContext = () => {
	const context = useContext(DeepLinkContext);
	if (!context) {
		throw new Error("deep link context not defined");
	}
	return context;
};

export { DeepLinkProvider, useDeepLinkContext };
