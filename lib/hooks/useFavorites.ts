import { FAVORITES_KEY } from "@/constants/keys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function useFavorites() {
	const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

	useFocusEffect(
		useCallback(() => {
			AsyncStorage.getItem(FAVORITES_KEY).then((val) => {
				if (val) setFavoriteIds(JSON.parse(val));
				else setFavoriteIds([]);
			});
		}, []),
	);

	const toggleFavorite = useCallback((id: string) => {
		setFavoriteIds((prev) => {
			const next = prev.includes(id)
				? prev.filter((fid) => fid !== id)
				: [...prev, id];
			AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
			return next;
		});
	}, []);

	return { favoriteIds, toggleFavorite };
}