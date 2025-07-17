import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import { utils } from "@/lib";
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
	useFonts,
} from "@expo-google-fonts/inter";
import { Slot, useRouter } from "expo-router";
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
			<RootComponent />
		</AuthProvider>
	);
}

const RootComponent = () => {
	const router = useRouter();
	const { authState } = useAuthContext();

	useEffect(() => {
		if (!authState.authenticated && utils.isNullOrWhitespace(authState.token)) {
			router.replace("/login");
		} else if (
			authState.authenticated &&
			!utils.isNullOrWhitespace(authState.token)
		)
			router.replace("/");
	}, [authState]);

	return <Slot />;
};
