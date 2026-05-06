import React from 'react';
import { Stack } from 'expo-router';

export default function produitLayout() {
  return <Stack screenOptions={{headerShown : false}}>
        <Stack.Screen name="produits"  />
        <Stack.Screen name="01_creation_produit"  />
        <Stack.Screen name="02_creation_produit"  />
        <Stack.Screen name="03_creation_produit"  />
      </Stack>;
}
