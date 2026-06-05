import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../src/auth-context';
import { Button, TextField, colors, styles as ui } from '../src/ui';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    setErro(null);
    setLoading(true);
    try {
      await login(email.trim(), senha);
      router.replace('/(tabs)/filmes');
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      setErro(
        Array.isArray(msg)
          ? msg.join('\n')
          : (msg ?? 'Não foi possível entrar. Verifique suas credenciais.'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={ui.screen}>
      <View style={local.container}>
        <Text style={ui.title}>Cinemagyn</Text>
        <Text style={[ui.muted, { marginBottom: 28 }]}>Faça login para continuar</Text>

        <TextField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="seu@email.com"
        />
        <TextField
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="••••••"
        />

        {erro ? <Text style={ui.errorText}>{erro}</Text> : null}

        <Button title={loading ? 'Entrando...' : 'Entrar'} onPress={onSubmit} disabled={loading} />

        <View style={local.links}>
          <Link href="/register" style={local.link}>
            Criar conta
          </Link>
          <Link href="/recover" style={local.link}>
            Esqueci a senha
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const local = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  links: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22 },
  link: { color: colors.text, textDecorationLine: 'underline', fontSize: 14 },
});
