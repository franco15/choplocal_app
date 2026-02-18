import { useSuggestionsApi } from "@/lib/api/useApi";
import { createContext, useContext, useMemo } from "react";

interface ISuggestionContext {
	craeteSuggestion: (name: string) => Promise<void>;
}

const SuggestionContext = createContext<ISuggestionContext>(
	{} as ISuggestionContext,
);

const SuggestionProvider = ({ children }: { children: React.ReactNode }) => {
	const suggestionsApi = useSuggestionsApi();

	const craeteSuggestion = async (name: string) => {
		try {
			const res = await suggestionsApi.create({ name });
		} catch (error) {
			// console.log(error);
		}
	};

	const data = useMemo(() => {
		return { craeteSuggestion } as ISuggestionContext;
	}, []);
	return (
		<SuggestionContext.Provider value={data}>
			{children}
		</SuggestionContext.Provider>
	);
};

const useSuggestionContext = () => {
	const context = useContext(SuggestionContext);

	if (!context) {
		throw "auth context not defined";
	}
	return context;
};

export { SuggestionProvider, useSuggestionContext };
