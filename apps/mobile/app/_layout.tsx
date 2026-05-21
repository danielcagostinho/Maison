import '../global.css';

import { ClerkProvider } from '@clerk/clerk-expo';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { tokenCache } from '@/lib/token-cache';
import { TRPCProvider } from '@/trpc/provider';

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ProductSansRegular: require('../assets/ProductSansRegular.ttf'),
    ProductSansBold: require('../assets/ProductSansBold.ttf'),
    ProductSansItalic: require('../assets/ProductSansItalic.ttf'),
    ProductSansBoldItalic: require('../assets/ProductSansBoldItalic.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  if (!publishableKey) {
    throw new Error(
      'Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY — add it to apps/mobile/.env.local',
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <TRPCProvider>
        <StatusBar style="dark" />
        <Slot />
      </TRPCProvider>
    </ClerkProvider>
  );
}
