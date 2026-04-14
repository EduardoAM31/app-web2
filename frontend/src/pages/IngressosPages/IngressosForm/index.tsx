import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { ISessao } from '../../../models/sessao.model';
import { ingressoSchema, type TipoIngresso } from '../../../models/ingresso.model';
import { ingressosService } from '../../../services/ingressos.service';
import { sessoesService } from '../../../services/sessoes.service';

export const IngressosForm = () => {
  const navigate = useNavigate();
  const { sessaoId } = useParams<{ sessaoId?: string }>();

  const [sessao, setSessao] = useState<ISessao | null>(null);
  const [tipo, setTipo] = useState<TipoIngresso | ''>('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const carregar = async () => {
    if (!sessaoId) return;

    try {
      setCarregando(true);
      const data = await sessoesService.findById(sessaoId);
      setSessao(data);
    } catch (error) {
      console.error('Erro ao carregar sessão:', error);
      setSubmitError('Não foi possível carregar a sessão.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, [sessaoId]);

  const valorPago = useMemo(() => {
    if (!sessao || !tipo) return 0;

    const valorBase = Number(sessao.valorIngresso ?? 0);

    if (tipo === 'MEIA') {
      return Number((valorBase / 2).toFixed(2));
    }

    return Number(valorBase.toFixed(2));
  }, [sessao, tipo]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!sessaoId || !sessao) {
      alert('Sessão inválida.');
      return;
    }

    const payload = {
      sessaoId: Number(sessaoId),
      tipo,
      valorPago,
    };

    const validacao = ingressoSchema.safeParse(payload);

    if (!validacao.success) {
      alert(validacao.error.issues[0]?.message ?? 'Dados inválidos.');
      return;
    }

    try {
      setSubmitError(null);

      await ingressosService.create({
        sessaoId: Number(validacao.data.sessaoId),
        tipo: validacao.data.tipo,
        valorPago: Number(validacao.data.valorPago),
      });

      alert('Ingresso vendido com sucesso!');
      navigate('/sessoes');
    } catch (error: any) {
      console.error('Erro ao vender ingresso:', error);
      setSubmitError(error?.message ?? String(error));
    }
  };

  if (carregando) {
    return <div className="container mt-4">Carregando sessão...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Venda de Ingresso</h2>

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
            <p className="mb-0">
              <strong>Horário:</strong>{' '}
              {sessao.horarioInicio
                ? new Date(sessao.horarioInicio).toLocaleString()
                : '-'}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tipo de Ingresso</label>
          <select
            className="form-select"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoIngresso | '')}
          >
            <option value="">Selecione...</option>
            <option value="INTEIRA">Inteira</option>
            <option value="MEIA">Meia</option>
          </select>
        </div>

        {tipo && (
          <div className="alert alert-info">
            <strong>Valor Final:</strong> R$ {valorPago.toFixed(2)}
          </div>
        )}

        <button type="submit" className="btn btn-success" disabled={!sessao || !tipo}>
          Confirmar Venda
        </button>
      </form>
    </div>
  );
};