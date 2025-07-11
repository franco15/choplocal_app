export const isNullOrWhitespace = (str: string | null) => {
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
	if (part1.length === 3) formatted += ") ";
	if (part2) formatted += part2;
	if (part2.length === 3 && part3) formatted += `-${part3}`;

	return formatted;
}
