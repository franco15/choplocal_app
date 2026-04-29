const KNOWN_TOP_LEVEL_ROUTES = new Set([
	"complete-profile",
	"events",
	"gift-cards",
	"notifications",
	"qr",
	"redeem-code",
	"restaurants",
	"settings",
	"suggestions",
	"welcome-recommendation",
]);
const BRANCH_HANDOFF_PATHS = ["/open"];
const BRANCH_SHORT_ID = /^[A-Za-z0-9_-]{4,}$/;

export function redirectSystemPath({
	path,
}: {
	path: string;
	initial: boolean;
}) {
	try {
		const url = new URL(path, "app://placeholder");

		if (
			BRANCH_HANDOFF_PATHS.includes(url.pathname) ||
			url.searchParams.has("_branch_referrer") ||
			url.searchParams.has("_branch_match_id")
		) {
			return "/";
		}

		const segments = url.pathname.split("/").filter(Boolean);
		const candidate =
			segments.length === 1
				? segments[0]
				: segments.length === 0 && url.host
					? url.host
					: null;

		if (
			candidate &&
			BRANCH_SHORT_ID.test(candidate) &&
			!KNOWN_TOP_LEVEL_ROUTES.has(candidate.toLowerCase())
		) {
			return "/";
		}

		return path;
	} catch {
		return path;
	}
}
