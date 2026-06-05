import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { api } from '../../src/api';
import { useCompra } from '../../src/compra-context';
import { Button, Loading, colors, styles as ui } from '../../src/ui';
import { formatarMoeda } from '../../src/format';
import type { LancheCombo } from '../../src/types';

export default function LanchesScreen() {
  const router = useRouter();
  const { setLanches } = useCompra();
  const [combos, setCombos] = useState<LancheCombo[]>([]);
  const [qtd, setQtd] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get<LancheCombo[]>('/lanche-combos');
      setCombos(data);
    } catch {
      setCombos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const alterar = (id: number, delta: number) => {
    setQtd((prev) => {
      const novo = Math.max(0, (prev[id] ?? 0) + delta);
      return { ...prev, [id]: novo };
    });
  };

  const subtotal = useMemo(
    () => combos.reduce((acc, c) => acc + (qtd[c.id] ?? 0) * c.preco, 0),
    [combos, qtd],
  );

  const avancar = () => {
    const selecionados = combos
      .filter((c) => (qtd[c.id] ?? 0) > 0)
      .map((c) => ({
        lancheComboId: c.id,
        nome: c.nome,
        preco: c.preco,
        quantidade: qtd[c.id],
      }));
    setLanches(selecionados);
    router.push('/compra/pagamento');
  };

  const pular = () => {
    setLanches([]);
    router.push('/compra/pagamento');
  };

  if (loading) return <Loading />;

  return (
    <View style={ui.screen}>
      <FlatList
        data={combos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={ui.content}
        ListEmptyComponent={
          <Text style={[ui.muted, { textAlign: 'center', marginTop: 40 }]}>
            Nenhum lanche disponível.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={local.item}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={local.nome}>{item.nome}</Text>
              <Text style={ui.muted}>{formatarMoeda(item.preco)}</Text>
            </View>
            <View style={local.stepper}>
              <Pressable style={local.stepBtn} onPress={() => alterar(item.id, -1)}>
                <Text style={local.stepTxt}>−</Text>
              </Pressable>
              <Text style={local.qtd}>{qtd[item.id] ?? 0}</Text>
              <Pressable style={local.stepBtn} onPress={() => alterar(item.id, 1)}>
                <Text style={local.stepTxt}>+</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <View style={local.footer}>
        <Text style={local.subtotal}>Subtotal: {formatarMoeda(subtotal)}</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Button title="Pular" variant="outline" onPress={pular} />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="Continuar" onPress={avancar} />
          </View>
        </View>
      </View>
    </View>
  );
}

const local = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  nome: { fontSize: 16, fontWeight: '600', color: colors.text },
  stepper: { flexDirection: 'row', alignItems: 'center' },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTxt: { fontSize: 20, color: colors.text, lineHeight: 22 },
  qtd: { minWidth: 32, textAlign: 'center', fontSize: 16, color: colors.text },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  subtotal: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
});
