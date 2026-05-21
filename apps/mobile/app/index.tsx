import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

// Entry redirector: punt the user to the right route group based on
// whether Clerk has a session loaded for them.
export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null;
  return <Redirect href={isSignedIn ? '/(app)' : '/(auth)/sign-in'} />;
}
