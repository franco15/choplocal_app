import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import {
	EGiftCardStatus,
	IGiftCard,
	IGiftCardSend,
	IPaymentInfo,
} from "@/lib/types/giftcard";
import mockGiftCards from "@/lib/mock/giftcards.json";
import { generateGiftCardCode } from "@/lib/utils";
import { useUserContext } from "./UserContext";

const GIFT_CARDS_KEY = "choplocal-gift-cards";

interface IGiftCardContext {
	giftCards: IGiftCard[];
	sentGiftCards: IGiftCard[];
	receivedGiftCards: IGiftCard[];
	sendGiftCard: (payload: IGiftCardSend) => Promise<IGiftCard>;
	addRedeemedGiftCard: (
		restaurantId: number,
		restaurantName: string,
		value: number,
	) => Promise<IGiftCard>;
	acceptGiftCard: (id: string) => Promise<void>;
	declineGiftCard: (id: string) => Promise<void>;
	getGiftCardsByRestaurant: (restaurantId: number) => IGiftCard[];
	getGiftCardById: (id: string) => IGiftCard | undefined;
	getGiftCardByCode: (code: string) => IGiftCard | undefined;
	processPayment: (
		paymentInfo: IPaymentInfo,
		amount: number,
	) => Promise<boolean>;
	isLoading: boolean;
}

const GiftCardContext = createContext<IGiftCardContext>({} as IGiftCardContext);

const GiftCardProvider = ({ children }: { children: React.ReactNode }) => {
	const { user } = useUserContext();
	const [giftCards, setGiftCards] = useState<IGiftCard[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			const stored = await AsyncStorage.getItem(GIFT_CARDS_KEY);
			if (stored) {
				setGiftCards(JSON.parse(stored));
			} else {
				const mock = mockGiftCards as IGiftCard[];
				setGiftCards(mock);
				await AsyncStorage.setItem(
					GIFT_CARDS_KEY,
					JSON.stringify(mock),
				);
			}
			setIsLoading(false);
		};
		load();
	}, []);

	const persist = async (cards: IGiftCard[]) => {
		setGiftCards(cards);
		await AsyncStorage.setItem(GIFT_CARDS_KEY, JSON.stringify(cards));
	};

	const sendGiftCard = useCallback(
		async (payload: IGiftCardSend): Promise<IGiftCard> => {
			const newCard: IGiftCard = {
				id: `gc-${Date.now()}`,
				code: generateGiftCardCode(),
				...payload,
				status: EGiftCardStatus.Available,
				senderPhone: user?.phoneNumber ?? "",
				senderName: user
					? `${user.firstName} ${user.lastName}`
					: "",
				createdAt: new Date().toISOString(),
				expiresAt: new Date(
					Date.now() + 90 * 24 * 60 * 60 * 1000,
				).toISOString(),
				usedAt: null,
			};
			const updated = [...giftCards, newCard];
			await persist(updated);
			return newCard;
		},
		[giftCards, user],
	);

	const acceptGiftCard = useCallback(async (id: string) => {
		// In production this would hit an API
		// For mock, the card stays as Available (accepted into wallet)
	}, []);

	const addRedeemedGiftCard = useCallback(
		async (
			restaurantId: number,
			restaurantName: string,
			value: number,
		): Promise<IGiftCard> => {
			const newCard: IGiftCard = {
				id: `gc-redeem-${Date.now()}`,
				code: generateGiftCardCode(),
				restaurantId,
				restaurantName,
				value,
				status: EGiftCardStatus.Available,
				senderPhone: "",
				senderName: "Redeemed Code",
				recipientPhone: user?.phoneNumber ?? "",
				message: "Gift card redeemed from code",
				createdAt: new Date().toISOString(),
				expiresAt: new Date(
					Date.now() + 90 * 24 * 60 * 60 * 1000,
				).toISOString(),
				usedAt: null,
			};
			const updated = [...giftCards, newCard];
			await persist(updated);
			return newCard;
		},
		[giftCards, user],
	);

	const declineGiftCard = useCallback(
		async (id: string) => {
			const updated = giftCards.filter((gc) => gc.id !== id);
			await persist(updated);
		},
		[giftCards],
	);

	const sentGiftCards = useMemo(
		() =>
			giftCards.filter(
				(gc) => gc.senderPhone === user?.phoneNumber,
			),
		[giftCards, user],
	);

	const receivedGiftCards = useMemo(
		() =>
			giftCards.filter(
				(gc) => gc.recipientPhone === user?.phoneNumber,
			),
		[giftCards, user],
	);

	const getGiftCardsByRestaurant = useCallback(
		(restaurantId: number) =>
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
				(gc) =>
					gc.code &&
					gc.code.toUpperCase() === code.toUpperCase(),
			),
		[giftCards],
	);

	const processPayment = useCallback(
		async (_paymentInfo: IPaymentInfo, _amount: number): Promise<boolean> => {
			// Mock: simulate network delay — replace with real Stripe/API call later
			await new Promise((resolve) => setTimeout(resolve, 2000));
			return true;
		},
		[],
	);

	const data = useMemo(
		() =>
			({
				giftCards,
				sentGiftCards,
				receivedGiftCards,
				sendGiftCard,
				addRedeemedGiftCard,
				acceptGiftCard,
				declineGiftCard,
				getGiftCardsByRestaurant,
				getGiftCardById,
				getGiftCardByCode,
				processPayment,
				isLoading,
			}) as IGiftCardContext,
		[giftCards, isLoading, user],
	);

	return (
		<GiftCardContext.Provider value={data}>
			{children}
		</GiftCardContext.Provider>
	);
};

const useGiftCardContext = () => {
	const context = useContext(GiftCardContext);
	if (!context) throw "GiftCardContext not defined";
	return context;
};

export { GiftCardProvider, useGiftCardContext };
