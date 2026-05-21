import * as SecureStore from 'expo-secure-store';

// Clerk token cache backed by expo-secure-store. Persists the session
// JWT between app launches so the user stays signed in.
export const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Swallow — Clerk handles fallback when the cache fails.
    }
  },
};
