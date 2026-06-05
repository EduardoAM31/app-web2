import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { salasService } from '../../../services/sala.service';
import type { ISala } from '../../../models/sala.model';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const SalasList = () => {
  const [salas, setSalas] = useState<ISala[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarSalas = async () => {
    try {
      const data = await salasService.findAll();
      setSalas(data);
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Deseja realmente excluir esta sala?')) return;

    try {
      await salasService.delete(id);
      carregarSalas();
    } catch (error) {
      console.error('Erro ao excluir sala:', error);
    }
  };

  useEffect(() => {
    carregarSalas();
  }, []);

  if (carregando) {
    return <div>Carregando salas...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista de Salas</h2>

        <Link to="/salas/novo" className="btn btn-primary">
          Adicionar Sala
        </Link>
      </div>

      {salas.length === 0 ? (
        <div className="alert alert-info">Nenhuma sala cadastrada.</div>
      ) : (
        <table className="table table-striped table-bordered align-middle">
          <thead>
            <tr>
              <th>Número</th>
              <th>Assentos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {salas.map((sala) => (
              <tr key={sala.id}>
                <td>{sala.numero}</td>
                <td>
                  {sala.fileiras}×{sala.colunas} ({sala.fileiras * sala.colunas})
                </td>
                <td className="d-flex gap-2">
                  <Link
                    to={`/salas/${sala.id}`}
                    className="btn btn-sm btn-warning"
                    title="Editar"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Link>

                  <button
                    onClick={() => handleDelete(sala.id)}
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