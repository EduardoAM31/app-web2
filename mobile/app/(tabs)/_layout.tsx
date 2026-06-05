import { Tabs } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { useAuth } from '../../src/auth-context';
import { colors } from '../../src/ui';

export default function TabsLayout() {
  const { logout } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTitleStyle: { color: colors.text },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.border },
        headerRight: () => (
          <Pressable onPress={() => logout()} hitSlop={10} style={{ paddingHorizontal: 16 }}>
            <Text style={{ color: colors.text, fontWeight: '600' }}>Sair</Text>
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen name="filmes" options={{ title: 'Filmes' }} />
      <Tabs.Screen name="sessoes" options={{ title: 'Sessões' }} />
      <Tabs.Screen name="meus-ingressos" options={{ title: 'Meus Ingressos' }} />
    </Tabs>
  );
}
