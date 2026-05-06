const { withAppBuildGradle } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const PROPS_FILE = path.join(__dirname, "..", "keystores", "signing.properties");

function readSigningProps() {
	if (!fs.existsSync(PROPS_FILE)) return null;
	const props = {};
	for (const line of fs.readFileSync(PROPS_FILE, "utf8").split("\n")) {
		const m = line.match(/^([^=#]+?)=(.*)$/);
		if (m) props[m[1].trim()] = m[2].trim();
	}
	if (!props.storeFile || !props.storePassword || !props.keyAlias || !props.keyPassword) {
		return null;
	}
	if (!path.isAbsolute(props.storeFile)) {
		props.storeFile = path.resolve(__dirname, "..", props.storeFile);
	}
	return props;
}

function groovy(s) {
	return s.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function injectReleaseSigning(buildGradle, props) {
	if (buildGradle.includes("signingConfigs.release")) return buildGradle;

	const releaseBlock = `        release {
            storeFile file('${groovy(props.storeFile)}')
            storePassword '${groovy(props.storePassword)}'
            keyAlias '${groovy(props.keyAlias)}'
            keyPassword '${groovy(props.keyPassword)}'
        }`;

	const withRelease = buildGradle.replace(
		/(signingConfigs\s*\{[^{]*debug\s*\{[^{}]*\})\s*(\})/,
		(_, before, close) => `${before}\n${releaseBlock}\n    ${close}`,
	);
	if (withRelease === buildGradle) {
		throw new Error("[withAndroidSigning] could not locate signingConfigs { debug { ... } } block");
	}

	const wired = withRelease.replace(
		/(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig signingConfigs\.debug/,
		"$1signingConfig signingConfigs.release",
	);
	if (wired === withRelease) {
		throw new Error("[withAndroidSigning] could not locate release buildType signingConfig line");
	}

	return wired;
}

module.exports = function withAndroidSigning(config) {
	return withAppBuildGradle(config, (cfg) => {
		const props = readSigningProps();
		if (!props) {
			console.warn("[withAndroidSigning] keystores/signing.properties missing or incomplete; release will fall back to debug key");
			return cfg;
		}
		cfg.modResults.contents = injectReleaseSigning(cfg.modResults.contents, props);
		return cfg;
	});
};
