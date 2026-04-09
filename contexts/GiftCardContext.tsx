import { createContext, useCallback, useContext, useMemo } from "react";

import { queryClient, queryKeys } from "@/lib/api/queryClient";
import { useGiftCardApi } from "@/lib/api/useApi";
import { IGiftCard } from "@/lib/types/giftcard";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "./UserContext";

interface IGiftCardContext {
	giftCards: IGiftCard[];
	sentGiftCards: IGiftCard[];
	receivedGiftCards: IGiftCard[];
	getGiftCardsByRestaurant: (restaurantId: string) => IGiftCard[];
	getGiftCardById: (id: string) => IGiftCard | undefined;
	getGiftCardByCode: (code: string) => IGiftCard | undefined;
	refreshGiftCards: () => void;
	isLoading: boolean;
}

const GiftCardContext = createContext<IGiftCardContext>({} as IGiftCardContext);

const GiftCardProvider = ({ children }: { children: React.ReactNode }) => {
	const { user } = useUserContext();
	const giftCardApi = useGiftCardApi();

	const { data: giftCards = [], isPending: isLoading } = useQuery({
		queryKey: queryKeys.giftCards.byUser(user?.id ?? ""),
		queryFn: () => giftCardApi.byUser(user.id),
		enabled: !!user?.id,
	});

	const refreshGiftCards = useCallback(() => {
		if (user?.id) {
			queryClient.invalidateQueries({
				queryKey: queryKeys.giftCards.byUser(user.id),
			});
		}
	}, [user?.id]);

	const sentGiftCards = useMemo(
		() => giftCards.filter((gc) => gc.senderId === user?.id),
		[giftCards, user],
	);

	const receivedGiftCards = useMemo(
		() => giftCards.filter((gc) => gc.receiverId === user?.id),
		[giftCards, user],
	);

	const getGiftCardsByRestaurant = useCallback(
		(restaurantId: string) =>
			giftCards.filter((gc) => gc.restaurantId === restaurantId),
		[giftCards],
	);

	const getGiftCardById = useCallback(
		(id: string) => giftCards.find((gc) => gc.id === id),
		[giftCards],
	);

	const getGiftCardByCode = useCallback(
		(code: string) =>
			giftCards.find(
				(gc) => gc.code && gc.code.toUpperCase() === code.toUpperCase(),
			),
		[giftCards],
	);

	const data = useMemo(
		() =>
			({
				giftCards,
				sentGiftCards,
				receivedGiftCards,
				getGiftCardsByRestaurant,
				getGiftCardById,
				getGiftCardByCode,
				refreshGiftCards,
				isLoading,
			}) as IGiftCardContext,
		[giftCards, isLoading, user],
	);

	return (
		<GiftCardContext.Provider value={data}>{children}</GiftCardContext.Provider>
	);
};

const useGiftCardContext = () => {
	const context = useContext(GiftCardContext);
	if (!context) throw new Error("GiftCardContext not defined");
	return context;
};

export { GiftCardProvider, useGiftCardContext };
