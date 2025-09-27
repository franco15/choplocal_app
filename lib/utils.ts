import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const isNullOrWhitespace = (str: string | null | undefined) => {
	if (!str) return true;
	str = str.trim();
	return str === "" || str.match(/^ *$/) !== null;
};

export function formatPhoneNumber(phone: string): string {
	const cleaned = phone.replace(/\D/g, "").slice(0, 10); // keep only digits
	const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

	if (!match) return phone;

	const [, part1, part2, part3] = match;

	let formatted = "";
	if (part1) formatted += `(${part1}`;
	if (part1.length === 3 && part2.length > 0) formatted += ") ";
	if (part2) formatted += part2;
	if (part2.length === 3 && part3) formatted += `-${part3}`;

	return formatted;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const inlcudesCaseInsensitive = (lookIn: string, search: string) => {
	return lookIn?.toLocaleLowerCase().includes(search.toLocaleLowerCase());
};

export const getAppVersion = (): string => {
	let version = "";
	if (__DEV__) return `v${process.env.PRE_RELEASE}`;
	version = `v${process.env.MAJOR_VERSION}.${process.env.MINOR_VERSION}.${process.env.PATCH_VERSION}`;
	if (process.env.PRE_RELEASE !== null && process.env.PRE_RELEASE !== "")
		version = version + "-" + process.env.PRE_RELEASE;
	return version;
};

export const shadowStyle = {
	borderColor: "#FFFFFF",
	backgroundColor: "#FFFFFF",
	elevation: 3,
	shadowColor: "#000000",
	shadowOffset: { width: 0, height: 2 },
	shadowOpacity: 0.18,
	shadowRadius: 3.5,
};

export function getDaysDifference(startDate: Date, endDate: Date) {
	const diffMs = endDate.getTime() - startDate.getTime();
	const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
	return diffDays;
}

export function getTimeAgo(date: Date) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	date.setHours(0, 0, 0, 0);
	const diffMs = today.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	if (diffDays === 0) return "Today";
	if (diffDays < 7)
		return `${diffDays.toFixed(0)} ${diffDays === 1 ? "Day ago" : "Days ago"}`;
	const weeks = diffDays / 7;
	return `${weeks.toFixed(0)} ${weeks === 1 ? "Week ago" : "Weeks ago"}`;
}

export const circularReplacer = () => {
	const seen = new WeakSet();
	return (key: any, value: any) => {
		if (value != null && typeof value == "object") {
			if (seen.has(value)) return;
			seen.add(value);
		}
		return value;
	};
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
