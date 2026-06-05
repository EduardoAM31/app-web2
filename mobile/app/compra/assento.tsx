import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { api } from '../../src/api';
import { useCompra } from '../../src/compra-context';
import { Button, colors, styles as ui } from '../../src/ui';
import { formatarDataHora } from '../../src/format';
import type { Ingresso } from '../../src/types';

function Quadro({ cor, borda }: { cor: string; borda?: boolean }) {
  return (
    <View
      style={{
        width: 14,
        height: 14,
        backgroundColor: cor,
        borderWidth: borda ? 1 : 0,
        borderColor: colors.border,
        borderRadius: 3,
        marginRight: 6,
      }}
    />
  );
}

export default function AssentoScreen() {
  const router = useRouter();
  const { sessao, assentos, toggleAssento } = useCompra();
  const [ocupados, setOcupados] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Matriz vinda da sala (fallback 5x10 se a sala não tiver configurado).
  const fileiras = sessao?.sala?.fileiras ?? 5;
  const colunas = sessao?.sala?.colunas ?? 10;
  const rows = Array.from({ length: fileiras }, (_, f) => String.fromCharCode(65 + f));

  const carregarOcupacao = useCallback(async () => {
    if (!sessao) return;
    setCarregando(true);
    try {
      const { data } = await api.get<Ingresso[]>('/ingressos');
      // Assentos realmente ocupados nesta sessão (campo `assento` do ingresso).
      const ocupadosDaSessao = data
        .filter((i) => i.sessaoId === sessao.id && !!i.assento)
        .map((i) => i.assento as string);
      setOcupados(ocupadosDaSessao);
    } catch {
      setOcupados([]);
    } finally {
      setCarregando(false);
    }
  }, [sessao]);

  useFocusEffect(
    useCallback(() => {
      carregarOcupacao();
    }, [carregarOcupacao]),
  );

  if (!sessao) {
    return (
      <View style={ui.center}>
        <Text style={ui.muted}>Nenhuma sessão selecionada.</Text>
        <View style={{ height: 12 }} />
        <Button title="Voltar" variant="outline" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={ui.screen}>
      <ScrollView contentContainerStyle={ui.content}>
        <Text style={local.filme}>{sessao.filme?.titulo ?? `Filme #${sessao.filmeId}`}</Text>
        <Text style={ui.muted}>{formatarDataHora(sessao.horarioInicio)}</Text>
        <Text style={ui.muted}>
          Sala {sessao.sala?.numero ?? sessao.salaId} · {fileiras}x{colunas}
        </Text>

        <View style={local.tela}>
          <Text style={local.telaText}>TELA</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {rows.map((row) => (
              <View key={row} style={local.gridRow}>
                {Array.from({ length: colunas }, (_, i) => {
                  const seat = `${row}${i + 1}`;
                  const isOcupado = ocupados.includes(seat);
                  const isSelecionado = assentos.some((a) => a.assento === seat);
                  return (
                    <Pressable
                      key={seat}
                      disabled={isOcupado || carregando}
                      onPress={() => toggleAssento(seat)}
                      style={[
                        local.seat,
                        isOcupado && local.seatOcupado,
                        isSelecionado && local.seatSelecionado,
                      ]}
                    >
                      <Text
                        style={[
                          local.seatText,
                          isOcupado && local.seatTextOcupado,
                          isSelecionado && local.seatTextSelecionado,
                        ]}
                      >
                        {seat}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={local.legenda}>
          <View style={local.legItem}>
            <Quadro cor={colors.bg} borda />
            <Text style={ui.muted}>Livre</Text>
          </View>
          <View style={local.legItem}>
            <Quadro cor={colors.primary} />
            <Text style={ui.muted}>Selecionado</Text>
          </View>
          <View style={local.legItem}>
            <Quadro cor={colors.disabled} />
            <Text style={ui.muted}>Ocupado</Text>
          </View>
        </View>
      </ScrollView>

      <View style={local.footer}>
        <Text style={local.assentoSel}>
          {assentos.length > 0
            ? `Selecionados (${assentos.length}): ${assentos.map((a) => a.assento).join(', ')}`
            : 'Selecione um ou mais assentos'}
        </Text>
        <Button
          title="Continuar"
          disabled={assentos.length === 0}
          onPress={() => router.push('/compra/lanches')}
        />
      </View>
    </View>
  );
}

const local = StyleSheet.create({
  filme: { fontSize: 20, fontWeight: '700', color: colors.text },
  tela: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
    marginVertical: 16,
    backgroundColor: '#f2f2f2',
  },
  telaText: { color: colors.muted, letterSpacing: 4, fontSize: 12 },
  gridRow: { flexDirection: 'row', justifyContent: 'center' },
  seat: {
    width: 30,
    height: 30,
    margin: 3,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  seatOcupado: { backgroundColor: colors.disabled, borderColor: colors.disabled },
  seatSelecionado: { backgroundColor: colors.primary, borderColor: colors.primary },
  seatText: { fontSize: 9, color: colors.text },
  seatTextOcupado: { color: '#999999' },
  seatTextSelecionado: { color: colors.primaryText },
  legenda: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  legItem: { flexDirection: 'row', alignItems: 'center' },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  assentoSel: { textAlign: 'center', marginBottom: 10, color: colors.text, fontWeight: '600' },
});
