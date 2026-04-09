import { createContext, useCallback, useContext, useMemo } from "react";

import { useGiftCardApi } from "@/lib/api/useApi";
import { IRedeemCodeResult } from "@/lib/types/giftcard";
import { useGiftCardContext } from "./GiftCardContext";
import { useUserContext } from "./UserContext";

interface IRedeemCodeContext {
	redeemCode: (code: string) => Promise<RedeemCodeResult>;
	isLoading: boolean;
}

export type RedeemCodeResult =
	| { success: true; data: IRedeemCodeResult }
	| { success: false; error: string };

const RedeemCodeContext = createContext<IRedeemCodeContext>(
	{} as IRedeemCodeContext,
);

const RedeemCodeProvider = ({ children }: { children: React.ReactNode }) => {
	const { refreshGiftCards } = useGiftCardContext();
	const { user } = useUserContext();
	const giftCardApi = useGiftCardApi();

	const redeemCode = useCallback(
		async (code: string): Promise<RedeemCodeResult> => {
			try {
				const normalized = code.trim().toUpperCase();
				const result = await giftCardApi.redeem({
					code: normalized,
					userId: user?.id ?? "",
				});
				refreshGiftCards();
				return {
					success: true,
					data: result,
				};
			} catch (err: any) {
				const apiMessage =
					err?.response?.data?.message ??
					err?.message ??
					"Failed to redeem code";
				return {
					success: false,
					error: apiMessage,
				};
			}
		},
		[user?.id, giftCardApi, refreshGiftCards],
	);

	const data = useMemo(
		() =>
			({
				redeemCode,
				isLoading: false,
			}) as IRedeemCodeContext,
		[redeemCode],
	);

	return (
		<RedeemCodeContext.Provider value={data}>
			{children}
		</RedeemCodeContext.Provider>
	);
};

const useRedeemCodeContext = () => {
	const context = useContext(RedeemCodeContext);
	if (!context) throw new Error("RedeemCodeContext not defined");
	return context;
};

export { RedeemCodeProvider, useRedeemCodeContext };
