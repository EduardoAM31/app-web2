import { useEffect, useState } from 'react';

import { ingressosService } from '../../../services/ingressos.service';
import type { IIngresso } from '../../../models/ingresso.model';

export const IngressosAdmin = () => {
  const [ingressos, setIngressos] = useState<IIngresso[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const data = await ingressosService.findAll();
      setIngressos(data);
    } catch (e) {
      console.error('Erro ao carregar ingressos:', e);
      setErro('Não foi possível carregar os ingressos.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const total = ingressos.reduce((acc, i) => acc + Number(i.valorPago ?? 0), 0);

  if (carregando) {
    return <div className="container mt-4">Carregando ingressos...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Ingressos (Admin)</h2>
        <button className="btn btn-outline-secondary btn-sm" onClick={carregar}>
          Atualizar
        </button>
      </div>

      {erro && (
        <div className="alert alert-danger" role="alert">
          {erro}
        </div>
      )}

      {ingressos.length === 0 ? (
        <div className="alert alert-info">Nenhum ingresso comprado ainda.</div>
      ) : (
        <table className="table table-striped table-bordered align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Filme</th>
              <th>Sessão</th>
              <th>Sala</th>
              <th>Cadeira</th>
              <th>Tipo</th>
              <th className="text-end">Valor</th>
            </tr>
          </thead>
          <tbody>
            {ingressos.map((i) => (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.sessao?.filme?.titulo ?? '—'}</td>
                <td>
                  {i.sessao?.horarioInicio
                    ? new Date(i.sessao.horarioInicio).toLocaleString()
                    : '—'}
                </td>
                <td>{i.sessao?.sala?.numero ?? '—'}</td>
                <td>{i.assento ?? '—'}</td>
                <td>{i.tipo}</td>
                <td className="text-end">R$ {Number(i.valorPago ?? 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={6} className="text-end">
                Total ({ingressos.length} ingresso{ingressos.length === 1 ? '' : 's'}):
              </th>
              <th className="text-end">R$ {total.toFixed(2)}</th>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
};
