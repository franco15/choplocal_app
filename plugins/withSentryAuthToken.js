const { withSentry } = require("@sentry/react-native/expo");
const fs = require("fs");
const path = require("path");

const TOKEN_FILE = path.join(__dirname, "..", ".sentry-token");

function readToken() {
	try {
		return fs.readFileSync(TOKEN_FILE, "utf8").trim() || undefined;
	} catch {
		return undefined;
	}
}

module.exports = function withSentryAuthToken(config) {
	const authToken = readToken();
	return withSentry(config, {
		url: "https://sentry.io/",
		organization: "xipe",
		project: "choplocal",
		...(authToken && { authToken }),
	});
};
