import React from 'react';
import { Stack } from 'expo-router';

export default function CreationLayout() {
  return <Stack screenOptions={{headerShown : false}}>
        <Stack.Screen name="01_creation"  />
        <Stack.Screen name="02_invitation"  />
        <Stack.Screen name="03_success"  />
      </Stack>;
}