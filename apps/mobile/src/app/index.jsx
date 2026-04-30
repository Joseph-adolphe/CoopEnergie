import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("ce_token")
      .then((token) => {
        setIsLoggedIn(!!token);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  if (!ready) return null;
  // Redirect to the tabs home screen or login
  if (isLoggedIn) return <Redirect href="/(tabs)/cooperatives" />;
  return <Redirect href="/auth/login" />;
}
