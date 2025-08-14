import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import { UserProvider, useUserContext } from "@/contexts/UserContext";
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
	useFonts,
} from "@expo-google-fonts/inter";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import "./global.css";

export default function RootLayout() {
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
		<AuthProvider>
			<UserProvider>
				<RootComponent />
			</UserProvider>
		</AuthProvider>
	);
}

const RootComponent = () => {
	const router = useRouter();
	const { authenticated } = useAuthContext();
	const { profileCompleted } = useUserContext();

	useEffect(() => {
		if (!authenticated) {
			router.replace("/login");
		} else {
			router.replace("/");
		}
	}, [profileCompleted, authenticated]);

	if (!authenticated)
		return (
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="(auth)" />
			</Stack>
		);

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="(tabs)" />
			<Stack.Screen name="restaurants" />
			<Stack.Screen name="transactions" />
		</Stack>
	);
};
