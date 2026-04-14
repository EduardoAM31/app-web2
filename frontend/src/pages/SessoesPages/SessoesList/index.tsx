import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { sessoesService } from '../../../services/sessoes.service';
import type { ISessao } from '../../../models/sessao.model';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const SessoesList = () => {
  const [sessoes, setSessoes] = useState<ISessao[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarSessoes = async () => {
    try {
      const data = await sessoesService.findAll();
      setSessoes(data);
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Deseja realmente excluir esta sessão?')) return;

    try {
      await sessoesService.delete(id);
      carregarSessoes();
    } catch (error) {
      console.error('Erro ao excluir sessão:', error);
    }
  };

  useEffect(() => {
    carregarSessoes();
  }, []);

  if (carregando) {
    return <div>Carregando sessões...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista de Sessões</h2>

        <Link to="/sessoes/novo" className="btn btn-primary">
          Adicionar Sessão
        </Link>
      </div>

      {sessoes.length === 0 ? (
        <div className="alert alert-info">Nenhuma sessão cadastrada.</div>
      ) : (
        <table className="table table-striped table-bordered align-middle">
          <thead>
            <tr>
              <th>Filme</th>
              <th>Sala</th>
              <th>Horário</th>
              <th>Valor do Ingresso</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {sessoes.map((sessao) => (
              <tr key={sessao.id}>
                <td>{sessao.filme?.titulo ?? String(sessao.filmeId)}</td>
                <td>{sessao.sala?.numero ?? String(sessao.salaId)}</td>
                <td>
                  {sessao.horarioInicio
                    ? new Date(sessao.horarioInicio).toLocaleString()
                    : '-'}
                </td>
                <td>R$ {Number(sessao.valorIngresso ?? 0).toFixed(2)}</td>
                <td className="d-flex gap-2">
                  <Link
                    to={`/sessoes/${sessao.id}`}
                    className="btn btn-sm btn-warning"
                    title="Editar"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Link>

                  <Link
                    to={`/ingressos/${sessao.id}`}
                    className="btn btn-sm btn-success"
                    title="Vender ingresso"
                  >
                    <i className="bi bi-ticket-perforated"></i>
                  </Link>

                  <button
                    onClick={() => handleDelete(sessao.id)}
                    className="btn btn-sm btn-danger"
                    title="Excluir"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};