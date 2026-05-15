import React from 'react';
import { Stack } from 'expo-router';

export default function voteLayout() {
  return <Stack screenOptions={{headerShown : false}}>
        <Stack.Screen name="creation-vote"  />
        <Stack.Screen name="vote-admin"  />
        <Stack.Screen name="vote-details"  />
        <Stack.Screen name="vote"  />
      </Stack>;
}
