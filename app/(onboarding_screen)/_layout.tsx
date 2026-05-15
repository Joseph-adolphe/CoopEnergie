import React from 'react';
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="02_create_cooperative" />
        <Stack.Screen name="03_cotiser_ensemble"  />
        <Stack.Screen name="04_voter" />
        <Stack.Screen name="05_objectifs"  />
        <Stack.Screen name="06_bienvenue"  />
      </Stack>
}
