import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../src/auth-context';
import { Button, TextField, colors, styles as ui } from '../src/ui';

export default function Register() {
  const { register } = useAuth();
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!nome || !email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter ao menos 6 caracteres.');
      return;
    }
    setErro(null);
    setLoading(true);
    try {
      await register(nome.trim(), email.trim(), senha);
      router.replace('/(tabs)/filmes');
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      setErro(
        Array.isArray(msg) ? msg.join('\n') : (msg ?? 'Não foi possível criar a conta.'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={ui.screen}>
      <View style={local.container}>
        <Text style={ui.title}>Criar conta</Text>
        <Text style={[ui.muted, { marginBottom: 28 }]}>Leva menos de um minuto</Text>

        <TextField label="Nome" value={nome} onChangeText={setNome} placeholder="Seu nome" />
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
          placeholder="mínimo 6 caracteres"
        />

        {erro ? <Text style={ui.errorText}>{erro}</Text> : null}

        <Button title={loading ? 'Criando...' : 'Cadastrar'} onPress={onSubmit} disabled={loading} />

        <View style={local.links}>
          <Link href="/login" style={local.link}>
            Já tenho conta
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const local = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  links: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  link: { color: colors.text, textDecorationLine: 'underline', fontSize: 14 },
});
