import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../src/auth-context';
import { CompraProvider } from '../src/compra-context';
import { initDb } from '../src/db';
import { Loading } from '../src/ui';

function RootNavigator() {
  const { token, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const first = segments[0];
    const inAuth = first === 'login' || first === 'register' || first === 'recover';
    if (!token && !inAuth) {
      router.replace('/login');
    } else if (token && inAuth) {
      router.replace('/(tabs)/filmes');
    }
  }, [token, loading, segments, router]);

  if (loading) return <Loading />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="recover" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="compra" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    initDb().catch((e) => console.error('Erro ao iniciar o banco local:', e));
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CompraProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </CompraProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
