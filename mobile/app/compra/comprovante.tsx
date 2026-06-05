import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { obterIngresso } from '../../src/db';
import { useCompra } from '../../src/compra-context';
import { Button, Card, Loading, colors, styles as ui } from '../../src/ui';
import { formatarDataHora, formatarMoeda } from '../../src/format';
import type { ComprovanteData } from '../../src/types';

function Info({ label, valor }: { label: string; valor: string }) {
  return (
    <View style={local.info}>
      <Text style={ui.muted}>{label}</Text>
      <Text style={local.infoValor}>{valor}</Text>
    </View>
  );
}

export default function ComprovanteScreen() {
  const router = useRouter();
  const { reset } = useCompra();
  const { localId } = useLocalSearchParams<{ localId: string }>();
  const [dados, setDados] = useState<ComprovanteData | null>(null);
  const [sincronizado, setSincronizado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    const id = Number(localId);
    if (!id) {
      setCarregando(false);
      return;
    }
    const row = await obterIngresso(id);
    if (row) {
      setDados(JSON.parse(row.dados_json) as ComprovanteData);
      setSincronizado(row.sincronizado === 1);
    }
    setCarregando(false);
  }, [localId]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  if (carregando) return <Loading />;

  if (!dados) {
    return (
      <View style={ui.center}>
        <Text style={ui.muted}>Comprovante não encontrado.</Text>
      </View>
    );
  }

  // QR a partir do id do pedido (ou do id local, se ainda não sincronizado).
  const qrValor = dados.pedidoId ? `PEDIDO:${dados.pedidoId}` : `LOCAL:${localId}`;

  const concluir = () => {
    reset();
    router.replace('/(tabs)/meus-ingressos');
  };

  return (
    <View style={ui.screen}>
      <ScrollView contentContainerStyle={[ui.content, { alignItems: 'center' }]}>
        <Text style={local.titulo}>Compra registrada</Text>
        <Text style={[ui.muted, { marginBottom: 20 }]}>
          {sincronizado ? 'Sincronizado com a bilheteria' : 'Salvo no dispositivo (offline)'}
        </Text>

        <Card style={local.card}>
          <Text style={local.filme}>{dados.filmeTitulo}</Text>
          <Text style={ui.muted}>{formatarDataHora(dados.horarioInicio)}</Text>

          <View style={local.qrWrap}>
            <QRCode value={qrValor} size={180} color={colors.text} backgroundColor={colors.bg} />
          </View>

          <Info
            label={dados.assentos.length > 1 ? 'Assentos' : 'Assento'}
            valor={dados.assentos
              .map((a) => `${a.assento} (${a.tipo === 'MEIA' ? 'Meia' : 'Inteira'})`)
              .join(', ')}
          />
          <Info label="Sala" valor={String(dados.salaNumero ?? '-')} />
          {dados.lanches.length > 0 && (
            <Info
              label="Lanches"
              valor={dados.lanches.map((l) => `${l.quantidade}x ${l.nome}`).join(', ')}
            />
          )}
          <Info label="Total" valor={formatarMoeda(dados.valorTotal)} />
          <Info label="Pedido" valor={dados.pedidoId ? `#${dados.pedidoId}` : 'pendente'} />
        </Card>

        <View style={{ width: '100%', marginTop: 8 }}>
          <Button title="Concluir" onPress={concluir} />
        </View>
      </ScrollView>
    </View>
  );
}

const local = StyleSheet.create({
  titulo: { fontSize: 22, fontWeight: '700', color: colors.text, marginTop: 8 },
  card: { width: '100%', alignItems: 'stretch' },
  filme: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
  qrWrap: { alignItems: 'center', paddingVertical: 20 },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoValor: { color: colors.text, fontWeight: '600', flexShrink: 1, textAlign: 'right', marginLeft: 12 },
});
