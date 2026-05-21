import { Pressable, Text, View } from 'react-native';

type Household = {
  id: string;
  name: string;
  currency: string;
  createdAt: Date;
};

export function HouseholdList({ households }: { households: Household[] }) {
  if (households.length === 0) {
    return <EmptyState />;
  }

  return (
    <View className="gap-3">
      <View className="flex-row items-baseline justify-between">
        <Text className="font-bold text-[13px] uppercase tracking-[2.5px] text-text-muted">
          Your houses
        </Text>
      </View>
      {households.map((h) => (
        <Pressable
          key={h.id}
          className="rounded-card border border-line bg-primary-faint p-5 active:opacity-70"
        >
          <View className="flex-row items-center justify-between">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
              <Text className="text-[18px]">🏠</Text>
            </View>
            <View className="rounded-full bg-white px-2.5 py-0.5">
              <Text className="font-bold text-[11px] tracking-wider text-primary-text-soft">
                {h.currency}
              </Text>
            </View>
          </View>
          <Text className="mt-4 font-bold text-[18px] text-text">{h.name}</Text>
          <Text className="mt-1 text-[13px] text-text-muted">
            Opened{' '}
            {new Intl.DateTimeFormat('en-CA', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }).format(new Date(h.createdAt))}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function EmptyState() {
  return (
    <View className="items-center py-10">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-faint">
        <Text className="text-[32px]">🏠</Text>
      </View>
      <Text className="mt-6 max-w-[280px] text-center font-bold text-[22px] leading-snug text-text">
        Open your first house to start splitting.
      </Text>
      <Text className="mt-2 max-w-[280px] text-center text-[15px] text-text-muted">
        Create a house here or on the web — bills come next.
      </Text>
    </View>
  );
}
