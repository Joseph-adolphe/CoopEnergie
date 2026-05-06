import React from 'react';
import { Stack } from 'expo-router';

export default function CooperativeLayout() {
  return <Stack screenOptions={{headerShown : false}}>
        <Stack.Screen name="dashboard"  />
        <Stack.Screen name="cotiser"  />
        <Stack.Screen name="creation"  />
        <Stack.Screen name="membres"  />
        <Stack.Screen name="marketplace"  />
        <Stack.Screen name="vote"  />
        <Stack.Screen name="vote-admin"  />
        <Stack.Screen name="historique/[id]"  />
        <Stack.Screen name="rapport/[id]"  />
      </Stack>;
}
