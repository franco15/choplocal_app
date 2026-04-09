const { withAndroidStyles } = require("@expo/config-plugins");

module.exports = function withAndroidTheme(config) {
	return withAndroidStyles(config, (config) => {
		const styles = config.modResults;

		if (!styles.resources.style) return config;

		styles.resources.style = styles.resources.style.map((style) => {
			if (style.$.name === "AppTheme") {
				style.$.parent = "Theme.MaterialComponents.DayNight.NoActionBar";
			}
			return style;
		});

		return config;
	});
};
