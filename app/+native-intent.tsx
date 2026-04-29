const BRANCH_HANDOFF_PATHS = ["/open"];

export function redirectSystemPath({
	path,
}: {
	path: string;
	initial: boolean;
}) {
	try {
		const url = new URL(path, "app://placeholder");
		const isBranchHandoff =
			BRANCH_HANDOFF_PATHS.includes(url.pathname) ||
			url.searchParams.has("_branch_referrer") ||
			url.searchParams.has("_branch_match_id");

		if (isBranchHandoff) {
			return "/";
		}
		return path;
	} catch {
		return path;
	}
}
