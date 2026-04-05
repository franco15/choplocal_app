import { HeaderBackButton } from "@/components";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import { GiftCardProvider } from "@/contexts/GiftCardContext";
import { RedeemCodeProvider } from "@/contexts/RedeemCodeContext";
import { SuggestionProvider } from "@/contexts/SuggestionsContext";
import { UserProvider } from "@/contexts/UserContext";
import { queryClient } from "@/lib/api/queryClient";
import { useStripeApi } from "@/lib/api/useApi";
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
	useFonts,
} from "@expo-google-fonts/inter";
import * as Sentry from "@sentry/react-native";
import { StripeProvider } from "@stripe/stripe-react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
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
		if (authenticated !== null) SplashScreen.hide();
		if (!authenticated) {
			router.replace("/(auth)");
		} else {
			router.replace("/(tabs)");
		}
	}, [authenticated]);

	if (!authenticated)
		return (
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="(auth)" />
			</Stack>
		);

	return (
		<UserProvider>
			<StripeWrapper>
				<GiftCardProvider>
					<RedeemCodeProvider>
						<SuggestionProvider>
							<Stack screenOptions={{ headerShown: false }}>
								<Stack.Screen name="(tabs)" />
								<Stack.Screen
									name="restaurants"
									options={{
										headerShown: false,
									}}
								/>
								<Stack.Screen
									name="qr"
									options={{
										headerShown: false,
									}}
								/>
								<Stack.Screen
									name="suggestions"
									options={{
										headerShown: false,
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
								<Stack.Screen
									name="settings"
									options={{
										headerShown: false,
									}}
								/>
								<Stack.Screen
									name="notifications"
									options={{
										headerShown: true,
										headerShadowVisible: false,
										headerTitle: "",
										headerStyle: {
											backgroundColor: "#FFFFFF",
										},
										headerLeft: () => <HeaderBackButton />,
									}}
								/>
							</Stack>
						</SuggestionProvider>
					</RedeemCodeProvider>
				</GiftCardProvider>
			</StripeWrapper>
		</UserProvider>
	);
};

const StripeWrapper = ({ children }: { children: React.ReactNode }) => {
	const [publishableKey, setPublishableKey] = useState("");
	const stripeApi = useStripeApi();

	useEffect(() => {
		stripeApi
			.getConfig()
			.then((data) => setPublishableKey(data.publishableKey))
			.catch(() => {});
	}, []);

	if (!publishableKey) return <>{children}</>;

	return (
		<StripeProvider publishableKey={publishableKey}>
			<>{children}</>
		</StripeProvider>
	);
};
