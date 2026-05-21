import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    if (!isLoaded || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const attempt = await signIn.create({ identifier, password });
      if (attempt.status === 'complete') {
        await setActive({ session: attempt.createdSessionId });
        router.replace('/(app)');
      } else {
        setError('Additional steps required — check your email.');
      }
    } catch (e: unknown) {
      const message =
        e && typeof e === 'object' && 'errors' in e
          ? (e as { errors: Array<{ message: string }> }).errors[0]?.message
          : 'Something went wrong.';
      setError(message ?? 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-faint">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-8">
          <Text className="text-center font-bold text-[13px] uppercase tracking-[2.5px] text-text-muted">
            Maison
          </Text>
          <Text className="mt-3 text-center font-bold text-[30px] leading-[1.15] text-primary">
            Housemate Sharing Made Easier
          </Text>

          <View className="flex-1 items-center justify-center">
            <Image
              source={require('../../assets/signin.png')}
              resizeMode="contain"
              className="h-64 w-full"
            />
          </View>
        </View>

        <View className="bg-white px-5 pb-6 pt-6">
          <Text className="mb-1.5 font-bold text-[13px] text-text">Email</Text>
          <TextInput
            value={identifier}
            onChangeText={setIdentifier}
            placeholder="you@example.com"
            placeholderTextColor="#9d8ccb"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            className="rounded-button border border-line bg-primary-faint px-4 py-3 text-[16px] text-text"
          />

          <Text className="mb-1.5 mt-4 font-bold text-[13px] text-text">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#9d8ccb"
            autoCapitalize="none"
            secureTextEntry
            className="rounded-button border border-line bg-primary-faint px-4 py-3 text-[16px] text-text"
          />

          {error ? (
            <Text className="mt-3 text-[14px] text-fail">{error}</Text>
          ) : null}

          <Pressable
            onPress={onSubmit}
            disabled={submitting || !identifier || !password}
            className="mt-5 h-[50px] flex-row items-center justify-center rounded-button bg-primary disabled:opacity-50"
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-bold text-[17px] tracking-[-0.41px] text-white">
                Sign in
              </Text>
            )}
          </Pressable>

          <Text className="mt-3 text-center text-[12px] text-text-muted">
            Use the email + password you set on the web app.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
