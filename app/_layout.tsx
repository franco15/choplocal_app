import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import { GiftCardProvider } from "@/contexts/GiftCardContext";
import { RedeemCodeProvider } from "@/contexts/RedeemCodeContext";
import { SuggestionProvider } from "@/contexts/SuggestionsContext";
import { UserProvider } from "@/contexts/UserContext";
import { queryClient } from "@/lib/api/queryClient";
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
	useFonts,
} from "@expo-google-fonts/inter";
import * as Sentry from "@sentry/react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, TouchableOpacity } from "react-native";
import "./global.css";

Sentry.init({
	dsn: "https://001dca4ce436bb2e1842ea56bee3ffd6@o275485.ingest.us.sentry.io/4510959168651264",
	enableAutoSessionTracking: true,
	tracesSampleRate: 1.0,
});

SplashScreen.preventAutoHideAsync();

function RootLayout() {
	let [fontsLoaded] = useFonts({
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
		Inter_700Bold,
	});

	if (!fontsLoaded) {
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<StatusBar style="dark" />
			<AuthProvider>
				<RootComponent />
			</AuthProvider>
		</QueryClientProvider>
	);
}

export default Sentry.wrap(RootLayout);

const RootComponent = () => {
	const router = useRouter();
	const { authenticated } = useAuthContext();

	useEffect(() => {
		// console.log("authenticated in root", authenticated);
		if (authenticated !== null) SplashScreen.hide();
		if (!authenticated) {
			router.replace("/(auth)");
		} else {
			router.replace("/(tabs)");
		}
	}, [authenticated]);

	// if (authenticated === null) console.log("auth null");

	if (!authenticated)
		return (
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="(auth)" />
			</Stack>
		);

	return (
		<UserProvider>
			<GiftCardProvider>
				<RedeemCodeProvider>
					<SuggestionProvider>
						<Stack screenOptions={{ headerShown: false }}>
							<Stack.Screen name="(tabs)" />
							<Stack.Screen
								name="restaurants"
								options={{
									headerShown:
										Platform.OS === "ios" ? true : false,
									headerShadowVisible: false,
									headerTitle: "",
									headerBackTitle: "Back",
									headerStyle: { backgroundColor: "#FFFFFF" },
									headerRightContainerStyle: {
										backgroundColor: "transparent",
									},
									headerRight: () => (
										<TouchableOpacity
											activeOpacity={0.7}
											onPress={() =>
												router.push("/redeem-code")
											}
											style={{
												width: 44,
												height: 44,
												borderRadius: 22,
												backgroundColor: "#F0FAFA",
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											<Ionicons
												name="ticket-outline"
												size={22}
												color="#438989"
											/>
										</TouchableOpacity>
									),
								}}
							/>
							<Stack.Screen
								name="qr"
								options={{
									headerShown:
										Platform.OS === "ios" ? true : false,
									headerShadowVisible: false,
									headerTitle: "",
									headerBackTitle: "Back",
								}}
							/>
							<Stack.Screen
								name="suggestions"
								options={{
									headerShown:
										Platform.OS === "ios" ? true : false,
									headerShadowVisible: false,
									headerTitle: "",
									headerBackTitle: "Back",
									headerTransparent: true,
								}}
							/>
							<Stack.Screen
								name="search"
								options={{
									headerShown: false,
									animation: "fade",
								}}
							/>
							<Stack.Screen
								name="restaurant-list"
								options={{
									headerShown:
										Platform.OS === "ios" ? true : false,
									headerShadowVisible: false,
									headerTitle: "",
									headerBackTitle: "Home",
									headerStyle: {
										backgroundColor: "#FEFCFB",
									},
								}}
							/>
							<Stack.Screen
								name="gift-cards"
								options={{
									headerShown: false,
								}}
							/>
							<Stack.Screen
								name="redeem-code"
								options={{
									headerShown: false,
								}}
							/>
							<Stack.Screen
								name="welcome-recommendation"
								options={{
									headerShown: false,
									gestureEnabled: false,
								}}
							/>
						</Stack>
					</SuggestionProvider>
				</RedeemCodeProvider>
			</GiftCardProvider>
		</UserProvider>
	);
};
