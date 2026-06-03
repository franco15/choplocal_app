import { ICategory } from "../types/event";

export const EVENT_TAGS = [
	"Party",
	"Networking",
	"Music & Culture",
	"Sports",
	"Community",
	"Clubs",
	"Other",
];

/** Emoji for each category — used as the visual accent on cards */
export const CATEGORY_EMOJI: Record<string, string> = {
	Party: "🎉",
	Networking: "🎵",
	"Music & Culture": "🍔",
	Sports: "⚽",
	Community: "🌿",
	Clubs: "🥗",
	Other: "✨",
};

/** Tints kept for backwards compat (not used in gradient design). */
export const CATEGORY_TINT: Record<string, string> = {
	Party: "#F4EEEC",
	Networking: "#EFEEF2",
	"Music & Culture": "#F3EEE6",
	Sports: "#EBEEF1",
	Community: "#ECEFEA",
	Clubs: "#EAEFEC",
	Other: "#EFEFEF",
};

export const ALL_CATEGORIES: ICategory[] = [
	{
		name: "Party",
		image: "https://picsum.photos/seed/party-drop/800/400",
		color: "#8B2942",
	},
	{
		name: "Networking",
		image: "https://picsum.photos/seed/networking-drop/800/400",
		color: "#523068",
	},
	{
		name: "Music & Culture",
		image: "https://picsum.photos/seed/music-drop/800/400",
		color: "#2C3759",
	},
	{
		name: "Sports",
		image: "https://picsum.photos/seed/sports-drop/800/400",
		color: "#2C6B4A",
	},
	{
		name: "Community",
		image: "https://picsum.photos/seed/community-drop/800/400",
		color: "#A04A2C",
	},
	{
		name: "Clubs",
		image: "https://picsum.photos/seed/clubs-drop/800/400",
		color: "#1F5C5C",
	},
	{
		name: "Other",
		image: "https://picsum.photos/seed/other-drop/800/400",
		color: "#383843",
	},
];
