import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function FournisseursLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].accentGreen,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="fournisseur_dashboard"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="produits"
        options={{
          title: 'Produits',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="cart.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="commandes"
        options={{
          title: ' Commandes',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="tray.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="compte"
        options={{
          title: 'Compte',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
