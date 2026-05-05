import { EVENT_FAVORITES_KEY } from "@/constants/keys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function useEventFavorites() {
	const [favoriteEventIds, setFavoriteEventIds] = useState<string[]>([]);

	useFocusEffect(
		useCallback(() => {
			AsyncStorage.getItem(EVENT_FAVORITES_KEY).then((val) => {
				if (val) setFavoriteEventIds(JSON.parse(val));
				else setFavoriteEventIds([]);
			});
		}, []),
	);

	const toggleEventFavorite = useCallback((id: string) => {
		setFavoriteEventIds((prev) => {
			const next = prev.includes(id)
				? prev.filter((fid) => fid !== id)
				: [...prev, id];
			AsyncStorage.setItem(EVENT_FAVORITES_KEY, JSON.stringify(next));
			return next;
		});
	}, []);

	return { favoriteEventIds, toggleEventFavorite };
}
