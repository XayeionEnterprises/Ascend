import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useUserStore } from '../store/useUserStore';
import { isOnboarded } from '../lib/storage';
import { COLORS } from '../lib/constants';

/**
 * Entry point — redirects based on app state:
 * - Not onboarded → /onboarding
 * - No profile → /(auth)/welcome
 * - Has profile → /(tabs)
 */
export default function IndexScreen() {
  const { profile, isLoaded } = useUserStore();

  useEffect(() => {
    if (!isLoaded) return;

    async function redirect() {
      const onboarded = await isOnboarded();
      if (!onboarded) {
        router.replace('/onboarding');
      } else if (!profile?.name) {
        router.replace('/(auth)/welcome');
      } else {
        router.replace('/(tabs)');
      }
    }

    redirect();
  }, [isLoaded, profile]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={COLORS.primary} size="large" />
    </View>
  );
}
