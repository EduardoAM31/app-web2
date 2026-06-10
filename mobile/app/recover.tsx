import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../src/api';
import { Button, TextField, colors, styles as ui } from '../src/ui';

export default function Recover() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email || !senha) {
      setErro('Preencha e-mail e nova senha.');
      return;
    }
    if (senha.length < 6) {
      setErro('A nova senha deve ter ao menos 6 caracteres.');
      return;
    }
    if (senha !== confirmar) {
      setErro('As senhas não coincidem.');
      return;
    }

    setErro(null);
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email: email.trim(), password: senha });
      Alert.alert(
        'Senha redefinida',
        'Sua senha foi alterada com sucesso. Faça login com a nova senha.',
        [{ text: 'OK', onPress: () => router.replace('/login') }],
      );
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      setErro(
        Array.isArray(msg) ? msg.join('\n') : (msg ?? 'Não foi possível redefinir a senha.'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={ui.screen}>
      <View style={local.container}>
        <Text style={ui.title}>Redefinir senha</Text>
        <Text style={[ui.muted, { marginBottom: 28 }]}>
          Informe seu e-mail e a nova senha
        </Text>

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
          label="Nova senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="mínimo 6 caracteres"
        />
        <TextField
          label="Confirmar nova senha"
          value={confirmar}
          onChangeText={setConfirmar}
          secureTextEntry
          placeholder="repita a senha"
        />

        {erro ? <Text style={ui.errorText}>{erro}</Text> : null}

        <Button
          title={loading ? 'Salvando...' : 'Redefinir senha'}
          onPress={onSubmit}
          disabled={loading}
        />

        <View style={local.links}>
          <Link href="/login" style={local.link}>
            Voltar ao login
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
