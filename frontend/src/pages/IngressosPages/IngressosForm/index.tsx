import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { ISessao } from '../../../models/sessao.model';
import type { ILancheCombo } from '../../../models/lanchecombo.model';
import type { TipoIngresso } from '../../../models/ingresso.model';

import { ingressosService } from '../../../services/ingressos.service';
import { sessoesService } from '../../../services/sessoes.service';
import { lancheComboService } from '../../../services/lanchecombo.service';
import { pedidosService } from '../../../services/pedidos.service';

type LancheSelecionado = {
  lancheComboId: number;
  quantidade: number;
};

type AssentoSelecionado = {
  assento: string;
  tipo: TipoIngresso;
};

export const IngressosForm = () => {
  const navigate = useNavigate();
  const { sessaoId } = useParams<{ sessaoId?: string }>();

  const [sessao, setSessao] = useState<ISessao | null>(null);
  const [lanches, setLanches] = useState<ILancheCombo[]>([]);
  const [ocupados, setOcupados] = useState<string[]>([]);
  const [nomeComprador, setNomeComprador] = useState('');

  const [selecionados, setSelecionados] = useState<Record<string, AssentoSelecionado>>({});
  const [lanchesSelecionados, setLanchesSelecionados] = useState<
    Record<number, LancheSelecionado>
  >({});

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const carregar = async () => {
    if (!sessaoId) return;

    try {
      setCarregando(true);

      const [sessaoData, lanchesData, ingressosData] = await Promise.all([
        sessoesService.findById(sessaoId),
        lancheComboService.findAll(),
        ingressosService.findAll(),
      ]);

      setSessao(sessaoData);
      setLanches(lanchesData);
      setOcupados(
        ingressosData
          .filter((i) => Number(i.sessaoId) === Number(sessaoId) && !!i.assento)
          .map((i) => i.assento),
      );
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setSubmitError('Não foi possível carregar a sessão e os lanches.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, [sessaoId]);

  const valorInteira = useMemo(
    () => Number(Number(sessao?.valorIngresso ?? 0).toFixed(2)),
    [sessao],
  );
  const valorMeia = useMemo(
    () => Number((Number(sessao?.valorIngresso ?? 0) / 2).toFixed(2)),
    [sessao],
  );

  const fileiras = sessao?.sala?.fileiras ?? 0;
  const colunas = sessao?.sala?.colunas ?? 0;

  const valorDoAssento = (sel: AssentoSelecionado) =>
    sel.tipo === 'MEIA' ? valorMeia : valorInteira;

  const listaSelecionados = Object.values(selecionados);

  const subtotalIngressos = useMemo(
    () =>
      Number(
        listaSelecionados.reduce((acc, sel) => acc + valorDoAssento(sel), 0).toFixed(2),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selecionados, valorInteira, valorMeia],
  );

  const subtotalLanches = useMemo(() => {
    return Number(
      Object.values(lanchesSelecionados)
        .reduce((acc, item) => {
          const lanche = lanches.find((l) => Number(l.id) === item.lancheComboId);
          return lanche ? acc + Number(lanche.preco ?? 0) * item.quantidade : acc;
        }, 0)
        .toFixed(2),
    );
  }, [lanchesSelecionados, lanches]);

  const totalGeral = useMemo(
    () => Number((subtotalIngressos + subtotalLanches).toFixed(2)),
    [subtotalIngressos, subtotalLanches],
  );

  const toggleAssento = (assento: string) => {
    if (ocupados.includes(assento)) return;
    setSelecionados((prev) => {
      const novo = { ...prev };
      if (novo[assento]) delete novo[assento];
      else novo[assento] = { assento, tipo: 'INTEIRA' };
      return novo;
    });
  };

  const setTipoAssento = (assento: string, tipo: TipoIngresso) => {
    setSelecionados((prev) => ({ ...prev, [assento]: { assento, tipo } }));
  };

  const handleSelecionarLanche = (lancheId: number, checked: boolean) => {
    setLanchesSelecionados((prev) => {
      const novo = { ...prev };
      if (checked) novo[lancheId] = { lancheComboId: lancheId, quantidade: 1 };
      else delete novo[lancheId];
      return novo;
    });
  };

  const handleQuantidadeLanche = (lancheId: number, quantidade: string) => {
    const valor = Math.max(1, Number(quantidade) || 1);
    setLanchesSelecionados((prev) => ({
      ...prev,
      [lancheId]: { lancheComboId: lancheId, quantidade: valor },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!sessaoId || !sessao) {
      alert('Sessão inválida.');
      return;
    }

    const lista = Object.values(selecionados);
    if (lista.length === 0) {
      alert('Selecione ao menos um assento.');
      return;
    }

    try {
      setSubmitError(null);
      setSalvando(true);

      const ingressosCriados = [];
      for (const sel of lista) {
        const criado = await ingressosService.create({
          sessaoId: Number(sessaoId),
          tipo: sel.tipo,
          valorPago: valorDoAssento(sel),
          assento: sel.assento,
          nomeComprador: nomeComprador.trim() || undefined,
        });
        ingressosCriados.push(criado);
      }

      const lanchesPedido = Object.values(lanchesSelecionados).map((item) => ({
        lancheComboId: item.lancheComboId,
        quantidade: item.quantidade,
      }));

      await pedidosService.create({
        ingressoIds: ingressosCriados.map((i) => Number(i.id)),
        lanches: lanchesPedido,
      });

      alert('Compra realizada com sucesso!');
      navigate('/sessoes');
    } catch (error: any) {
      console.error('Erro ao finalizar compra:', error);
      setSubmitError(error?.message ?? String(error));
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return <div className="container mt-4">Carregando dados...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Compra de Ingressos</h2>

      {submitError && (
        <div className="alert alert-danger" role="alert">
          {submitError}
        </div>
      )}

      {sessao && (
        <div className="card mb-4">
          <div className="card-body">
            <p className="mb-1">
              <strong>Filme:</strong> {sessao.filme?.titulo ?? '-'}
            </p>
            <p className="mb-1">
              <strong>Sala:</strong> {sessao.sala?.numero ?? '-'} ({fileiras}x{colunas})
            </p>
            <p className="mb-1">
              <strong>Horário:</strong>{' '}
              {sessao.horarioInicio ? new Date(sessao.horarioInicio).toLocaleString() : '-'}
            </p>
            <p className="mb-1">
              <strong>Valor inteira:</strong> R$ {valorInteira.toFixed(2)}
            </p>
            <p className="mb-0">
              <strong>Valor meia:</strong> R$ {valorMeia.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-body">
            <label className="form-label">Nome do comprador</label>
            <input
              type="text"
              className="form-control"
              value={nomeComprador}
              onChange={(e) => setNomeComprador(e.target.value)}
              placeholder="Nome de quem está comprando"
            />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <strong>Escolha os assentos</strong>
          </div>
          <div className="card-body">
            <div className="text-center mb-3">
              <div className="border rounded py-1 text-muted" style={{ letterSpacing: 4 }}>
                TELA
              </div>
            </div>

            {fileiras === 0 || colunas === 0 ? (
              <p className="mb-0 text-muted">Esta sala não tem assentos configurados.</p>
            ) : (
              Array.from({ length: fileiras }, (_, f) => {
                const letra = String.fromCharCode(65 + f);
                return (
                  <div key={letra} className="d-flex justify-content-center flex-wrap">
                    {Array.from({ length: colunas }, (_, c) => {
                      const assento = `${letra}${c + 1}`;
                      const isOcupado = ocupados.includes(assento);
                      const isSel = !!selecionados[assento];
                      return (
                        <button
                          type="button"
                          key={assento}
                          disabled={isOcupado}
                          onClick={() => toggleAssento(assento)}
                          className={`btn btn-sm m-1 ${
                            isOcupado
                              ? 'btn-secondary'
                              : isSel
                                ? 'btn-dark'
                                : 'btn-outline-dark'
                          }`}
                          style={{ width: 46 }}
                          title={assento}
                        >
                          {assento}
                        </button>
                      );
                    })}
                  </div>
                );
              })
            )}

            <div className="mt-3 small text-muted">
              Toque para selecionar. Cinza = ocupado · Preto = selecionado.
            </div>
          </div>
        </div>

        {listaSelecionados.length > 0 && (
          <div className="card mb-4">
            <div className="card-header">
              <strong>Assentos selecionados ({listaSelecionados.length})</strong>
            </div>
            <div className="card-body">
              {listaSelecionados.map((sel) => (
                <div
                  key={sel.assento}
                  className="d-flex align-items-center justify-content-between mb-2"
                >
                  <span>
                    <strong>{sel.assento}</strong>
                  </span>
                  <div className="d-flex align-items-center gap-2">
                    <select
                      className="form-select form-select-sm"
                      style={{ width: 130 }}
                      value={sel.tipo}
                      onChange={(e) =>
                        setTipoAssento(sel.assento, e.target.value as TipoIngresso)
                      }
                    >
                      <option value="INTEIRA">Inteira</option>
                      <option value="MEIA">Meia</option>
                    </select>
                    <span style={{ width: 90 }} className="text-end">
                      R$ {valorDoAssento(sel).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => toggleAssento(sel.assento)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card mb-4">
          <div className="card-header">
            <strong>Lanches / Combos</strong>
          </div>
          <div className="card-body">
            {lanches.length === 0 ? (
              <p className="mb-0">Nenhum lanche/combo disponível.</p>
            ) : (
              lanches.map((lanche) => {
                const lancheId = Number(lanche.id);
                const selecionado = !!lanchesSelecionados[lancheId];
                const quantidade = lanchesSelecionados[lancheId]?.quantidade ?? 1;

                return (
                  <div key={lanche.id} className="border rounded p-3 mb-3">
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`lanche-${lanche.id}`}
                        checked={selecionado}
                        onChange={(e) => handleSelecionarLanche(lancheId, e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor={`lanche-${lanche.id}`}>
                        <strong>{lanche.nome}</strong> — R${' '}
                        {Number(lanche.preco ?? 0).toFixed(2)}
                      </label>
                    </div>

                    <div className="mb-2">
                      <small>{lanche.descricao}</small>
                    </div>

                    {selecionado && (
                      <div style={{ maxWidth: '180px' }}>
                        <label className="form-label">Quantidade</label>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          className="form-control"
                          value={quantidade}
                          onChange={(e) => handleQuantidadeLanche(lancheId, e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="alert alert-info">
          <p className="mb-1">
            <strong>Assentos:</strong> {listaSelecionados.length}
          </p>
          <p className="mb-1">
            <strong>Subtotal ingressos:</strong> R$ {subtotalIngressos.toFixed(2)}
          </p>
          <p className="mb-1">
            <strong>Subtotal lanches:</strong> R$ {subtotalLanches.toFixed(2)}
          </p>
          <p className="mb-0">
            <strong>Total geral:</strong> R$ {totalGeral.toFixed(2)}
          </p>
        </div>

        <button
          type="submit"
          className="btn btn-success"
          disabled={salvando || !sessao || listaSelecionados.length === 0}
        >
          {salvando ? 'Finalizando...' : 'Finalizar Compra'}
        </button>
      </form>
    </div>
  );
};
