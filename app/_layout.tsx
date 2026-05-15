import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider} from '@/context/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown : false}}>
          <Stack.Screen name="(onboarding_screen)"/>
          <Stack.Screen name="(tabs)"/>
          <Stack.Screen name="(fournisseurs_tabs)"/>
          <Stack.Screen name="inscription"/>
          <Stack.Screen name="connexion"/>
          <Stack.Screen name="marketplace"  />
           <Stack.Screen name="(vote)"/>
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      </AuthProvider>
      <StatusBar style='dark'/>
    </ThemeProvider>
  );
}
