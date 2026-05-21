import { useAuth, useUser } from '@clerk/clerk-expo';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HouseholdList } from '@/features/household/components/household-list';
import { trpc } from '@/trpc/client';

export default function DashboardScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { data: households, isLoading } = trpc.household.list.useQuery();

  const firstName = user?.firstName ?? user?.username ?? 'there';

  return (
    <View className="flex-1 bg-white">
      {/* Purple header */}
      <SafeAreaView edges={['top']} className="bg-primary">
        <View className="px-5 pb-7 pt-2">
          <View className="flex-row items-center justify-between">
            <Text className="font-bold text-[13px] uppercase tracking-[2.5px] text-white/60">
              Maison
            </Text>
            <Text
              onPress={() => signOut()}
              className="font-bold text-[13px] uppercase tracking-[2px] text-white/80"
            >
              Sign out
            </Text>
          </View>

          <View className="mt-6">
            <Text className="font-bold text-[28px] leading-tight text-white">
              Hey, {firstName}.
            </Text>
            <Text className="mt-1 text-[15px] text-white/70">
              {households && households.length > 0
                ? 'Welcome back. Everything’s up to date.'
                : 'Let’s get your first house set up.'}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* White body */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24 }}
      >
        {isLoading ? (
          <Text className="text-[15px] text-text-muted">Loading…</Text>
        ) : (
          <HouseholdList households={households ?? []} />
        )}
      </ScrollView>
    </View>
  );
}
