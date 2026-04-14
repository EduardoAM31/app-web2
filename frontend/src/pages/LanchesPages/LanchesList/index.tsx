import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { lancheComboService } from '../../../services/lanchecombo.service';
import type { ILancheCombo } from '../../../models/lanchecombo.model';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const LanchesList = () => {
  const [lanches, setLanches] = useState<ILancheCombo[]>([]);
  const [loading, setLoading] = useState(true);

  const carregar = async () => {
    try {
      const data = await lancheComboService.findAll();
      setLanches(data);
    } catch (error) {
      console.error('Erro ao carregar lanches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Deseja realmente excluir este combo?')) return;

    try {
      await lancheComboService.delete(id);
      carregar();
    } catch (error) {
      console.error('Erro ao excluir combo:', error);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  if (loading) {
    return <div>Carregando combos...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lanches / Combos</h2>

        <Link to="/lanches/novo" className="btn btn-primary">
          Adicionar Combo
        </Link>
      </div>

      {lanches.length === 0 ? (
        <div className="alert alert-info">Nenhum combo cadastrado.</div>
      ) : (
        <table className="table table-striped table-bordered align-middle">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Itens</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lanches.map((lanche) => (
              <tr key={lanche.id}>
                <td>{lanche.nome}</td>
                <td>{lanche.descricao}</td>
                <td>R$ {Number(lanche.preco).toFixed(2)}</td>
                <td>{lanche.itens ?? '-'}</td>
                <td className="d-flex gap-2">
                  <Link
                    to={`/lanches/${lanche.id}`}
                    className="btn btn-sm btn-warning"
                    title="Editar"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Link>

                  <button
                    onClick={() => handleDelete(lanche.id)}
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