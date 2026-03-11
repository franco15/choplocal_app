import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import { ERestaurantStatus, IRestaurant } from "@/lib/types/restaurant";
import { IReferralRecord, RedeemResult } from "@/lib/types/redeemCode";
import { MOCK_REDEEM_CODES } from "@/lib/mock/redeemCodes";
import { generateStableRecommendationCode } from "@/lib/utils";
import { useGiftCardContext } from "./GiftCardContext";
import { useUserContext } from "./UserContext";

// ── AsyncStorage keys ──────────────────────────────────────────────────────
const REDEEMED_GIFT_CODES_KEY = "choplocal-redeemed-gift-codes";
// Tracks restaurantIds where this user already redeemed a recommendation
const REDEEMED_REC_RESTAURANT_IDS_KEY = "choplocal-redeemed-rec-restaurants";
// Stores earned recommendation rewards: restaurantId → amount
const RECOMMENDATION_REWARDS_KEY = "choplocal-recommendation-rewards";
// Traceability records — for backend sync. Not shown in UI.
const REFERRAL_RECORDS_KEY = "choplocal-referral-records";
// Stores generated recommendation codes per restaurant: restaurantId → code
const GENERATED_REC_CODES_KEY = "choplocal-generated-rec-codes";

interface IRedeemCodeContext {
	redeemCode: (
		code: string,
		restaurants: IRestaurant[],
	) => Promise<RedeemResult>;
	/** Get existing code or create a new one (calls API in the future). Returns null if not yet generated. */
	getOrCreateRecommendationCode: (restaurantId: number) => Promise<string>;
	/** Check if a code was already generated for this restaurant (sync, no loading) */
	hasRecommendationCode: (restaurantId: number) => boolean;
	/** Earned balance from redeemed recommendation codes */
	getRecommendationReward: (restaurantId: number) => number;
	isLoading: boolean;
}

const RedeemCodeContext = createContext<IRedeemCodeContext>(
	{} as IRedeemCodeContext,
);

const RedeemCodeProvider = ({ children }: { children: React.ReactNode }) => {
	const { addRedeemedGiftCard, getGiftCardByCode } = useGiftCardContext();
	const { user } = useUserContext();

	// One-time codes for gift cards (code string → used)
	const [redeemedGiftCodes, setRedeemedGiftCodes] = useState<string[]>([]);
	// Per-restaurant recommendation redemption (restaurantId)
	const [redeemedRecRestaurantIds, setRedeemedRecRestaurantIds] = useState<
		number[]
	>([]);
	// Earned rewards from redeemed recommendation codes: restaurantId → amount
	const [recommendationRewards, setRecommendationRewards] = useState<
		Record<string, number>
	>({});
	// Traceability records — stored privately, not exposed in context
	// TODO: Sync these to the backend when ready
	const [referralRecords, setReferralRecords] = useState<IReferralRecord[]>(
		[],
	);
	// Generated recommendation codes per restaurant: { restaurantId: code }
	const [generatedRecCodes, setGeneratedRecCodes] = useState<
		Record<string, string>
	>({});

	const [isLoading, setIsLoading] = useState(true);

	// ── Load from AsyncStorage ──────────────────────────────────────────────
	useEffect(() => {
		const load = async () => {
			const [giftCodes, recRestaurantIds, rewards, records, genCodes] =
				await Promise.all([
					AsyncStorage.getItem(REDEEMED_GIFT_CODES_KEY),
					AsyncStorage.getItem(REDEEMED_REC_RESTAURANT_IDS_KEY),
					AsyncStorage.getItem(RECOMMENDATION_REWARDS_KEY),
					AsyncStorage.getItem(REFERRAL_RECORDS_KEY),
					AsyncStorage.getItem(GENERATED_REC_CODES_KEY),
				]);
			if (giftCodes) setRedeemedGiftCodes(JSON.parse(giftCodes));
			if (recRestaurantIds)
				setRedeemedRecRestaurantIds(JSON.parse(recRestaurantIds));
			if (rewards) setRecommendationRewards(JSON.parse(rewards));
			if (records) setReferralRecords(JSON.parse(records));
			if (genCodes) setGeneratedRecCodes(JSON.parse(genCodes));
			setIsLoading(false);
		};
		load();
	}, []);

	// ── Persist helpers ─────────────────────────────────────────────────────
	const persistGiftCodes = async (codes: string[]) => {
		setRedeemedGiftCodes(codes);
		await AsyncStorage.setItem(
			REDEEMED_GIFT_CODES_KEY,
			JSON.stringify(codes),
		);
	};

	const persistRecRestaurantIds = async (ids: number[]) => {
		setRedeemedRecRestaurantIds(ids);
		await AsyncStorage.setItem(
			REDEEMED_REC_RESTAURANT_IDS_KEY,
			JSON.stringify(ids),
		);
	};

	const persistRewards = async (rewards: Record<string, number>) => {
		setRecommendationRewards(rewards);
		await AsyncStorage.setItem(
			RECOMMENDATION_REWARDS_KEY,
			JSON.stringify(rewards),
		);
	};

	const persistReferralRecord = async (record: IReferralRecord) => {
		const updated = [...referralRecords, record];
		setReferralRecords(updated);
		await AsyncStorage.setItem(
			REFERRAL_RECORDS_KEY,
			JSON.stringify(updated),
		);
	};

	// ── Core redemption logic ───────────────────────────────────────────────
	const redeemCode = useCallback(
		async (
			code: string,
			restaurants: IRestaurant[],
		): Promise<RedeemResult> => {
			// TODO: Replace with API call when backend is ready
			await new Promise((resolve) => setTimeout(resolve, 1500));

			const normalized = code.trim().toUpperCase();

			// 1. Look up in static mock codes
			const mockCode = MOCK_REDEEM_CODES.find(
				(c) => c.code === normalized,
			);

			if (!mockCode) {
				// Fallback: check dynamically created gift cards
				const dynamicGiftCard = getGiftCardByCode(normalized);
				if (!dynamicGiftCard) {
					return { success: false, error: "invalid_code" };
				}
				if (redeemedGiftCodes.includes(normalized)) {
					return { success: false, error: "already_redeemed" };
				}
				await persistGiftCodes([...redeemedGiftCodes, normalized]);
				await addRedeemedGiftCard(
					dynamicGiftCard.restaurantId,
					dynamicGiftCard.restaurantName,
					dynamicGiftCard.value,
				);
				return {
					success: true,
					type: "giftcard",
					restaurantId: dynamicGiftCard.restaurantId,
					restaurantName: dynamicGiftCard.restaurantName,
					value: dynamicGiftCard.value,
					senderName: dynamicGiftCard.senderName,
					senderMessage: dynamicGiftCard.message,
				};
			}

			// 2. Validate based on type
			if (mockCode.type === "recommendation") {
				const restaurant = restaurants.find(
					(r) => r.id === mockCode.restaurantId,
				);

				// Check if user already visited this restaurant
				if (restaurant && restaurant.checkIns > 0) {
					return {
						success: false,
						error: "already_visited",
						restaurantName: mockCode.restaurantName,
					};
				}

				// Check if user already redeemed a recommendation for this restaurant
				// NOTE: The CODE itself is reusable — multiple users can use the same code.
				// But each user can only redeem ONE recommendation per restaurant.
				if (redeemedRecRestaurantIds.includes(mockCode.restaurantId)) {
					return {
						success: false,
						error: "already_recommended",
						restaurantName: mockCode.restaurantName,
					};
				}

				// Check if restaurant API already shows as Recommended
				if (
					restaurant &&
					restaurant.status === ERestaurantStatus.Recommended
				) {
					return {
						success: false,
						error: "already_recommended",
						restaurantName: mockCode.restaurantName,
					};
				}

				// Success — mark this restaurant as recommended for this user
				await persistRecRestaurantIds([
					...redeemedRecRestaurantIds,
					mockCode.restaurantId,
				]);

				const rewardAmount = mockCode.rewardValue ?? 0;

				// Store redeemer's earned reward
				if (rewardAmount > 0) {
					await persistRewards({
						...recommendationRewards,
						[String(mockCode.restaurantId)]: rewardAmount,
					});
				}

				// Store referral record for backend traceability
				// The backend will use this to credit the recommender when
				// this user makes their FIRST check-in at the restaurant.
				// TODO: Sync to backend on next network connection.
				await persistReferralRecord({
					id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
					code: normalized,
					restaurantId: mockCode.restaurantId,
					restaurantName: mockCode.restaurantName,
					redeemedAt: new Date().toISOString(),
					firstCheckInAt: null,
					recommenderRewardAmount: rewardAmount,
					recommenderRewardPaid: false,
				});

				return {
					success: true,
					type: "recommendation",
					restaurantId: mockCode.restaurantId,
					restaurantName: mockCode.restaurantName,
					rewardAmount,
				};
			}

			// Gift card code — one-time use
			if (redeemedGiftCodes.includes(normalized)) {
				return { success: false, error: "already_redeemed" };
			}
			await persistGiftCodes([...redeemedGiftCodes, normalized]);
			await addRedeemedGiftCard(
				mockCode.restaurantId,
				mockCode.restaurantName,
				mockCode.giftCardValue ?? 0,
			);
			return {
				success: true,
				type: "giftcard",
				restaurantId: mockCode.restaurantId,
				restaurantName: mockCode.restaurantName,
				value: mockCode.giftCardValue ?? 0,
				senderName: "",
				senderMessage: "",
			};
		},
		[
			redeemedGiftCodes,
			redeemedRecRestaurantIds,
			recommendationRewards,
			referralRecords,
			addRedeemedGiftCard,
			getGiftCardByCode,
		],
	);

	// ── Public getters ──────────────────────────────────────────────────────

	/**
	 * Check if a recommendation code already exists for this restaurant (sync).
	 */
	const hasRecommendationCode = useCallback(
		(restaurantId: number): boolean => {
			return !!generatedRecCodes[String(restaurantId)];
		},
		[generatedRecCodes],
	);

	/**
	 * Gets or creates a recommendation code for a restaurant.
	 * First time: simulates API call with delay, generates code, persists it.
	 * Subsequent calls: returns cached code instantly.
	 * TODO: Replace mock generation with actual API call when backend is ready.
	 */
	const getOrCreateRecommendationCode = useCallback(
		async (restaurantId: number): Promise<string> => {
			const existing = generatedRecCodes[String(restaurantId)];
			if (existing) return existing;

			// Simulate API call to generate code
			await new Promise((resolve) => setTimeout(resolve, 2000));
			const code = generateStableRecommendationCode(
				user?.id ?? "",
				restaurantId,
			);

			const updated = { ...generatedRecCodes, [String(restaurantId)]: code };
			setGeneratedRecCodes(updated);
			await AsyncStorage.setItem(
				GENERATED_REC_CODES_KEY,
				JSON.stringify(updated),
			);

			return code;
		},
		[generatedRecCodes, user?.id],
	);

	const getRecommendationReward = useCallback(
		(restaurantId: number): number => {
			return recommendationRewards[String(restaurantId)] ?? 0;
		},
		[recommendationRewards],
	);

	const data = useMemo(
		() =>
			({
				redeemCode,
				getOrCreateRecommendationCode,
				hasRecommendationCode,
				getRecommendationReward,
				isLoading,
			}) as IRedeemCodeContext,
		[redeemCode, getOrCreateRecommendationCode, hasRecommendationCode, getRecommendationReward, isLoading],
	);

	return (
		<RedeemCodeContext.Provider value={data}>
			{children}
		</RedeemCodeContext.Provider>
	);
};

const useRedeemCodeContext = () => {
	const context = useContext(RedeemCodeContext);
	if (!context) throw "RedeemCodeContext not defined";
	return context;
};

export { RedeemCodeProvider, useRedeemCodeContext };
