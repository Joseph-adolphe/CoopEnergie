import React from 'react';
import { Stack } from 'expo-router';

export default function CooperativeLayout() {
  return <Stack>
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="cotiser" options={{ headerShown: false }} />
        <Stack.Screen name="creation" options={{ headerShown: false }} />
        <Stack.Screen name="membres" options={{ headerShown: false }} />
        <Stack.Screen name="vote" options={{ headerShown: false }} />
        <Stack.Screen name="vote-admin" options={{ headerShown: false }} />
        <Stack.Screen name="historique/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="rapport/[id]" options={{ headerShown: false }} />
      </Stack>;
}
