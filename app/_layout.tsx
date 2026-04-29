import { HeaderBackButton } from "@/components";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import { DeepLinkProvider, useDeepLinkContext } from "@/contexts/DeepLinkContext";
import { GiftCardProvider } from "@/contexts/GiftCardContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { RedeemCodeProvider } from "@/contexts/RedeemCodeContext";
import { SuggestionProvider } from "@/contexts/SuggestionsContext";
import { UserProvider, useUserContext } from "@/contexts/UserContext";
import { queryClient } from "@/lib/api/queryClient";
import { useStripeApi } from "@/lib/api/useApi";
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
	useFonts,
} from "@expo-google-fonts/inter";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Sentry from "@sentry/react-native";
import { StripeProvider } from "@stripe/stripe-react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import branch from "react-native-branch";
import "./global.css";

const ALLOWED_ROUTE_PREFIXES = ["/restaurants/"];

const buildRouteFromParams = (params: Record<string, any>): string | null => {
	const route = params?.route;
	if (typeof route !== "string") return null;
	if (!ALLOWED_ROUTE_PREFIXES.some((prefix) => route.startsWith(prefix))) {
		return null;
	}
	return route;
};

Notifications.setNotificationHandler({
	handleNotification: async () => {
		// console.log("Manejando notificación entrante...");
		return {
			shouldPlaySound: true,
			shouldSetBadge: true,
			shouldShowBanner: true,
			shouldShowList: true,
		};
	},
});

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
		<GestureHandlerRootView style={{ flex: 1 }}>
			<BottomSheetModalProvider>
				<QueryClientProvider client={queryClient}>
					<StatusBar style="dark" />
					<AuthProvider>
						<DeepLinkProvider>
							<RootComponent />
						</DeepLinkProvider>
					</AuthProvider>
				</QueryClientProvider>
			</BottomSheetModalProvider>
		</GestureHandlerRootView>
	);
}

export default Sentry.wrap(RootLayout);

const RootComponent = () => {
	const router = useRouter();
	const { authenticated } = useAuthContext();
	const { setPendingRoute } = useDeepLinkContext();

	useEffect(() => {
		if (authenticated !== null) SplashScreen.hide();
		if (!authenticated) {
			router.replace("/(auth)");
		} else {
			router.replace("/(tabs)");
		}
	}, [authenticated]);

	useEffect(() => {
		const unsubscribe = branch.subscribe(({ error, params }) => {
			if (error || !params) return;
			if (params["+clicked_branch_link"] !== true) return;
			const route = buildRouteFromParams(params as Record<string, any>);
			if (route) setPendingRoute(route);
		});
		return () => {
			unsubscribe();
		};
	}, []);

	if (!authenticated)
		return (
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="(auth)" />
			</Stack>
		);

	return (
		<UserProvider>
			<NotificationsProvider>
				<StripeWrapper>
					<GiftCardProvider>
						<RedeemCodeProvider>
							<SuggestionProvider>
								<DeferredDeepLinkBridge />
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
			</NotificationsProvider>
		</UserProvider>
	);
};

const DeferredDeepLinkBridge = () => {
	const router = useRouter();
	const { authenticated, isNewUser } = useAuthContext();
	const { user, isUserLoading, profileComplete } = useUserContext();
	const { pendingRoute, consumePendingRoute } = useDeepLinkContext();

	useEffect(() => {
		if (!authenticated) return;
		if (isNewUser) return;
		if (isUserLoading) return;
		if (!user) return;
		if (!profileComplete) return;
		if (!pendingRoute) return;
		const target = consumePendingRoute();
		if (target) router.push(target as any);
	}, [
		authenticated,
		isNewUser,
		isUserLoading,
		user,
		profileComplete,
		pendingRoute,
	]);

	return null;
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
