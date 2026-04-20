const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withFirebaseMessaging(config) {
	return withAndroidManifest(config, async (config) => {
		const manifest = config.modResults;

		const app = manifest.manifest.application[0];

		// Asegurar namespace tools
		manifest.manifest.$["xmlns:tools"] = "http://schemas.android.com/tools";

		// Buscar si ya existe
		const existing = app["meta-data"]?.find(
			(m) =>
				m.$["android:name"] ===
				"com.google.firebase.messaging.default_notification_channel_id",
		);

		if (existing) {
			existing.$["android:value"] = "default";
			existing.$["tools:replace"] = "android:value";
		} else {
			app["meta-data"] = app["meta-data"] || [];
			app["meta-data"].push({
				$: {
					"android:name":
						"com.google.firebase.messaging.default_notification_channel_id",
					"android:value": "default",
					"tools:replace": "android:value",
				},
			});
		}

		return config;
	});
};
