import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { api } from '../../src/api';
import { Card, Loading, colors, styles as ui } from '../../src/ui';
import type { Filme } from '../../src/types';

export default function FilmesScreen() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErro(null);
    try {
      const { data } = await api.get<Filme[]>('/filmes');
      setFilmes(data);
    } catch {
      setErro('Não foi possível carregar os filmes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading) return <Loading />;

  return (
    <View style={ui.screen}>
      <FlatList
        data={filmes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={ui.content}
        refreshControl={<RefreshControl refreshing={false} onRefresh={load} />}
        ListEmptyComponent={
          <Text style={[ui.muted, { textAlign: 'center', marginTop: 40 }]}>
            {erro ?? 'Nenhum filme disponível.'}
          </Text>
        }
        renderItem={({ item }) => (
          <Card>
            <Text style={local.titulo}>{item.titulo}</Text>
            <Text style={ui.muted}>
              {item.genero?.nome ?? 'Sem gênero'} · {item.duracao} min · {item.classificacaoEtaria}
            </Text>
            {item.sinopse ? <Text style={local.sinopse}>{item.sinopse}</Text> : null}
          </Card>
        )}
      />
    </View>
  );
}

const local = StyleSheet.create({
  titulo: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  sinopse: { color: colors.text, marginTop: 8, lineHeight: 20 },
});
