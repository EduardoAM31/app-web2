import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import {
  atualizarSincronizado,
  listarIngressos,
  listarNaoSincronizados,
  type IngressoLocal,
} from '../../src/db';
import { enviarCompraRemota } from '../../src/api';
import { Button, Card, colors, styles as ui } from '../../src/ui';
import { formatarDataHora, formatarMoeda } from '../../src/format';
import type { ComprovanteData } from '../../src/types';

export default function MeusIngressosScreen() {
  const [items, setItems] = useState<IngressoLocal[]>([]);
  const [sincronizando, setSincronizando] = useState(false);

  const load = useCallback(async () => {
    setItems(await listarIngressos());
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  // Reenvia para a API as compras ainda não sincronizadas (offline-first).
  const ressincronizar = async () => {
    setSincronizando(true);
    let enviados = 0;
    let falhas = 0;
    try {
      const pendentes = await listarNaoSincronizados();
      for (const it of pendentes) {
        try {
          const dados = JSON.parse(it.dados_json) as ComprovanteData;
          const pedido = await enviarCompraRemota(dados);
          const atualizado: ComprovanteData = {
            ...dados,
            pedidoId: pedido.id,
            valorTotal: pedido.valorTotal,
          };
          await atualizarSincronizado(it.id, pedido.id, JSON.stringify(atualizado));
          enviados++;
        } catch {
          falhas++;
        }
      }
      await load();
      Alert.alert(
        'Sincronização',
        pendentes.length === 0
          ? 'Tudo já estava sincronizado.'
          : `Enviados: ${enviados}.${falhas ? ` Falhas: ${falhas}.` : ''}`,
      );
    } finally {
      setSincronizando(false);
    }
  };

  return (
    <View style={ui.screen}>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={ui.content}
        ListHeaderComponent={
          <View style={{ marginBottom: 12 }}>
            <Button
              title={sincronizando ? 'Sincronizando...' : 'Atualizar / Sincronizar'}
              onPress={ressincronizar}
              disabled={sincronizando}
              variant="outline"
            />
          </View>
        }
        ListEmptyComponent={
          <Text style={[ui.muted, { textAlign: 'center', marginTop: 40 }]}>
            Você ainda não tem ingressos. Compre na aba Sessões.
          </Text>
        }
        renderItem={({ item }) => {
          const d = JSON.parse(item.dados_json) as ComprovanteData;
          return (
            <Card>
              <View style={local.row}>
                <Text style={local.titulo}>{d.filmeTitulo}</Text>
                <Text style={item.sincronizado ? local.ok : local.pend}>
                  {item.sincronizado ? 'Sincronizado' : 'Offline'}
                </Text>
              </View>
              <Text style={ui.muted}>{formatarDataHora(d.horarioInicio)}</Text>
              <Text style={ui.muted}>
                {d.assentos.length > 1 ? 'Assentos' : 'Assento'}{' '}
                {d.assentos.map((a) => a.assento).join(', ')} · Sala {d.salaNumero ?? '-'}
              </Text>
              <Text style={local.total}>{formatarMoeda(d.valorTotal)}</Text>
              <Text style={local.pedido}>
                {item.pedido_id ? `Pedido #${item.pedido_id}` : 'Aguardando envio à API'}
              </Text>
            </Card>
          );
        }}
      />
    </View>
  );
}

const local = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { fontSize: 17, fontWeight: '700', color: colors.text, flex: 1, paddingRight: 8 },
  total: { marginTop: 8, fontSize: 16, fontWeight: '700', color: colors.text },
  pedido: { marginTop: 2, color: colors.muted, fontSize: 12 },
  ok: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  pend: { color: colors.text, fontSize: 12, fontWeight: '700' },
});
