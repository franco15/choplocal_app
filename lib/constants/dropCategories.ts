import { ICategory } from "../types/event";

export const EVENT_TAGS = [
	"Party",
	"Music",
	"Food",
	"Sports",
	"Lifestyle",
	"Healthy",
	"Other",
];

/** Emoji for each category — used as the visual accent on cards */
export const CATEGORY_EMOJI: Record<string, string> = {
	Party: "🎉",
	Music: "🎵",
	Food: "🍔",
	Sports: "⚽",
	Lifestyle: "🌿",
	Healthy: "🥗",
	Other: "✨",
};

/** Tints kept for backwards compat (not used in gradient design). */
export const CATEGORY_TINT: Record<string, string> = {
	Party: "#F4EEEC",
	Music: "#EFEEF2",
	Food: "#F3EEE6",
	Sports: "#EBEEF1",
	Lifestyle: "#ECEFEA",
	Healthy: "#EAEFEC",
	Other: "#EFEFEF",
};

export const ALL_CATEGORIES: ICategory[] = [
	{
		name: "Party",
		image: "https://picsum.photos/seed/party-drop/800/400",
		color: "#8B2942",
	},
	{
		name: "Music",
		image: "https://picsum.photos/seed/music-drop/800/400",
		color: "#2C3759",
	},
	{
		name: "Food",
		image: "https://picsum.photos/seed/food-drop/800/400",
		color: "#A04A2C",
	},
	{
		name: "Sports",
		image: "https://picsum.photos/seed/sports-drop/800/400",
		color: "#2C6B4A",
	},
	{
		name: "Lifestyle",
		image: "https://picsum.photos/seed/lifestyle-drop/800/400",
		color: "#523068",
	},
	{
		name: "Healthy",
		image: "https://picsum.photos/seed/healthy-drop/800/400",
		color: "#1F5C5C",
	},
	{
		name: "Other",
		image: "https://picsum.photos/seed/other-drop/800/400",
		color: "#383843",
	},
];
