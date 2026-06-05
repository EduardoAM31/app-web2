import { Stack } from 'expo-router';
import { colors } from '../../src/ui';

export default function CompraLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTitleStyle: { color: colors.text },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="assento" options={{ title: 'Escolher assento' }} />
      <Stack.Screen name="lanches" options={{ title: 'Lanches' }} />
      <Stack.Screen name="pagamento" options={{ title: 'Pagamento' }} />
      <Stack.Screen
        name="comprovante"
        options={{ title: 'Comprovante', headerBackVisible: false }}
      />
    </Stack>
  );
}
