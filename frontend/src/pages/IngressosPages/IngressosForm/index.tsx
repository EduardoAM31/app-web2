import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { ISessao } from '../../../models/sessao.model';
import type { ILancheCombo } from '../../../models/lanchecombo.model';

import { ingressosService } from '../../../services/ingressos.service';
import { sessoesService } from '../../../services/sessoes.service';
import { lancheComboService } from '../../../services/lanchecombo.service';
import { pedidosService } from '../../../services/pedidos.service';

type LancheSelecionado = {
  lancheComboId: number;
  quantidade: number;
};

export const IngressosForm = () => {
  const navigate = useNavigate();
  const { sessaoId } = useParams<{ sessaoId?: string }>();

  const [sessao, setSessao] = useState<ISessao | null>(null);
  const [lanches, setLanches] = useState<ILancheCombo[]>([]);

  const [quantidadeInteira, setQuantidadeInteira] = useState<number>(0);
  const [quantidadeMeia, setQuantidadeMeia] = useState<number>(0);
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

      const [sessaoData, lanchesData] = await Promise.all([
        sessoesService.findById(sessaoId),
        lancheComboService.findAll(),
      ]);

      setSessao(sessaoData);
      setLanches(lanchesData);
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

  const valorInteira = useMemo(() => {
    if (!sessao) return 0;
    return Number(Number(sessao.valorIngresso ?? 0).toFixed(2));
  }, [sessao]);

  const valorMeia = useMemo(() => {
    if (!sessao) return 0;
    return Number((Number(sessao.valorIngresso ?? 0) / 2).toFixed(2));
  }, [sessao]);

  const subtotalIngressos = useMemo(() => {
    return Number(
      (quantidadeInteira * valorInteira + quantidadeMeia * valorMeia).toFixed(2),
    );
  }, [quantidadeInteira, quantidadeMeia, valorInteira, valorMeia]);

  const subtotalLanches = useMemo(() => {
    return Number(
      Object.values(lanchesSelecionados)
        .reduce((acc, item) => {
          const lanche = lanches.find((l) => Number(l.id) === item.lancheComboId);
          if (!lanche) return acc;

          const preco = Number(lanche.preco ?? 0);
          return acc + preco * item.quantidade;
        }, 0)
        .toFixed(2),
    );
  }, [lanchesSelecionados, lanches]);

  const totalGeral = useMemo(() => {
    return Number((subtotalIngressos + subtotalLanches).toFixed(2));
  }, [subtotalIngressos, subtotalLanches]);

  const handleSelecionarLanche = (lancheId: number, checked: boolean) => {
    setLanchesSelecionados((prev) => {
      const novo = { ...prev };

      if (checked) {
        novo[lancheId] = {
          lancheComboId: lancheId,
          quantidade: 1,
        };
      } else {
        delete novo[lancheId];
      }

      return novo;
    });
  };

  const handleQuantidadeLanche = (lancheId: number, quantidade: string) => {
    const valor = Math.max(1, Number(quantidade) || 1);

    setLanchesSelecionados((prev) => ({
      ...prev,
      [lancheId]: {
        lancheComboId: lancheId,
        quantidade: valor,
      },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!sessaoId || !sessao) {
      alert('Sessão inválida.');
      return;
    }

    if (quantidadeInteira < 0 || quantidadeMeia < 0) {
      alert('As quantidades não podem ser negativas.');
      return;
    }

    if (quantidadeInteira === 0 && quantidadeMeia === 0) {
      alert('Informe ao menos um ingresso inteira ou meia.');
      return;
    }

    try {
      setSubmitError(null);
      setSalvando(true);

      const ingressosCriados = [];

      for (let i = 0; i < quantidadeInteira; i++) {
        const ingressoCriado = await ingressosService.create({
          sessaoId: Number(sessaoId),
          tipo: 'INTEIRA',
          valorPago: valorInteira,
        });

        ingressosCriados.push(ingressoCriado);
      }

      for (let i = 0; i < quantidadeMeia; i++) {
        const ingressoCriado = await ingressosService.create({
          sessaoId: Number(sessaoId),
          tipo: 'MEIA',
          valorPago: valorMeia,
        });

        ingressosCriados.push(ingressoCriado);
      }

      const lanchesPedido = Object.values(lanchesSelecionados).map((item) => ({
        lancheComboId: item.lancheComboId,
        quantidade: item.quantidade,
      }));

      await pedidosService.create({
        ingressoIds: ingressosCriados.map((ingresso) => Number(ingresso.id)),
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
              <strong>Sala:</strong> {sessao.sala?.numero ?? '-'}
            </p>
            <p className="mb-1">
              <strong>Horário:</strong>{' '}
              {sessao.horarioInicio
                ? new Date(sessao.horarioInicio).toLocaleString()
                : '-'}
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
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Quantidade de Inteiras</label>
            <input
              type="number"
              min="0"
              step="1"
              className="form-control"
              value={quantidadeInteira}
              onChange={(e) =>
                setQuantidadeInteira(Math.max(0, Number(e.target.value) || 0))
              }
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Quantidade de Meias</label>
            <input
              type="number"
              min="0"
              step="1"
              className="form-control"
              value={quantidadeMeia}
              onChange={(e) =>
                setQuantidadeMeia(Math.max(0, Number(e.target.value) || 0))
              }
            />
          </div>
        </div>

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
                        onChange={(e) =>
                          handleSelecionarLanche(lancheId, e.target.checked)
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`lanche-${lanche.id}`}
                      >
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
                          onChange={(e) =>
                            handleQuantidadeLanche(lancheId, e.target.value)
                          }
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
            <strong>Subtotal inteiras:</strong> R${' '}
            {(quantidadeInteira * valorInteira).toFixed(2)}
          </p>
          <p className="mb-1">
            <strong>Subtotal meias:</strong> R${' '}
            {(quantidadeMeia * valorMeia).toFixed(2)}
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

        <button type="submit" className="btn btn-success" disabled={salvando || !sessao}>
          {salvando ? 'Finalizando...' : 'Finalizar Compra'}
        </button>
      </form>
    </div>
  );
};