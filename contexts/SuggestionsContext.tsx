import { useSuggestionsApi } from "@/lib/api/useApi";
import { createContext, useContext, useMemo } from "react";

interface ISuggestionContext {
	createSuggestion: (
		name: string,
		city: string,
		description: string,
	) => Promise<void>;
}

const SuggestionContext = createContext<ISuggestionContext>(
	{} as ISuggestionContext,
);

const SuggestionProvider = ({ children }: { children: React.ReactNode }) => {
	const suggestionsApi = useSuggestionsApi();

	const createSuggestion = async (
		name: string,
		city: string,
		description: string,
	) => {
		try {
			const res = await suggestionsApi.create({ name, city, description });
		} catch (error) {
			// console.log(error);
		}
	};

	const data = useMemo(() => {
		return { createSuggestion } as ISuggestionContext;
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
		throw new Error("suggestions context not defined");
	}
	return context;
};

export { SuggestionProvider, useSuggestionContext };
