const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function fixFirebasePodspec(config) {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      // Fix 1: Patch the podspec path
      const podspecPath = path.join(
        config.modRequest.projectRoot,
        "node_modules",
        "@react-native-firebase",
        "messaging",
        "RNFBMessaging.podspec"
      );

      let podspecContent = fs.readFileSync(podspecPath, "utf-8");
      podspecContent = podspecContent.replace(
        "File.join('..', 'app', 'package.json')",
        "File.join(__dir__, '..', 'app', 'package.json')"
      );
      fs.writeFileSync(podspecPath, podspecContent);

      // Fix 2: Add modular_headers ONLY for Firebase pods (not globally)
      const podfilePath = path.join(
        config.modRequest.projectRoot,
        "ios",
        "Podfile"
      );

      let podfileContent = fs.readFileSync(podfilePath, "utf-8");

      // Remove global use_modular_headers! if present
      podfileContent = podfileContent.replace("use_modular_headers!\n", "");

      // Add targeted modular_headers for Firebase dependencies
      if (!podfileContent.includes("GoogleUtilities")) {
        const firebaseHeaders = `
# Firebase modular headers fix
pod 'FirebaseCoreInternal', :modular_headers => true
pod 'GoogleUtilities', :modular_headers => true
pod 'FirebaseCore', :modular_headers => true
`;
        // Insert before the first target block
        podfileContent = podfileContent.replace(
          /target ['"].*['"] do/,
          (match) => firebaseHeaders + "\n" + match
        );
        fs.writeFileSync(podfilePath, podfileContent);
      }

      return config;
    },
  ]);
};