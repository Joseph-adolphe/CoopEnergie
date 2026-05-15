import React from 'react';
import { Stack } from 'expo-router';

export default function MarketplaceLayout() {
  return <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="kit/[id]" options={{ headerShown: false }} />
        </Stack>;
}
