import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { api } from '../../src/api';
import { useCompra } from '../../src/compra-context';
import { Button, Card, Loading, colors, styles as ui } from '../../src/ui';
import { formatarDataHora, formatarMoeda } from '../../src/format';
import type { Sessao } from '../../src/types';

export default function SessoesScreen() {
  const router = useRouter();
  const { setSessao } = useCompra();
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErro(null);
    try {
      const { data } = await api.get<Sessao[]>('/sessoes');
      setSessoes(data);
    } catch {
      setErro('Não foi possível carregar as sessões.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const comprar = (s: Sessao) => {
    setSessao(s);
    router.push('/compra/assento');
  };

  if (loading) return <Loading />;

  return (
    <View style={ui.screen}>
      <FlatList
        data={sessoes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={ui.content}
        refreshControl={<RefreshControl refreshing={false} onRefresh={load} />}
        ListEmptyComponent={
          <Text style={[ui.muted, { textAlign: 'center', marginTop: 40 }]}>
            {erro ?? 'Nenhuma sessão disponível.'}
          </Text>
        }
        renderItem={({ item }) => (
          <Card>
            <Text style={local.titulo}>{item.filme?.titulo ?? `Filme #${item.filmeId}`}</Text>
            <Text style={ui.muted}>{formatarDataHora(item.horarioInicio)}</Text>
            <Text style={ui.muted}>
              Sala {item.sala?.numero ?? item.salaId} · {formatarMoeda(item.valorIngresso)}
            </Text>
            <View style={{ marginTop: 12 }}>
              <Button title="Comprar" onPress={() => comprar(item)} />
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const local = StyleSheet.create({
  titulo: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
});
