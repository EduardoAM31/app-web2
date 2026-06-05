import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, TextField, colors, styles as ui } from '../src/ui';

export default function Recover() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const onSubmit = () => {
    Alert.alert(
      'Verifique seu e-mail',
      'Se houver uma conta associada a esse e-mail, enviamos instruções para redefinir a senha.',
      [{ text: 'OK', onPress: () => router.back() }],
    );
  };

  return (
    <SafeAreaView style={ui.screen}>
      <View style={local.container}>
        <Text style={ui.title}>Recuperar senha</Text>
        <Text style={[ui.muted, { marginBottom: 28 }]}>Enviaremos um link de redefinição</Text>

        <TextField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="seu@email.com"
        />

        <Button title="Enviar" onPress={onSubmit} />

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
