import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/auth-context';
import { useCompra } from '../../src/compra-context';
import { enviarCompraRemota } from '../../src/api';
import { atualizarSincronizado, inserirIngresso } from '../../src/db';
import { Button, Card, colors, styles as ui } from '../../src/ui';
import { formatarDataHora, formatarMoeda } from '../../src/format';
import type { ComprovanteData, TipoIngresso } from '../../src/types';

function Linha({ label, valor }: { label: string; valor: string }) {
  return (
    <View style={local.linha}>
      <Text style={ui.muted}>{label}</Text>
      <Text style={local.linhaValor}>{valor}</Text>
    </View>
  );
}

function TipoToggle({
  tipo,
  onChange,
}: {
  tipo: TipoIngresso;
  onChange: (t: TipoIngresso) => void;
}) {
  const opcoes: { valor: TipoIngresso; label: string }[] = [
    { valor: 'INTEIRA', label: 'Inteira' },
    { valor: 'MEIA', label: 'Meia' },
  ];
  return (
    <View style={local.toggle}>
      {opcoes.map((op) => {
        const ativo = tipo === op.valor;
        return (
          <Pressable
            key={op.valor}
            onPress={() => onChange(op.valor)}
            style={[local.toggleBtn, ativo && local.toggleBtnAtivo]}
          >
            <Text style={[local.toggleText, ativo && local.toggleTextAtivo]}>{op.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function PagamentoScreen() {
  const router = useRouter();
  const { sessao, assentos, lanches, setTipoAssento } = useCompra();
  const { user } = useAuth();
  const [processando, setProcessando] = useState(false);

  const totalLanches = useMemo(
    () => lanches.reduce((acc, l) => acc + l.preco * l.quantidade, 0),
    [lanches],
  );

  if (!sessao || assentos.length === 0) {
    return (
      <View style={ui.center}>
        <Text style={ui.muted}>Dados da compra incompletos.</Text>
        <View style={{ height: 12 }} />
        <Button title="Voltar" variant="outline" onPress={() => router.back()} />
      </View>
    );
  }

  const valorInteira = sessao.valorIngresso;
  const valorMeia = valorInteira / 2;
  const valorDoTipo = (tipo: TipoIngresso) => (tipo === 'MEIA' ? valorMeia : valorInteira);

  const valorIngressos = assentos.reduce((acc, a) => acc + valorDoTipo(a.tipo), 0);
  const valorTotal = valorIngressos + totalLanches;

  const finalizar = async () => {
    if (!user) {
      Alert.alert('Sessão expirada', 'Faça login novamente para concluir a compra.');
      return;
    }
    setProcessando(true);

    const dados: ComprovanteData = {
      assentos: assentos.map((a) => ({
        assento: a.assento,
        tipo: a.tipo,
        valor: valorDoTipo(a.tipo),
      })),
      sessaoId: sessao.id,
      filmeTitulo: sessao.filme?.titulo ?? `Filme #${sessao.filmeId}`,
      horarioInicio: sessao.horarioInicio,
      salaNumero: sessao.sala?.numero ?? null,
      lanches,
      valorTotal,
      pedidoId: null,
    };

    // 1) Salva primeiro no SQLite (offline-first).
    let localId: number;
    try {
      localId = await inserirIngresso(JSON.stringify(dados), null, 0, user.id);
    } catch {
      setProcessando(false);
      Alert.alert('Erro', 'Não foi possível salvar o ingresso localmente.');
      return;
    }

    // 2) Tenta enviar para a API; se falhar (offline), fica pendente.
    try {
      const pedido = await enviarCompraRemota(dados);
      const atualizado: ComprovanteData = {
        ...dados,
        pedidoId: pedido.id,
        valorTotal: pedido.valorTotal,
      };
      await atualizarSincronizado(localId, pedido.id, JSON.stringify(atualizado));
    } catch {
      // Mantém como não sincronizado para reenviar depois em "Meus Ingressos".
    } finally {
      setProcessando(false);
      router.replace({
        pathname: '/compra/comprovante',
        params: { localId: String(localId) },
      });
    }
  };

  return (
    <View style={ui.screen}>
      <ScrollView contentContainerStyle={ui.content}>
        <Text style={ui.subtitle}>Resumo</Text>

        <Card>
          <Linha label="Filme" valor={sessao.filme?.titulo ?? `Filme #${sessao.filmeId}`} />
          <Linha label="Sessão" valor={formatarDataHora(sessao.horarioInicio)} />
          <Linha label="Sala" valor={String(sessao.sala?.numero ?? sessao.salaId)} />
        </Card>

        <Card>
          <Text style={local.cardTitle}>Assentos ({assentos.length})</Text>
          {assentos.map((a) => (
            <View key={a.assento} style={local.assentoRow}>
              <Text style={local.assentoLabel}>{a.assento}</Text>
              <TipoToggle tipo={a.tipo} onChange={(t) => setTipoAssento(a.assento, t)} />
              <Text style={local.assentoValor}>{formatarMoeda(valorDoTipo(a.tipo))}</Text>
            </View>
          ))}
        </Card>

        {lanches.length > 0 && (
          <Card>
            <Text style={local.cardTitle}>Lanches</Text>
            {lanches.map((l) => (
              <Linha
                key={l.lancheComboId}
                label={`${l.quantidade}x ${l.nome}`}
                valor={formatarMoeda(l.preco * l.quantidade)}
              />
            ))}
          </Card>
        )}

        <Card>
          <View style={local.totalRow}>
            <Text style={local.totalLabel}>Total</Text>
            <Text style={local.totalValor}>{formatarMoeda(valorTotal)}</Text>
          </View>
        </Card>
      </ScrollView>

      <View style={local.footer}>
        <Button
          title={processando ? 'Processando...' : 'Finalizar compra'}
          disabled={processando}
          onPress={finalizar}
        />
      </View>
    </View>
  );
}

const local = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  linhaValor: {
    color: colors.text,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 8 },
  assentoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  assentoLabel: { fontSize: 16, fontWeight: '700', color: colors.text, width: 42 },
  assentoValor: { width: 80, textAlign: 'right', color: colors.text, fontWeight: '600' },
  toggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleBtn: { paddingVertical: 6, paddingHorizontal: 12 },
  toggleBtnAtivo: { backgroundColor: colors.primary },
  toggleText: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  toggleTextAtivo: { color: colors.primaryText },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 18, fontWeight: '700', color: colors.text },
  totalValor: { fontSize: 18, fontWeight: '700', color: colors.text },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
});
